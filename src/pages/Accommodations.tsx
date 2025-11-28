import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroSection from '@/components/accommodations/HeroSection';
import FilterSection from '@/components/accommodations/FilterSection';
import AccommodationCard from '@/components/accommodations/AccommodationCard';
import EmptyState from '@/components/accommodations/EmptyState';
import { directusAPI, reviewAPI } from '@/services/api';
import type { ReviewStatsMap } from '@/services/api';
import { accommodations as STATIC_ACCOMMODATIONS } from '@/data/accommodations';

const DEFAULT_ACCOMMODATION_SUBCATEGORIES = [
  { id: "beach-resort", name: "Beach Resorts" },
  { id: "mountain-resort", name: "Mountain Retreats" },
  { id: "rural-retreat", name: "Countryside Stays" },
];

const getSubcategoryIdValue = (record: any) => {
  if (!record?.subCategoryId && record?.type) {
    return record.type;
  }
  if (!record?.subCategoryId) return null;
  if (typeof record.subCategoryId === "object") {
    return record.subCategoryId.id ?? null;
  }
  return record.subCategoryId;
};

const Accommodations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const subcategoryId = searchParams.get('subcategoryId');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [data, setData] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [useStaticData, setUseStaticData] = useState(!id);
  const [reviewStats, setReviewStats] = useState<ReviewStatsMap>({});
  
  useEffect(() => {
    const getSubcategories = async () => {
      if (!id) {
        setUseStaticData(true);
        setData(DEFAULT_ACCOMMODATION_SUBCATEGORIES);
        return;
      }
      try {
        const response = await directusAPI.getsubCategories(id);
        if (response?.data?.length) {
          console.log(response.data);
          setUseStaticData(false);
          setData(response.data);
        } else {
          setUseStaticData(true);
          setData(DEFAULT_ACCOMMODATION_SUBCATEGORIES);
        }
      } catch (e) {
        console.log("error fetch subCategories", e);
        setUseStaticData(true);
        setData(DEFAULT_ACCOMMODATION_SUBCATEGORIES);
      }
    };
    getSubcategories();
  }, [id]);

  useEffect(() => {
    const getItems = async () => {
      if (useStaticData || !id) {
        setAccommodations(STATIC_ACCOMMODATIONS);
        return;
      }
      try {
        if (subcategoryId) {
          const response = await directusAPI.getItems(Number(subcategoryId), null);
          console.log("items for specific subcategory:", response.data);
          setAccommodations(response?.data?.length ? response.data : STATIC_ACCOMMODATIONS);
        } else if (currentTab === "all" && data.length > 0) {
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
                allItems.reduce((acc: Record<string, any>, item: any) => {
                  if (!acc[item.id]) {
                    acc[item.id] = item;
                  }
                  return acc;
                }, {})
              );
              
              console.log(`Fetched ${uniqueItems.length} items from all subcategories`);
              setAccommodations(uniqueItems.length ? uniqueItems : STATIC_ACCOMMODATIONS);
            });
        } else {
          setAccommodations([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setUseStaticData(true);
        setAccommodations(STATIC_ACCOMMODATIONS);
      }
    };
    getItems();
  }, [id, subcategoryId, currentTab, data, useStaticData]);

  useEffect(() => {
    const fetchReviewStats = async () => {
      if (useStaticData) {
        setReviewStats({});
        return;
      }

      const itemIds = accommodations
        .map((accommodation) => Number(accommodation.id))
        .filter((value) => Number.isFinite(value));

      if (!itemIds.length) {
        setReviewStats({});
        return;
      }

      try {
        const stats = await reviewAPI.getReviewStatsForItems(itemIds);
        setReviewStats(stats);
      } catch (error) {
        console.error("Error fetching accommodation review stats:", error);
        setReviewStats({});
      }
    };

    fetchReviewStats();
  }, [accommodations, useStaticData]);

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
    const matchesTab =
      currentTab === "all" ||
      String(getSubcategoryIdValue(accommodation) ?? "") === currentTab;

    const matchesSearch = 
      (accommodation.title?.toLowerCase() || accommodation.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (accommodation.location?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (accommodation.subCategoryId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const nightlyPrice = accommodation.price ?? accommodation.pricePerNight ?? 0;
    const matchesPrice = nightlyPrice
      ? nightlyPrice >= priceRange[0] && nightlyPrice <= priceRange[1]
      : true;
    
    return matchesTab && matchesSearch && matchesPrice;
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
    if (useStaticData || !id) {
      setAccommodations(STATIC_ACCOMMODATIONS);
      return;
    }

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
          {filteredAccommodations.map(accommodation => {
            const stats = reviewStats[String(accommodation.id)];
            const accommodationWithRating = stats
              ? {
                  ...accommodation,
                  rating: stats.average,
                  reviewCount: stats.count,
                }
              : accommodation;

            return (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodationWithRating}
                linkState={{
                  accommodation: accommodationWithRating,
                  source: useStaticData ? "static" : "directus",
                }}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState resetFilters={resetFilters} />
      )}
    </div>
  );
};

export default Accommodations;
