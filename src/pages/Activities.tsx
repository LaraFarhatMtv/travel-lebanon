import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Mountain, Calendar, Users, Compass, Clock } from 'lucide-react';
import { directusAPI } from '@/services/api';

// Dummy data moved to comment for reference
// const activities = [ ... ];

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const subcategoryId = searchParams.get('subcategoryId');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [data, setData] = useState([]);
  const [activities, setActivities] = useState([]);

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
          setActivities(response.data);
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
              setActivities(uniqueItems);
            });
        } else {
          // First load without any subcategory selected - don't make the problematic call
          // Just leave the activities array empty until user selects a subcategory
          console.log("Waiting for subcategory selection before loading items");
          setActivities([]);
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
            setActivities(uniqueItems);
            // If needed: setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching from all subcategories:", error);
            // If needed: setLoading(false);
          });
      } else {
        // If no subcategories, just set an empty array
        setActivities([]);
      }
    } else {
      // Set subcategoryId parameter for a specific subcategory
      newSearchParams.set('subcategoryId', value);
      
      // Navigate to the new URL with updated search params
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
    }
  };

  // Only filter by search term since subcategory filtering is done server-side
  const filteredActivities = activities.filter(activity => {
    return (
      (activity.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (activity.location?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (activity.subCategoryId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  const renderDifficultyBadge = (difficulty) => {
    let color;
    switch(difficulty) {
      case "Easy":
        color = "bg-green-100 text-green-800 hover:bg-green-200";
        break;
      case "Moderate":
        color = "bg-amber-100 text-amber-800 hover:bg-amber-200";
        break;
      case "Difficult":
        color = "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      default:
        color = "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
    return <Badge variant="secondary" className={color}>{difficulty || 'Easy'}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Lebanese Adventures</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Discover and book exciting activities across Lebanon's beautiful landscapes
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for activities or locations..."
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 focus-visible:ring-green-500"
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
            {data && data.length > 0 && data.map((item) => (
              <TabsTrigger
                key={item.id}
                value={`${item.id}`}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-green-50"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <Card key={activity.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={activity.image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"} 
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{activity.title}</CardTitle>
                  <div className="text-lg font-bold text-green-700">${activity.price || 45}</div>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3.5 w-3.5" />
                  {activity.location || "Lebanon"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">{activity.description || "Experience the best of Lebanon with this exciting activity."}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{activity.duration || "Full day"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{activity.groupCount || "Small groups (5-10)"}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {renderDifficultyBadge(activity.difficulty)}
                  {activity.seasons && Array.isArray(activity.seasons) && activity.seasons.map((s, index) => (
                    <Badge key={index} variant="outline" className="border-green-200 text-green-800">
                      <Calendar className="mr-1 h-3 w-3" />
                      {s}
                    </Badge>
                  ))}
                  {(!activity.seasons || !Array.isArray(activity.seasons) || activity.seasons.length === 0) && (
                    <Badge variant="outline" className="border-green-200 text-green-800">
                      <Calendar className="mr-1 h-3 w-3" />
                      {activity.subCategoryId?.name || "All Seasons"}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link to={`/activities/detail/${activity.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Mountain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No activities found</h3>
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
                  setActivities(uniqueItems);
                })
                .catch(error => {
                  console.error("Error fetching from all subcategories:", error);
                });
            } else {
              // If no subcategories, just set an empty array
              setActivities([]);
            }
          }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Activities;
