
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Car, Phone, Star, Calendar } from 'lucide-react';

// Dummy data for popular destinations
const popularDestinations = [
  {
    id: 1,
    name: "Baalbek Roman Ruins",
    region: "Bekaa Valley",
    image: "https://images.unsplash.com/photo-1588156979401-db3662249ae7?q=80&w=2071&auto=format&fit=crop",
    estimatedTime: "3-4 hours"
  },
  {
    id: 2,
    name: "Byblos Old Town",
    region: "Mount Lebanon",
    image: "https://images.unsplash.com/photo-1577411731337-fed868354595?q=80&w=1976&auto=format&fit=crop",
    estimatedTime: "2-3 hours"
  },
  {
    id: 3,
    name: "Jeita Grotto",
    region: "Keserwan",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=1974&auto=format&fit=crop",
    estimatedTime: "2 hours"
  },
  {
    id: 4,
    name: "Cedars of God",
    region: "North Lebanon",
    image: "https://images.unsplash.com/photo-1513977055326-8ae5562a69de?q=80&w=2070&auto=format&fit=crop",
    estimatedTime: "2-3 hours"
  },
  {
    id: 5,
    name: "Kadisha Valley",
    region: "North Lebanon",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    estimatedTime: "4-5 hours"
  },
  {
    id: 6,
    name: "Beirut Downtown",
    region: "Beirut",
    image: "https://images.unsplash.com/photo-1577117076608-161e8b5f4414?q=80&w=1974&auto=format&fit=crop",
    estimatedTime: "3 hours"
  }
];

// Dummy data for available drivers
const drivers = [
  {
    id: 1,
    name: "Hassan M.",
    phone: "+961 3 123 456",
    vehicle: "Sedan (4 passengers)",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop",
    available: true
  },
  {
    id: 2,
    name: "Sarah K.",
    phone: "+961 71 234 567",
    vehicle: "SUV (6 passengers)",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    available: true
  },
  {
    id: 3,
    name: "Omar J.",
    phone: "+961 3 987 654",
    vehicle: "Van (8 passengers)",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    available: true
  }
];

const CustomTours = () => {
  const [selectedDestinations, setSelectedDestinations] = useState<typeof popularDestinations>([]);
  const [customDestination, setCustomDestination] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  
  const handleAddDestination = (destination: (typeof popularDestinations)[0]) => {
    if (!selectedDestinations.some(item => item.id === destination.id)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };
  
  const handleAddCustomDestination = () => {
    if (customDestination.trim() !== '') {
      const newDestination = {
        id: Math.random(), // Use proper ID generation in production
        name: customDestination,
        region: "Custom Location",
        image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1974&auto=format&fit=crop",
        estimatedTime: "Variable"
      };
      setSelectedDestinations([...selectedDestinations, newDestination]);
      setCustomDestination('');
    }
  };
  
  const handleRemoveDestination = (id: number) => {
    setSelectedDestinations(selectedDestinations.filter(dest => dest.id !== id));
  };
  
  const handleSelectDriver = (id: number) => {
    setSelectedDriverId(id === selectedDriverId ? null : id);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      destinations: selectedDestinations,
      date,
      notes,
      driverId: selectedDriverId
    });
    // Would submit to backend in real application
    alert("Tour request submitted! A confirmation will be sent to your email.");
  };

  // Estimate total time for tour
  const estimatedTotalHours = selectedDestinations.reduce((acc, dest) => {
    const timeRange = dest.estimatedTime.match(/\d+/g);
    if (timeRange && timeRange.length > 0) {
      return acc + parseInt(timeRange[timeRange.length - 1]);
    }
    return acc;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588156979401-db3662249ae7?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Custom Tour</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Design your perfect Lebanese adventure by selecting destinations and booking a local driver
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Destination selection */}
        <div className="lg:col-span-2">
          {/* Tour Builder */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Build Your Tour</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Selected Destinations</h3>
              
              {selectedDestinations.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                  <p className="text-gray-500">
                    Add destinations to start building your custom tour
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {selectedDestinations.map((dest, index) => (
                    <div key={dest.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <div className="font-bold mr-2">{index + 1}.</div>
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{dest.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {dest.region} • ~{dest.estimatedTime}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveDestination(dest.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Estimated total time:</span> ~{estimatedTotalHours} hours
                      </div>
                      <div>
                        <span className="font-medium">Stops:</span> {selectedDestinations.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add custom destination */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a custom destination not listed below"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                />
                <Button onClick={handleAddCustomDestination} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-5 w-5 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            {/* Popular Destinations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {popularDestinations.map(destination => (
                  <div 
                    key={destination.id} 
                    className={`relative group cursor-pointer rounded-lg overflow-hidden h-44 ${
                      selectedDestinations.some(d => d.id === destination.id) ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleAddDestination(destination)}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition z-10"></div>
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-20">
                      <div className="font-bold">{destination.name}</div>
                      <div className="text-sm flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {destination.region}
                      </div>
                    </div>
                    {selectedDestinations.some(d => d.id === destination.id) && (
                      <div className="absolute top-2 right-2 z-20 bg-purple-500 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Driver selection and booking */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Complete Your Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date:</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests or Notes:</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special requirements or preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Select a Driver:</Label>
                  <div className="space-y-3 mt-2">
                    {drivers.map(driver => (
                      <div 
                        key={driver.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition ${
                          selectedDriverId === driver.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'hover:border-gray-400'
                        }`}
                        onClick={() => handleSelectDriver(driver.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{driver.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                                {driver.rating}
                              </div>
                              <div className="flex items-center">
                                <Car className="h-3.5 w-3.5 mr-1" />
                                {driver.vehicle}
                              </div>
                            </div>
                          </div>
                        </div>
                        {selectedDriverId === driver.id && (
                          <div className="mt-3 pt-3 border-t flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <span>{driver.phone}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={selectedDestinations.length === 0 || !date || selectedDriverId === null} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Request Tour Booking
                </Button>
                
                {selectedDestinations.length === 0 && (
                  <div className="text-sm text-red-500 text-center">
                    Please select at least one destination
                  </div>
                )}
                
                {!date && selectedDestinations.length > 0 && (
                  <div className="text-sm text-red-500 text-center">
                    Please select a date
                  </div>
                )}
                
                {selectedDriverId === null && selectedDestinations.length > 0 && date && (
                  <div className="text-sm text-red-500 text-center">
                    Please select a driver
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Tours are subject to driver availability
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomTours;
