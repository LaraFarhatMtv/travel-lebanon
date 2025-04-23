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
        // Only make the API call if subcategoryId is specified
        if (subcategoryId) {
          const response = await directusAPI.getItems(Number(subcategoryId), null);
          console.log("items for specific subcategory:", response.data);
          setAccommodations(response.data);
        } else if (currentTab === "all" && data.length > 0) {
          // For "all" tab with existing subcategories data, fetch from all subcategories
          const fetchPromises = data.map(subcategory => 
            directusAPI.getItems(subcategory.id, null)
              .then(response => response.data || [])
              .catch(err => {
                console.error(`Error fetching items for subcategory ${subcategory.id}:`, err);
                return [];
              })
          );
          
          Promise.all(fetchPromises)
            .then(resultsArray => {
              const allItems = resultsArray.flat();
              const uniqueItems = Object.values(
                allItems.reduce((acc, item) => {
                  if (!acc[item.id]) {
                    acc[item.id] = item;
                  }
                  return acc;
                }, {})
              );
              
              console.log(`Fetched ${uniqueItems.length} items from all subcategories`);
              setAccommodations(uniqueItems);
            });
        } else {
          // First load without any subcategory selected - don't make the problematic call
          // Just leave the accommodations array empty until user selects a subcategory
          console.log("Waiting for subcategory selection before loading items");
          setAccommodations([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    getItems();
  }, [id, subcategoryId, currentTab, data]);

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
      
      // Update URL first
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
      
      // If we have subcategories data, fetch from all subcategories
      if (data && data.length > 0) {
        // Show loading state if needed
        // setLoading(true);
        
        // Create an array of promises for all subcategory requests
        const fetchPromises = data.map(subcategory => 
          directusAPI.getItems(subcategory.id)
            .then(response => response.data || [])
            .catch(err => {
              console.error(`Error fetching items for subcategory ${subcategory.id}:`, err);
              return [];
            })
        );
        
        // Wait for all requests to complete and combine results
        Promise.all(fetchPromises)
          .then(resultsArray => {
            // Flatten array of arrays and remove duplicates by ID
            const allItems = resultsArray.flat();
            const uniqueItems = Object.values(
              allItems.reduce((acc, item) => {
                if (!acc[item.id]) {
                  acc[item.id] = item;
                }
                return acc;
              }, {})
            );
            
            console.log(`Fetched ${uniqueItems.length} items from all subcategories`);
            setAccommodations(uniqueItems);
            // If needed: setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching from all subcategories:", error);
            // If needed: setLoading(false);
          });
      } else {
        // If no subcategories, just set an empty array
        setAccommodations([]);
      }
    } else {
      // Set subcategoryId parameter for a specific subcategory
      newSearchParams.set('subcategoryId', value);
      
      // Navigate to the new URL with updated search params
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
    }
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
    
    // Fetch from all subcategories
    if (data && data.length > 0) {
      const fetchPromises = data.map(subcategory => 
        directusAPI.getItems(subcategory.id)
          .then(response => response.data || [])
          .catch(err => {
            console.error(`Error fetching items for subcategory ${subcategory.id}:`, err);
            return [];
          })
      );
      
      Promise.all(fetchPromises)
        .then(resultsArray => {
          const allItems = resultsArray.flat();
          const uniqueItems = Object.values(
            allItems.reduce((acc, item) => {
              if (!acc[item.id]) {
                acc[item.id] = item;
              }
              return acc;
            }, {})
          );
          
          console.log(`Fetched ${uniqueItems.length} items from all subcategories`);
          setAccommodations(uniqueItems);
        })
        .catch(error => {
          console.error("Error fetching from all subcategories:", error);
        });
    } else {
      // If no subcategories, just set an empty array
      setAccommodations([]);
    }
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
