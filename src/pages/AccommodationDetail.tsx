
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
import { MapPin, Phone, Star, Wifi, Car, UtensilsCrossed, Waves, CheckCircle2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

// Dummy accommodation data - would be fetched from API in real application
const accommodation = {
  id: 1,
  name: "Beirut Bay Resort",
  type: "Beach Resort",
  location: "Beirut Coast",
  address: "1234 Coastal Road, Beirut, Lebanon",
  pricePerNight: 120,
  rating: 4.8,
  phone: "+961 1 234 567",
  website: "www.beirutbayresort.com",
  amenities: [
    "Private Beach Access",
    "Swimming Pool",
    "Restaurant & Bar",
    "WiFi",
    "Parking",
    "Room Service",
    "Spa & Wellness",
    "Fitness Center",
    "Air Conditioning",
    "24-hour Front Desk"
  ],
  rooms: [
    {
      type: "Standard Room",
      price: 120,
      occupancy: "2 Adults",
      description: "Comfortable room with a queen bed and partial sea view"
    },
    {
      type: "Deluxe Room",
      price: 150,
      occupancy: "2 Adults",
      description: "Spacious room with a king bed and full sea view"
    },
    {
      type: "Family Suite",
      price: 200,
      occupancy: "4 Adults",
      description: "Large suite with two bedrooms and a living area"
    }
  ],
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687644-c7f34bc1f688?q=80&w=2070&auto=format&fit=crop"
  ],
  description: "Experience luxury beachfront living at Beirut Bay Resort, situated on the beautiful Mediterranean coast just minutes from downtown Beirut. Our resort offers a perfect blend of relaxation and excitement with direct beach access, a stunning infinity pool, and world-class dining options.\n\nThe resort features comfortable, modern rooms with breathtaking sea views, top-notch amenities, and excellent service to ensure a memorable stay. Whether you're looking to unwind on the beach, explore the vibrant city of Beirut, or enjoy water activities, our resort is the perfect home base for your Lebanese adventure.",
  reviews: [
    {
      id: 1,
      user: "Ahmed K.",
      rating: 5,
      date: "March 2025",
      content: "Beautiful resort with amazing views and excellent service. The private beach was perfect and the food at the restaurant was delicious."
    },
    {
      id: 2,
      user: "Maria J.",
      rating: 4,
      date: "February 2025",
      content: "Very comfortable stay with great amenities. The location is perfect - close to the city but still peaceful. The only small issue was that the WiFi was a bit slow at times."
    },
    {
      id: 3,
      user: "Robert L.",
      rating: 5,
      date: "January 2025",
      content: "One of the best beach resorts I've stayed at in Lebanon. The staff was incredibly helpful and the facilities were top-notch. Will definitely return!"
    }
  ]
};

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>(accommodation.rooms[0].type);
  const [guests, setGuests] = useState<string>("2");
  
  // Would implement fetching accommodation data using the ID in a real application
  
  // Find selected room
  const selectedRoom = accommodation.rooms.find(room => room.type === roomType) || accommodation.rooms[0];
  
  const totalNights = checkIn && checkOut 
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalPrice = selectedRoom.price * totalNights;
  
  const handleBooking = () => {
    console.log("Booking submitted:", {
      accommodationId: id,
      roomType,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      totalPrice
    });
    // Would submit to backend in real application
    alert("Booking request received! Check your email for confirmation.");
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-5 w-5" />;
    if (amenity.toLowerCase().includes('parking')) return <Car className="h-5 w-5" />;
    if (amenity.toLowerCase().includes('restaurant')) return <UtensilsCrossed className="h-5 w-5" />;
    if (amenity.toLowerCase().includes('pool')) return <Waves className="h-5 w-5" />; // Using Waves instead of Pool
    return <CheckCircle2 className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Accommodation details */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="col-span-2">
              <img 
                src={accommodation.images[0]} 
                alt={accommodation.name} 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={accommodation.images[1]} 
                alt={`${accommodation.name} image 2`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={accommodation.images[2]} 
                alt={`${accommodation.name} image 3`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
          
          {/* Accommodation Title and Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{accommodation.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">{accommodation.location}</span>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{accommodation.rating}</span>
              </div>
            </div>
            <div className="text-gray-600 mb-4">{accommodation.address}</div>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <Phone className="h-5 w-5 text-blue-600" />
                {accommodation.phone}
              </div>
              <div>
                <a href={`https://${accommodation.website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {accommodation.website}
                </a>
              </div>
            </div>
          </div>
          
          {/* Tabs for Details */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="rooms">Room Types</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                {accommodation.description}
              </p>
            </TabsContent>
            <TabsContent value="amenities" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rooms" className="pt-6">
              <div className="space-y-6">
                {accommodation.rooms.map((room, index) => (
                  <div key={index} className="border rounded-lg p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{room.type}</h3>
                      <div className="text-lg font-bold text-blue-700">${room.price} <span className="text-sm font-normal text-gray-500">/ night</span></div>
                    </div>
                    <div className="text-gray-600 mb-2">Occupancy: {room.occupancy}</div>
                    <p className="text-gray-700">{room.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                {accommodation.reviews.map((review) => (
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
                ${selectedRoom.price}
                <span className="text-gray-500 text-base font-normal"> / night</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Room Type:</Label>
                  <Select 
                    value={roomType} 
                    onValueChange={setRoomType}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accommodation.rooms.map((room, index) => (
                        <SelectItem key={index} value={room.type}>
                          {room.type} - ${room.price}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="check-in">Check-in Date:</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date);
                        // If check-out is not set or is earlier than the new check-in
                        if (!checkOut || (date && checkOut && date > checkOut)) {
                          setCheckOut(date ? addDays(date, 1) : undefined);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      className="border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="check-out">Check-out Date:</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date <= (checkIn || new Date())}
                      className="border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests">Number of Guests:</Label>
                  <Select 
                    value={guests} 
                    onValueChange={setGuests}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {checkIn && checkOut && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <div>Price per night</div>
                      <div>${selectedRoom.price}</div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div>Number of nights</div>
                      <div>x {totalNights}</div>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <div>Total</div>
                      <div>${totalPrice}</div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleBooking} 
                  disabled={!checkIn || !checkOut} 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  Book Now
                </Button>
                
                {(!checkIn || !checkOut) && (
                  <div className="text-sm text-red-500 text-center">
                    Please select check-in and check-out dates to continue
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

export default AccommodationDetail;
