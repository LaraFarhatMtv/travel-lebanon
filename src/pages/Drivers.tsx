
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Car, Star, Phone, Calendar, Clock } from 'lucide-react';

// Dummy data for drivers
const drivers = [
  {
    id: 1,
    name: "Hassan M.",
    phone: "+961 3 123 456",
    vehicle: "Mercedes E-Class (4 passengers)",
    location: "Beirut",
    rating: 4.9,
    yearsExperience: 8,
    languages: ["English", "Arabic", "French"],
    specialties: ["City Tours", "Mountain Tours", "Historical Sites"],
    availability: "Available",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop",
    reviews: [
      { user: "John D.", comment: "Hassan was an excellent driver and guide. Very knowledgeable about Lebanese history.", rating: 5 },
      { user: "Sarah L.", comment: "Safe driver and great recommendations for local restaurants.", rating: 5 }
    ]
  },
  {
    id: 2,
    name: "Sarah K.",
    phone: "+961 71 234 567",
    vehicle: "Toyota Land Cruiser (6 passengers)",
    location: "Jounieh",
    rating: 4.8,
    yearsExperience: 5,
    languages: ["English", "Arabic"],
    specialties: ["Mountain Tours", "Off-road Adventures", "Wine Tours"],
    availability: "Available",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    reviews: [
      { user: "Michael R.", comment: "Sarah took us on an amazing off-road adventure in the mountains. Highly recommend!", rating: 5 },
      { user: "Emma T.", comment: "Great driver, knew all the best spots that aren't in the guidebooks.", rating: 4 }
    ]
  },
  {
    id: 3,
    name: "Omar J.",
    phone: "+961 3 987 654",
    vehicle: "Hyundai H1 Van (8 passengers)",
    location: "Tripoli",
    rating: 4.7,
    yearsExperience: 12,
    languages: ["English", "Arabic", "Spanish"],
    specialties: ["Northern Lebanon", "Historical Sites", "Group Tours"],
    availability: "Available",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    reviews: [
      { user: "Lisa M.", comment: "Perfect for our family of 6. Omar was patient and accommodating with our schedule.", rating: 5 },
      { user: "Robert K.", comment: "Extremely knowledgeable about the historical sites in Northern Lebanon.", rating: 5 }
    ]
  },
  {
    id: 4,
    name: "Leila H.",
    phone: "+961 76 345 678",
    vehicle: "BMW 5 Series (4 passengers)",
    location: "Byblos",
    rating: 4.6,
    yearsExperience: 4,
    languages: ["English", "Arabic", "Italian"],
    specialties: ["Coastal Tours", "Culinary Tours", "Photography Spots"],
    availability: "Booked until April 15",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    reviews: [
      { user: "Jessica T.", comment: "Leila took us to amazing restaurants that we wouldn't have found on our own.", rating: 5 },
      { user: "David S.", comment: "Great suggestions for photography spots along the coast.", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "Karim N.",
    phone: "+961 3 234 567",
    vehicle: "Jeep Wrangler (4 passengers)",
    location: "Baalbek",
    rating: 4.9,
    yearsExperience: 10,
    languages: ["English", "Arabic", "German"],
    specialties: ["Bekaa Valley", "Off-road Adventures", "Historical Sites"],
    availability: "Available",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    reviews: [
      { user: "Hannah L.", comment: "Amazing off-road experience in Bekaa Valley with Karim. Saw places most tourists never visit.", rating: 5 },
      { user: "Paul D.", comment: "Very knowledgeable about the history of Baalbek and surrounding areas.", rating: 5 }
    ]
  },
  {
    id: 6,
    name: "Maya S.",
    phone: "+961 70 876 543",
    vehicle: "Volvo XC90 (6 passengers)",
    location: "Batroun",
    rating: 4.8,
    yearsExperience: 7,
    languages: ["English", "Arabic", "French"],
    specialties: ["North Lebanon Coast", "Family Tours", "Beach Hopping"],
    availability: "Limited Availability",
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1989&auto=format&fit=crop",
    reviews: [
      { user: "Thomas W.", comment: "Maya was fantastic with our kids and showed us beautiful beach spots along the coast.", rating: 5 },
      { user: "Anna K.", comment: "Very comfortable car and Maya is an excellent, safe driver.", rating: 4 }
    ]
  }
];

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (currentTab === "all") return matchesSearch;
    return matchesSearch && driver.specialties.some(s => s.toLowerCase().includes(currentTab.toLowerCase()));
  });

  const toggleDriverDetails = (id: number) => {
    setExpandedDriver(expandedDriver === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-700 to-red-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Licensed Tour Drivers</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Find professional drivers to take you on your custom tour around Lebanon
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, location, or specialty..."
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 focus-visible:ring-red-500"
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
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="city">City Tours</TabsTrigger>
            <TabsTrigger value="mountain">Mountain</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="off-road">Off-road</TabsTrigger>
            <TabsTrigger value="coast">Coastal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results */}
      {filteredDrivers.length > 0 ? (
        <div className="space-y-6">
          {filteredDrivers.map(driver => (
            <Card key={driver.id} className={expandedDriver === driver.id ? "border-red-300" : ""}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <div className="h-full p-6 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{driver.name}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{driver.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {driver.yearsExperience} years experience
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Car className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Vehicle</div>
                        <div className="text-gray-700">{driver.vehicle}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-700">{driver.location}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {driver.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-red-50 text-red-800">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-2">Languages</div>
                      <div className="text-gray-700">
                        {driver.languages.join(", ")}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div className={`font-medium ${
                        driver.availability === "Available" ? "text-green-600" : 
                        driver.availability === "Limited Availability" ? "text-amber-600" : 
                        "text-gray-600"
                      }`}>
                        {driver.availability}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-1 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span className="font-medium">{driver.phone}</span>
                    </div>
                    
                    <Button 
                      className="w-full mb-3 bg-red-600 hover:bg-red-700"
                      onClick={() => window.location.href = `tel:${driver.phone.replace(/\s/g, '')}`}
                    >
                      Call Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toggleDriverDetails(driver.id)}
                    >
                      {expandedDriver === driver.id ? "Hide Details" : "Show Details"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedDriver === driver.id && (
                <CardFooter className="block border-t p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Reviews</h4>
                    {driver.reviews.map((review, index) => (
                      <div key={index} className={`border-b last:border-0 py-3 ${index === 0 ? 'pt-0' : ''}`}>
                        <div className="flex justify-between">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mt-1">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <Button variant="outline" onClick={() => window.location.href = `/custom-tours?driver=${driver.id}`}>
                      Book Custom Tour
                    </Button>
                    <Button variant="default" className="bg-red-600 hover:bg-red-700">
                      Request Day Rate
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No drivers found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
          <Button onClick={() => {setSearchTerm(""); setCurrentTab("all");}}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Drivers;
