import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Car, UtensilsCrossed, Waves, Star } from 'lucide-react';

// Keep original interface for backward compatibility
export interface Accommodation {
  id: number;
  name?: string;
  title?: string;
  type?: string;
  location?: string;
  pricePerNight?: number;
  price?: number;
  rating?: number;
  amenities?: string[];
  image?: string;
  description?: string;
  subCategoryId?: {
    id: number;
    name: string;
  };
}

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
        return <UtensilsCrossed className="h-4 w-4" />;
      case 'pool':
        return <Waves className="h-4 w-4" />; // Using Waves instead of Pool
      default:
        return null;
    }
  };

  // Parse amenities from description or use empty array
  let amenities = accommodation.amenities || [];
  if (!amenities.length && accommodation.description && typeof accommodation.description === 'string') {
    // Try to extract amenities from description if they're in a specific format like "Amenities: wifi, pool"
    const amenitiesMatch = accommodation.description.match(/amenities:([^.]+)/i);
    if (amenitiesMatch && amenitiesMatch[1]) {
      amenities = amenitiesMatch[1].split(',').map(a => a.trim());
    }
  }

  // Get proper title and price
  const title = accommodation.title || accommodation.name || "Lovely Accommodation";
  const price = accommodation.price || accommodation.pricePerNight || 100;

  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={accommodation.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {accommodation.rating || 4.5}
          </Badge>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {accommodation.location || "Lebanon"}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-600 mb-4 text-sm">{accommodation.description || "A beautiful accommodation with amazing amenities and views."}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.length > 0 ? (
            amenities.slice(0, 5).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              {accommodation.subCategoryId?.name || accommodation.type || "Comfortable Stay"}
            </Badge>
          )}
        </div>
        <div className="text-xl font-bold text-blue-700">
          ${price}
          <span className="text-sm font-normal text-gray-500"> per night</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link to={`/accommodations/${accommodation.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccommodationCard;
