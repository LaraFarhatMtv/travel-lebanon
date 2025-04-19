
import { Accommodation } from '@/components/accommodations/AccommodationCard';

// Dummy data for accommodations
export const accommodations: Accommodation[] = [
  {
    id: 1,
    name: "Beirut Bay Resort",
    type: "beach-resort",
    location: "Beirut Coast",
    pricePerNight: 120,
    rating: 4.8,
    amenities: ["Beach Access", "Pool", "Restaurant", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    description: "Modern beach resort with amazing Mediterranean views, just minutes away from downtown Beirut."
  },
  {
    id: 2,
    name: "Cedar Mountains Lodge",
    type: "mountain-resort",
    location: "Mount Lebanon",
    pricePerNight: 95,
    rating: 4.7,
    amenities: ["Mountain Views", "Hiking Trails", "Restaurant", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1548704806-0c20f7ea6474?q=80&w=2070&auto=format&fit=crop",
    description: "Cozy mountain lodge nestled among the cedar forests with stunning views and hiking opportunities."
  },
  {
    id: 3,
    name: "Byblos Beach House",
    type: "beach-resort",
    location: "Byblos",
    pricePerNight: 150,
    rating: 4.9,
    amenities: ["Private Beach", "Pool", "Restaurant", "WiFi", "Spa", "Parking"],
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop",
    description: "Luxury beach resort in historic Byblos with private beach access and world-class amenities."
  },
  {
    id: 4,
    name: "Faraya Ski Chalet",
    type: "mountain-resort",
    location: "Faraya",
    pricePerNight: 110,
    rating: 4.6,
    amenities: ["Ski Access", "Fireplace", "Restaurant", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1520984032042-162d526883e0?q=80&w=2070&auto=format&fit=crop",
    description: "Charming ski chalet with direct access to Faraya slopes and cozy fireside lounges."
  },
  {
    id: 5,
    name: "Batroun Beachfront Villa",
    type: "beach-resort",
    location: "Batroun",
    pricePerNight: 200,
    rating: 4.9,
    amenities: ["Private Beach", "Pool", "Kitchen", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop",
    description: "Exclusive beachfront villa in Batroun with private pool and direct beach access."
  },
  {
    id: 6,
    name: "Bekaa Valley Guesthouse",
    type: "rural-retreat",
    location: "Bekaa Valley",
    pricePerNight: 75,
    rating: 4.5,
    amenities: ["Vineyard Views", "Breakfast", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?q=80&w=2070&auto=format&fit=crop",
    description: "Charming guesthouse surrounded by vineyards in the fertile Bekaa Valley."
  }
];
