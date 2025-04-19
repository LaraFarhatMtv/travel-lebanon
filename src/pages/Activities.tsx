
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Mountain, Calendar, Users, Compass, Clock } from 'lucide-react';

// Dummy data for activities
const activities = [
  {
    id: 1,
    name: "Qadisha Valley Hiking",
    category: "hiking",
    location: "Qadisha Valley, North Lebanon",
    duration: "6 hours",
    difficulty: "Moderate",
    price: 45,
    rating: 4.9,
    groupSize: "Small groups (5-10)",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    description: "Explore the historic Qadisha Valley, a UNESCO World Heritage site, with breathtaking views and ancient monasteries.",
    season: ["Spring", "Summer", "Fall"],
    available: true
  },
  {
    id: 2,
    name: "Barouk Cedar Forest Trek",
    category: "hiking",
    location: "Shouf Biosphere Reserve",
    duration: "4 hours",
    difficulty: "Easy",
    price: 35,
    rating: 4.7,
    groupSize: "Medium groups (10-15)",
    image: "https://images.unsplash.com/photo-1513977055326-8ae5562a69de?q=80&w=2070&auto=format&fit=crop",
    description: "Walk through ancient cedar trees in the largest nature reserve in Lebanon, home to 25% of the remaining cedar forests.",
    season: ["Spring", "Summer", "Fall"],
    available: true
  },
  {
    id: 3,
    name: "Mount Lebanon Paragliding",
    category: "paragliding",
    location: "Jounieh Bay",
    duration: "2 hours (30 mins flight)",
    difficulty: "No experience needed",
    price: 95,
    rating: 4.8,
    groupSize: "Individual or pairs",
    image: "https://images.unsplash.com/photo-1524051498936-ce19472a4221?q=80&w=2070&auto=format&fit=crop",
    description: "Soar over the beautiful Jounieh Bay with experienced instructors and get breathtaking views of the Lebanese coastline.",
    season: ["Spring", "Summer"],
    available: true
  },
  {
    id: 4,
    name: "Laklouk Mountain Camping",
    category: "camping",
    location: "Laklouk",
    duration: "Overnight (24 hours)",
    difficulty: "Easy",
    price: 65,
    rating: 4.6,
    groupSize: "Medium groups (8-12)",
    image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?q=80&w=2070&auto=format&fit=crop",
    description: "Camp under the stars in the beautiful mountains of Laklouk with fully equipped tents and campfire dinner included.",
    season: ["Summer"],
    available: true
  },
  {
    id: 5,
    name: "Batroun Water Sports Day",
    category: "water-sports",
    location: "Batroun Coast",
    duration: "Full day",
    difficulty: "All levels",
    price: 85,
    rating: 4.5,
    groupSize: "Individual or groups",
    image: "https://images.unsplash.com/photo-1560306447-4cc9a6221a28?q=80&w=2070&auto=format&fit=crop",
    description: "Enjoy a variety of water sports including jet skiing, banana boat rides, and paddleboarding on the beautiful Batroun coast.",
    season: ["Summer"],
    available: true
  },
  {
    id: 6,
    name: "Baalbek Historical Tour",
    category: "historical-tours",
    location: "Baalbek",
    duration: "5 hours",
    difficulty: "Easy",
    price: 40,
    rating: 4.9,
    groupSize: "Medium groups (10-15)",
    image: "https://images.unsplash.com/photo-1588156979401-db3662249ae7?q=80&w=2071&auto=format&fit=crop",
    description: "Discover the majestic Roman temples of Baalbek, one of the most well-preserved Roman sites in the world.",
    season: ["Spring", "Fall"],
    available: true
  }
];

const Activities = () => {
  const { activityType } = useParams<{ activityType?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(activityType || "all");

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === "all") return matchesSearch;
    return matchesSearch && activity.category === currentTab;
  });

  const renderDifficultyBadge = (difficulty: string) => {
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
    return <Badge variant="secondary" className={color}>{difficulty}</Badge>;
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
          defaultValue={currentTab} 
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hiking">Hiking</TabsTrigger>
            <TabsTrigger value="camping">Camping</TabsTrigger>
            <TabsTrigger value="paragliding">Paragliding</TabsTrigger>
            <TabsTrigger value="water-sports">Water Sports</TabsTrigger>
            <TabsTrigger value="historical-tours">Historical</TabsTrigger>
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
                  src={activity.image} 
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{activity.name}</CardTitle>
                  <div className="text-lg font-bold text-green-700">${activity.price}</div>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3.5 w-3.5" />
                  {activity.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">{activity.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{activity.groupSize}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {renderDifficultyBadge(activity.difficulty)}
                  {activity.season.map((s, index) => (
                    <Badge key={index} variant="outline" className="border-green-200 text-green-800">
                      <Calendar className="mr-1 h-3 w-3" />
                      {s}
                    </Badge>
                  ))}
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
          <Button onClick={() => {setSearchTerm(""); setCurrentTab("all");}}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Activities;
