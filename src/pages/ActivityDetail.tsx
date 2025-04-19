
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, Calendar as CalendarIcon, Info, CheckCheck, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

// Dummy activity data - would be fetched from API in real application
const activity = {
  id: 1,
  name: "Qadisha Valley Hiking",
  category: "hiking",
  location: "Qadisha Valley, North Lebanon",
  duration: "6 hours",
  difficulty: "Moderate",
  price: 45,
  rating: 4.9,
  groupSize: "Small groups (5-10)",
  images: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527489377706-5bf97e608852?q=80&w=2059&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop"
  ],
  description: "Explore the historic Qadisha Valley, a UNESCO World Heritage site, with breathtaking views and ancient monasteries. The trail takes you through lush greenery, historic villages, and offers panoramic views of the valley below. The Qadisha Valley, also known as the Holy Valley, has sheltered Christian monastic communities for many centuries. The hike includes visits to several monasteries built into the rock faces of cliffs.",
  includes: [
    "Professional licensed guide",
    "Transportation from Beirut",
    "Lunch & snacks",
    "Water",
    "Entrance fees"
  ],
  excludes: [
    "Personal expenses",
    "Optional gratuities"
  ],
  requirements: [
    "Comfortable walking shoes",
    "Sun protection (hat, sunglasses, sunscreen)",
    "Water bottle",
    "Camera (optional)"
  ],
  meetingPoint: "Beirut Central District, 8:00 AM",
  season: ["Spring", "Summer", "Fall"],
  availableDates: [
    new Date(2025, 3, 15),
    new Date(2025, 3, 16),
    new Date(2025, 3, 18),
    new Date(2025, 3, 22),
    new Date(2025, 3, 25),
    new Date(2025, 4, 1),
    new Date(2025, 4, 5),
    new Date(2025, 4, 8)
  ],
  reviews: [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "March 2025",
      content: "Absolutely stunning hike! Our guide was very knowledgeable about the history of the valley and the monasteries. The views were breathtaking."
    },
    {
      id: 2,
      user: "Michael T.",
      rating: 5,
      date: "February 2025",
      content: "One of the best hiking experiences I've had. The Qadisha Valley is a hidden gem in Lebanon. Make sure to bring a good camera!"
    },
    {
      id: 3,
      user: "Leila K.",
      rating: 4,
      date: "January 2025",
      content: "Great experience overall. The hike was moderate as described, and the lunch provided was delicious. The only downside was that one of the monasteries was closed when we visited."
    }
  ]
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState<string>("1");
  
  // Would implement fetching activity data using the ID in a real application
  
  const handleBooking = () => {
    console.log("Booking submitted:", {
      activityId: id,
      date: date,
      participants: parseInt(participants)
    });
    // Would submit to backend in real application
    alert("Booking request received! Check your email for confirmation.");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Activity details */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="col-span-2">
              <img 
                src={activity.images[0]} 
                alt={activity.name} 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={activity.images[1]} 
                alt={`${activity.name} scene 2`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={activity.images[2]} 
                alt={`${activity.name} scene 3`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
          
          {/* Activity Title and Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{activity.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">{activity.location}</span>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{activity.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {activity.duration}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {activity.groupSize}
              </Badge>
              {activity.season.map((season, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {season}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Tabs for Details */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="includes">What's Included</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {activity.description}
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-green-600" />
                  Meeting Point
                </h3>
                <p className="text-gray-700">{activity.meetingPoint}</p>
              </div>
            </TabsContent>
            <TabsContent value="includes" className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <CheckCheck className="h-5 w-5 text-green-600" />
                    Included in the Price
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {activity.includes.map((item, i) => (
                      <li key={i} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Not Included
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {activity.excludes.map((item, i) => (
                      <li key={i} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="requirements" className="pt-6">
              <h3 className="text-lg font-semibold mb-3">What to Bring</h3>
              <ul className="list-disc pl-5 space-y-2">
                {activity.requirements.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                {activity.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{review.user}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Booking */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="text-2xl font-bold mb-6">
                ${activity.price}
                <span className="text-gray-500 text-base font-normal"> / person</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Select Date:</Label>
                  <div className="relative mt-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        // Disable dates that aren't in the available dates array
                        return !activity.availableDates.some(
                          availableDate => 
                            availableDate.getDate() === date.getDate() &&
                            availableDate.getMonth() === date.getMonth() &&
                            availableDate.getFullYear() === date.getFullYear()
                        );
                      }}
                      className="border rounded-md"
                    />
                  </div>
                  {date && (
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {format(date, 'EEEE, MMMM d, yyyy')}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="participants">Number of Participants:</Label>
                  <Select 
                    value={participants} 
                    onValueChange={setParticipants}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select participants" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'participant' : 'participants'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <div>Price per person</div>
                    <div>${activity.price}</div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div>Participants</div>
                    <div>x {participants}</div>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <div>Total</div>
                    <div>${activity.price * parseInt(participants)}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBooking} 
                  disabled={!date} 
                  className="w-full bg-green-600 hover:bg-green-700 mt-4"
                >
                  Book Now
                </Button>
                
                {!date && (
                  <div className="text-sm text-red-500 text-center">
                    Please select a date to continue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
