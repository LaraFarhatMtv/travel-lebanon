import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, Wifi, Car, UtensilsCrossed, Waves, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { directusAPI } from '@/services/api';

// Define interfaces for the data structure
interface Room {
  type: string;
  price: number;
  occupancy: string;
  description: string;
}

interface Review {
  id?: number;
  user?: string;
  rating?: number;
  date?: string;
  content?: string;
}

interface AccommodationItem {
  id: number;
  title?: string;
  name?: string;
  type?: string;
  location?: string;
  address?: string;
  pricePerNight?: number;
  price?: number;
  rating?: number;
  phone?: string;
  website?: string;
  amenities?: string[] | string;
  rooms?: Room[] | string;
  image?: string;
  images?: string[] | string;
  description?: string;
  reviews?: Review[] | string;
  subCategoryId?: {
    id: number;
    name: string;
    categoryId: {
      id: number;
      title: string;
    }
  };
}

// Fallback rooms if none are provided
const fallbackRooms = [
  {
    type: "Standard Room",
    price: 100,
    occupancy: "2 Adults",
    description: "Comfortable room with standard amenities"
  },
  {
    type: "Deluxe Room",
    price: 150,
    occupancy: "2 Adults",
    description: "Spacious room with premium amenities"
  }
];

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [accommodation, setAccommodation] = useState<AccommodationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await directusAPI.getItems(null, null, id);
        console.log('Accommodation details:', response.data);
        
        if (response.data && response.data.length > 0) {
          setAccommodation(response.data[0]);
          // Set initial room type once data is loaded
          if (response.data[0].rooms) {
            const parsedRooms = parseRooms(response.data[0].rooms);
            if (parsedRooms.length > 0) {
              setRoomType(parsedRooms[0].type);
            }
          } else {
            setRoomType(fallbackRooms[0].type);
          }
        } else {
          setError('Accommodation not found');
        }
      } catch (err) {
        console.error('Error fetching accommodation:', err);
        setError('Failed to load accommodation details');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id]);
  
  // Parse rooms data from various formats
  const parseRooms = (roomsData: Room[] | string): Room[] => {
    if (!roomsData) return fallbackRooms;
    
    try {
      if (typeof roomsData === 'string') {
        return JSON.parse(roomsData);
      } else if (Array.isArray(roomsData)) {
        return roomsData;
      }
    } catch (err) {
      console.error('Error parsing rooms data:', err);
    }
    
    return fallbackRooms;
  };
  
  // Parse amenities from various formats
  const parseAmenities = (amenitiesData: string[] | string): string[] => {
    if (!amenitiesData) return ["WiFi", "Parking", "Air Conditioning"];
    
    try {
      if (typeof amenitiesData === 'string') {
        return JSON.parse(amenitiesData);
      } else if (Array.isArray(amenitiesData)) {
        return amenitiesData;
      }
    } catch (err) {
      console.error('Error parsing amenities data:', err);
      // Try to extract amenities from a string description
      if (typeof amenitiesData === 'string') {
        return amenitiesData.split(',').map(item => item.trim());
      }
    }
    
    return ["WiFi", "Parking", "Air Conditioning"];
  };
  
  // Parse reviews from various formats
  const parseReviews = (reviewsData: Review[] | string): Review[] => {
    if (!reviewsData) return [];
    
    try {
      if (typeof reviewsData === 'string') {
        return JSON.parse(reviewsData);
      } else if (Array.isArray(reviewsData)) {
        return reviewsData;
      }
    } catch (err) {
      console.error('Error parsing reviews data:', err);
    }
    
    return [];
  };
  
  // Parse images from various formats
  const parseImages = (imagesData: string[] | string): string[] => {
    let images: string[] = [];
    
    try {
      if (typeof imagesData === 'string') {
        images = JSON.parse(imagesData);
      } else if (Array.isArray(imagesData)) {
        images = imagesData;
      }
    } catch (err) {
      console.error('Error parsing images data:', err);
    }
    
    // Add main image to array if it exists and not already included
    if (accommodation?.image && !images.includes(accommodation.image)) {
      images.unshift(accommodation.image);
    }
    
    // Add fallback images if needed
    while (images.length < 3) {
      images.push(`https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${1920 + images.length}`);
    }
    
    return images;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading accommodation details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !accommodation) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load accommodation</h2>
          <p className="text-gray-600 mb-6">{error || 'Accommodation not found'}</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href="/accommodations">Browse Accommodations</a>
          </Button>
        </div>
      </div>
    );
  }
  
  // Prepare data with fallbacks
  const title = accommodation.title || accommodation.name || 'Lovely Accommodation';
  const description = accommodation.description || 'No description available';
  const basePrice = accommodation.price || accommodation.pricePerNight || 100;
  const location = accommodation.location || 'Lebanon';
  const address = accommodation.address || location;
  const rating = accommodation.rating || 4.5;
  const phone = accommodation.phone || '+961 1 234 567';
  const website = accommodation.website || 'www.accommodation.com';
  
  // Parse complex data
  const rooms = parseRooms(accommodation.rooms || fallbackRooms);
  const amenities = parseAmenities(accommodation.amenities || []);
  const reviews = parseReviews(accommodation.reviews || []);
  const images = parseImages(accommodation.images || []);
  
  // Make sure roomType is set to a valid value
  if (!roomType && rooms.length > 0) {
    setRoomType(rooms[0].type);
  }
  
  // Find selected room
  const selectedRoom = rooms.find(room => room.type === roomType) || rooms[0];
  
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
                src={images[0]} 
                alt={title} 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={images[1]} 
                alt={`${title} image 2`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src={images[2]} 
                alt={`${title} image 3`} 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
          
          {/* Accommodation Title and Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">{location}</span>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{rating}</span>
              </div>
            </div>
            <div className="text-gray-600 mb-4">{address}</div>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <Phone className="h-5 w-5 text-blue-600" />
                {phone}
              </div>
              <div>
                <a href={`https://${website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {website}
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
                {description}
              </p>
            </TabsContent>
            <TabsContent value="amenities" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
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
                {rooms.map((room, index) => (
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
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.user || `Guest ${index + 1}`}</div>
                        <div className="text-sm text-gray-500">{review.date || new Date().toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.content || 'Great place to stay!'}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this accommodation!</p>
                  </div>
                )}
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
                      {rooms.map((room, index) => (
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
