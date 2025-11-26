export interface RestaurantSubcategory {
  id: number;
  name: string;
}

export interface RestaurantItem {
  id: number;
  title: string;
  cuisine?: string;
  location?: string;
  phoneNumber?: string;
  rating?: number;
  openHours?: string;
  priceRange?: string;
  image?: string;
  tags?: string[];
  subCategoryId: {
    id: number;
    name: string;
  };
}

export const DEFAULT_RESTAURANT_SUBCATEGORIES: RestaurantSubcategory[] = [
  { id: 101, name: "Lebanese Classics" },
  { id: 102, name: "Seafood" },
  { id: 103, name: "Fusion" },
  { id: 104, name: "Grill & BBQ" },
  { id: 105, name: "Desserts & Café" },
];

export const DEFAULT_RESTAURANTS: RestaurantItem[] = [
  {
    id: 1,
    title: "Beirut Mezze",
    cuisine: "Lebanese Traditional",
    location: "Downtown, Beirut",
    phoneNumber: "+961 1 234 567",
    rating: 4.8,
    openHours: "11:00 AM - 11:00 PM",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    tags: ["Lebanese Cuisine", "Mezze", "Downtown"],
    subCategoryId: { id: 101, name: "Lebanese Classics" },
  },
  {
    id: 2,
    title: "Byblos Seafood",
    cuisine: "Seafood",
    location: "Harbor Area, Byblos",
    phoneNumber: "+961 9 123 456",
    rating: 4.7,
    openHours: "12:00 PM - 10:00 PM",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1599458252573-56ae36120de1?q=80&w=2070&auto=format&fit=crop",
    tags: ["Seafood", "Harbor View", "Fresh Catch"],
    subCategoryId: { id: 102, name: "Seafood" },
  },
  {
    id: 3,
    title: "Mountain Terrace",
    cuisine: "Lebanese Fusion",
    location: "Faraya Mountains",
    phoneNumber: "+961 3 987 654",
    rating: 4.9,
    openHours: "10:00 AM - 9:00 PM",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop",
    tags: ["Mountain View", "Fusion", "Outdoor Seating"],
    subCategoryId: { id: 103, name: "Fusion" },
  },
  {
    id: 4,
    title: "Cedar Valley Grill",
    cuisine: "Barbecue & Grill",
    location: "Batroun Coast",
    phoneNumber: "+961 6 345 678",
    rating: 4.6,
    openHours: "11:00 AM - 12:00 AM",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    tags: ["Barbecue", "Grilled Meats", "Family Friendly"],
    subCategoryId: { id: 104, name: "Grill & BBQ" },
  },
  {
    id: 5,
    title: "Zahle Garden",
    cuisine: "Traditional Lebanese",
    location: "Zahle, Bekaa Valley",
    phoneNumber: "+961 8 765 432",
    rating: 4.9,
    openHours: "9:00 AM - 10:00 PM",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    tags: ["Bekaa Valley", "Traditional", "Garden Setting"],
    subCategoryId: { id: 101, name: "Lebanese Classics" },
  },
  {
    id: 6,
    title: "Tripoli Sweets",
    cuisine: "Desserts & Cafe",
    location: "Old Souks, Tripoli",
    phoneNumber: "+961 6 123 789",
    rating: 4.7,
    openHours: "8:00 AM - 9:00 PM",
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2125&auto=format&fit=crop",
    tags: ["Sweets", "Traditional Desserts", "Coffee"],
    subCategoryId: { id: 105, name: "Desserts & Café" },
  },
];

export const getStaticRestaurantById = (restaurantId: string | number) => {
  const numericId = Number(restaurantId);
  if (Number.isNaN(numericId)) return undefined;
  return DEFAULT_RESTAURANTS.find((restaurant) => Number(restaurant.id) === numericId);
};

