export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingType =
  | "activity"
  | "custom"
  | "restaurant"
  | "accommodation";

export interface DirectusFileRef {
  id: string;
  filename_download?: string;
}

export interface ActivityItem {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  duration?: string;
  difficulty?: string;
  rating?: number;
  reviewCount?: number;
  groupCount?: string;
  image?: string;
  includes?: string | string[];
  excludes?: string | string[];
  requirements?: string | string[];
  seasons?: string | string[];
  availableDates?: string | string[];
  meetingPoint?: string;
  subCategoryId?: {
    id: number;
    name: string;
    categoryId: {
      id: number;
      title: string;
    };
  };
}

export interface BookingRecord {
  id: string;
  status: BookingStatus;
  type: BookingType;
  start_date: string;
  participants?: number;
  total_price?: number;
  notes?: string;
  destinations?: any;
  item?: ActivityItem | number | null;
  driver?: DriverProfile | number | null;
  user?: { id: string };
  created_at?: string;
  updated_at?: string;
}

export interface ActivityReview {
  id: string;
  rating: number;
  message?: string;
  created_at?: string;
  userID?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  booking?: {
    id: string;
  };
}

export interface DriverReview {
  id: string;
  rating: number;
  message?: string;
  created_at?: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
  booking?: {
    id: string;
  };
  driver?: {
    id: string;
    name?: string;
  };
}

export interface DriverProfile {
  id: number;
  name: string;
  phone?: string;
  vehicle?: string;
  location?: string;
  rating?: number | null;
  reviewCount?: number;
  languages?: string[] | string;
  specialties?: string[] | string;
  availability?: string;
  image?: string;
  years_experience?: number;
  reviews?: DriverReview[];
}
