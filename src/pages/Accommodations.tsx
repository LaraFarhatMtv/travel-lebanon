import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroSection from '@/components/accommodations/HeroSection';
import FilterSection from '@/components/accommodations/FilterSection';
import AccommodationCard from '@/components/accommodations/AccommodationCard';
import EmptyState from '@/components/accommodations/EmptyState';
import { directusAPI } from '@/services/api';

// Commented out static data import
// import { accommodations } from '@/data/accommodations';

const Accommodations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const subcategoryId = searchParams.get('subcategoryId');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [data, setData] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  
  useEffect(() => {
    const getSubcategories = async () => {
      try {
        const response = await directusAPI.getsubCategories(id);
        if (response) {
          console.log(response.data);
          setData(response.data);
        }
      } catch (e) {
        console.log("error fetch subCategories", e);
      }
    };
    getSubcategories();
  }, [id]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await directusAPI.getItems(Number(subcategoryId), Number(id) || 0);
        console.log("items", response.data);
        setAccommodations(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };
    getItems();
  }, [id, subcategoryId]);

  // Sync currentTab with subcategoryId from URL when component mounts or URL changes
  useEffect(() => {
    if (subcategoryId) {
      setCurrentTab(subcategoryId);
    } else {
      setCurrentTab("all");
    }
  }, [subcategoryId]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
    
    // Create new search params based on current ones
    const newSearchParams = new URLSearchParams(location.search);
    
    if (value === "all") {
      // Remove subcategoryId if "all" is selected
      newSearchParams.delete('subcategoryId');
    } else {
      // Set subcategoryId parameter
      newSearchParams.set('subcategoryId', value);
    }
    
    // Navigate to the new URL with updated search params
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };
  
  // Only filter by search term and price range since subcategory filtering is done server-side
  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = 
      (accommodation.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (accommodation.location?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (accommodation.subCategoryId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesPrice = 
      (accommodation.price >= priceRange[0] && accommodation.price <= priceRange[1]) || 
      (!accommodation.price); // Include items without price
    
    return matchesSearch && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setCurrentTab("all");
    setPriceRange([0, 300]);
    
    // Clear URL parameters
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('subcategoryId');
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <FilterSection
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        subcategories={data}
      />
      
      {filteredAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map(accommodation => (
            <AccommodationCard 
              key={accommodation.id} 
              accommodation={accommodation} 
            />
          ))}
        </div>
      ) : (
        <EmptyState resetFilters={resetFilters} />
      )}
    </div>
  );
};

export default Accommodations;
