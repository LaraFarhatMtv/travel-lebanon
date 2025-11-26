import type { ActivityItem } from "@/types/directus";

export interface ActivitySubcategory {
  id: number;
  name: string;
}

export const DEFAULT_ACTIVITY_SUBCATEGORIES: ActivitySubcategory[] = [
  { id: 201, name: "Cultural Tours" },
  { id: 202, name: "Outdoor Adventures" },
  { id: 203, name: "Food & Wine" },
  { id: 204, name: "Water Activities" },
  { id: 205, name: "City Walks" },
];

export const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    title: "Jeita Grotto & Byblos Day Trip",
    location: "Jeita • Byblos",
    price: 75,
    duration: "6 hours",
    description:
      "Discover the famous Jeita Grotto followed by a guided stroll through historic Byblos souks.",
    rating: 4.9,
    seasons: ["Spring", "Summer"],
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 201, name: "Cultural Tours", categoryId: { id: 4, title: "Activities" } },
  },
  {
    id: 2,
    title: "Sunset Hike in Chouf Cedars",
    location: "Chouf Mountains",
    price: 55,
    duration: "4 hours",
    description:
      "Moderate hike among centuries-old cedar trees ending with panoramic sunset views.",
    rating: 4.8,
    seasons: ["Spring", "Autumn"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 202, name: "Outdoor Adventures", categoryId: { id: 4, title: "Activities" } },
  },
  {
    id: 3,
    title: "Tyre Coastal Kayak",
    location: "Tyre Coast",
    price: 60,
    duration: "3 hours",
    description:
      "Paddle through the protected Tyre coastline with snorkel stops at crystal coves.",
    rating: 4.7,
    seasons: ["Summer"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 204, name: "Water Activities", categoryId: { id: 4, title: "Activities" } },
  },
  {
    id: 4,
    title: "Old Beirut Food Trail",
    location: "Beirut",
    price: 65,
    duration: "3.5 hours",
    description:
      "Taste authentic bites in Gemmayzeh and Mar Mikhael while hearing stories from local hosts.",
    rating: 4.9,
    seasons: ["All Year"],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 203, name: "Food & Wine", categoryId: { id: 4, title: "Activities" } },
  },
  {
    id: 5,
    title: "Batroun Cycling Escape",
    location: "Batroun",
    price: 50,
    duration: "5 hours",
    description:
      "Leisurely coastal bike ride with lemonade stops and a dip in the Mediterranean.",
    rating: 4.6,
    seasons: ["Spring", "Summer", "Autumn"],
    image:
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 202, name: "Outdoor Adventures", categoryId: { id: 4, title: "Activities" } },
  },
  {
    id: 6,
    title: "Beirut Street Art Walk",
    location: "Beirut",
    price: 35,
    duration: "2 hours",
    description:
      "Guided walking tour highlighting the capital's vibrant murals and hidden ateliers.",
    rating: 4.5,
    seasons: ["All Year"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop",
    subCategoryId: { id: 205, name: "City Walks", categoryId: { id: 4, title: "Activities" } },
  },
];

export const getStaticActivityById = (activityId: string | number) => {
  const numericId = Number(activityId);
  if (Number.isNaN(numericId)) return undefined;
  return DEFAULT_ACTIVITIES.find((activity) => Number(activity.id) === numericId);
};

