import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Phone, Clock, Utensils, Star } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { directusAPI } from '@/services/api';

// const restaurants = [
//   {
//     id: 1,
//     name: "Beirut Mezze",
//     cuisine: "Lebanese Traditional",
//     address: "Downtown, Beirut",
//     phone: "+961 1 234 567",
//     rating: 4.8,
//     openHours: "11:00 AM - 11:00 PM",
//     priceRange: "$$",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
//     tags: ["Lebanese Cuisine", "Mezze", "Downtown"]
//   },
//   {
//     id: 2,
//     name: "Byblos Seafood",
//     cuisine: "Seafood",
//     address: "Harbor Area, Byblos",
//     phone: "+961 9 123 456",
//     rating: 4.7,
//     openHours: "12:00 PM - 10:00 PM",
//     priceRange: "$$$",
//     image: "https://images.unsplash.com/photo-1599458252573-56ae36120de1?q=80&w=2070&auto=format&fit=crop",
//     tags: ["Seafood", "Harbor View", "Fresh Catch"]
//   },
//   {
//     id: 3,
//     name: "Mountain Terrace",
//     cuisine: "Lebanese Fusion",
//     address: "Faraya Mountains",
//     phone: "+961 3 987 654",
//     rating: 4.9,
//     openHours: "10:00 AM - 9:00 PM",
//     priceRange: "$$$",
//     image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop",
//     tags: ["Mountain View", "Fusion", "Outdoor Seating"]
//   },
//   {
//     id: 4,
//     name: "Cedar Valley Grill",
//     cuisine: "Barbecue & Grill",
//     address: "Batroun Coast",
//     phone: "+961 6 345 678",
//     rating: 4.6,
//     openHours: "11:00 AM - 12:00 AM",
//     priceRange: "$$",
//     image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
//     tags: ["Barbecue", "Grilled Meats", "Family Friendly"]
//   },
//   {
//     id: 5,
//     name: "Zahle Garden",
//     cuisine: "Traditional Lebanese",
//     address: "Zahle, Bekaa Valley",
//     phone: "+961 8 765 432",
//     rating: 4.9,
//     openHours: "9:00 AM - 10:00 PM",
//     priceRange: "$$",
//     image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
//     tags: ["Bekaa Valley", "Traditional", "Garden Setting"]
//   },
//   {
//     id: 6,
//     name: "Tripoli Sweets",
//     cuisine: "Desserts & Cafe",
//     address: "Old Souks, Tripoli",
//     phone: "+961 6 123 789",
//     rating: 4.7,
//     openHours: "8:00 AM - 9:00 PM",
//     priceRange: "$",
//     image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2125&auto=format&fit=crop",
//     tags: ["Sweets", "Traditional Desserts", "Coffee"]
//   }
// ];


const Restaurants = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const subcategoryId = searchParams.get('subcategoryId');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [data, setData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getcategories = async () => {
      try {
        const response = await directusAPI.getsubCategories(id)
        if (response) {
          console.log(response.data)
          setData(response.data);
        }


      } catch (e) {
        console.log("error fetch subCategories", e)

      }
    }
    getcategories();
  }, [id]);

  useEffect(() => {
    const getItems = async () => {
      try {
        // Only make the API call if subcategoryId is specified
        if (subcategoryId) {
          const response = await directusAPI.getItems(Number(subcategoryId), null);
          console.log("items for specific subcategory:", response.data);
          setRestaurants(response.data);
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
              setRestaurants(uniqueItems);
            });
        } else {
          // First load without any subcategory selected - don't make the problematic call
          // Just leave the restaurants array empty until user selects a subcategory
          console.log("Waiting for subcategory selection before loading items");
          setRestaurants([]);
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

  // Only filter by search term since subcategory filtering is done server-side
  const filteredRestaurants = restaurants.filter(restaurant => {
    return (
      (restaurant.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (restaurant.cuisine?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (restaurant.subCategoryId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

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
            setRestaurants(uniqueItems);
            // If needed: setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching from all subcategories:", error);
            // If needed: setLoading(false);
          });
      } else {
        // If no subcategories, just set an empty array
        setRestaurants([]);
      }
    } else {
      // Set subcategoryId parameter for a specific subcategory
      newSearchParams.set('subcategoryId', value);
      
      // Navigate to the new URL with updated search params
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Lebanese Restaurants</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Discover authentic Lebanese cuisine and local restaurants near you
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for restaurants, cuisine, or location..."
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 focus-visible:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Tabs
          defaultValue="all"
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {/* <TabsTrigger value="lebanese">Lebanese</TabsTrigger>
            <TabsTrigger value="seafood">Seafood</TabsTrigger>
            <TabsTrigger value="fusion">Fusion</TabsTrigger>
            <TabsTrigger value="grill">Grill</TabsTrigger>
            <TabsTrigger value="desserts">Desserts</TabsTrigger> */}
            {data && data.length > 0 && data.map((item) => (
              <TabsTrigger
                key={item.id}
                value={`${item.id}`}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-amber-50"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"}
                  alt={restaurant.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{restaurant.title}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {restaurant.rating || 4.5}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-600">
                  <Utensils className="h-3.5 w-3.5" />
                  {restaurant.subCategoryId?.name || restaurant.cuisine || "Lebanese"} • {restaurant.priceRange || "$$$"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>{restaurant.location || restaurant.address || "Lebanon"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>{restaurant.phoneNumber || restaurant.phone || "+961 1 234 567"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>{restaurant.openHours || "9:00 AM - 10:00 PM"}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.tags && Array.isArray(restaurant.tags) && restaurant.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      {tag}
                    </Badge>
                  ))}
                  {(!restaurant.tags || !Array.isArray(restaurant.tags) || restaurant.tags.length === 0) && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      {restaurant.subCategoryId?.name || "Lebanese Cuisine"}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">View Menu</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
          <Button onClick={() => { 
            setSearchTerm(""); 
            setCurrentTab("all"); 
            // Remove subcategoryId from URL when clearing filters
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
                  setRestaurants(uniqueItems);
                })
                .catch(error => {
                  console.error("Error fetching from all subcategories:", error);
                });
            } else {
              // If no subcategories, just set an empty array
              setRestaurants([]);
            }
          }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
