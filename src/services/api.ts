import type { BookingStatus } from "@/types/directus";

/**
 * API Service for backend communication.
 * Handles Directus authentication, content fetching, bookings and reviews.
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL =
  (import.meta as any).env?.VITE_DIRECTUS_URL ?? "http://localhost:8055";
const ASSETS_URL = `${API_BASE_URL}/assets/`;

const getToken = () => localStorage.getItem("authToken");

const buildUrl = (path: string, searchParams?: Record<string, any>) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        value.forEach((entry) => url.searchParams.append(key, String(entry)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

interface DirectusFetchOptions {
  method?: HttpMethod;
  body?: any;
  auth?: boolean;
  headers?: Record<string, string>;
  searchParams?: Record<string, any>;
}

const directusFetch = async (
  path: string,
  {
    method = "GET",
    body,
    auth = false,
    headers = {},
    searchParams,
  }: DirectusFetchOptions = {}
) => {
  const token = getToken();
  const isFormData = body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  if (auth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, searchParams), {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (payload as any)?.errors?.[0]?.message ||
      (payload as any)?.message ||
      response.statusText ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
};

const formatImageUrl = (asset: any) => {
  if (!asset) return null;
  if (typeof asset === "string") return `${ASSETS_URL}${asset}`;
  if (typeof asset === "object" && asset.id) return `${ASSETS_URL}${asset.id}`;
  return asset;
};

const cleanPayload = (data: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string) =>
    directusFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: async (userData: any) =>
    directusFetch("/users", {
      method: "POST",
      body: {
        email: userData?.email,
        password: userData?.password,
        role: "c672a94c-5121-49d2-af2a-82e91075206a",
        first_name: userData?.firstName,
        last_name: userData?.lastName,
      },
    }),

  logout: async () =>
    directusFetch("/auth/logout", {
      method: "POST",
      auth: true,
    }),

  getCurrentUser: async () =>
    directusFetch("/users/me", {
      auth: true,
      searchParams: {
        fields: "id,email,first_name,last_name,role.name",
      },
    }),
};

export const userAPI = {
  getProfile: async () =>
    directusFetch("/users/me", {
      auth: true,
      searchParams: {
        fields:
          "id,email,first_name,last_name,location,phone,avatar,role.name,created_at",
      },
    }),

  updateProfile: async (profileData: any) =>
    directusFetch("/users/me", {
      method: "PATCH",
      auth: true,
      body: profileData,
    }),
};

export const directusAPI = {
  getCategories: async () =>
    directusFetch("/items/Category", {
      searchParams: { fields: "id,title", sort: "sort" },
    }),

  getsubCategories: async (id: number | string) =>
    directusFetch("/items/SubCategory", {
      searchParams: {
        "filter[categoryId][_eq]": id,
        fields: "*,categoryId.*",
        sort: "name",
      },
    }),

  getItems: async (
    subcategoryId: number | null = null,
    _categoryId: number | null = null,
    itemId: number | string | null = null
  ) => {
    const searchParams: Record<string, any> = {
      fields: "*,subCategoryId.*,subCategoryId.categoryId.*",
      sort: "-created_at",
    };

    if (itemId) {
      searchParams["filter[id][_eq]"] = itemId;
    } else if (subcategoryId) {
      searchParams["filter[subCategoryId][_eq]"] = subcategoryId;
    }

    const data = await directusFetch("/items/Items", { searchParams });

    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map((item: any) => ({
        ...item,
        image: formatImageUrl(item.image),
      }));
    }

    return data;
  },

  getActivityById: async (itemId: string | number) => {
    const response = await directusAPI.getItems(null, null, itemId);
    return response?.data?.[0] ?? null;
  },

  getTopActivities: async (limit = 6) => {
    const [itemsResponse, reviewsResponse] = await Promise.all([
      directusFetch("/items/Items", {
        searchParams: {
          fields: "*,subCategoryId.*,subCategoryId.categoryId.*",
          limit: -1,
        },
      }),
      directusFetch("/items/Review", {
        searchParams: {
          fields: "id,rating,itemId.id",
          limit: -1,
        },
      }).catch(() => ({ data: [] })),
    ]);

    const items = itemsResponse?.data || [];
    const reviews = reviewsResponse?.data || [];

    const itemsWithRatings = items.map((item: any) => {
      const itemReviews = reviews.filter((review: any) => {
        const reviewItemId =
          typeof review.itemId === "object" ? review.itemId?.id : review.itemId;
        return reviewItemId === item.id;
      });

      const average =
        itemReviews.length > 0
          ? itemReviews.reduce(
              (sum: number, r: any) => sum + (r.rating || 0),
              0
            ) / itemReviews.length
          : 0;

      return {
        ...item,
        image: formatImageUrl(item.image),
        rating: parseFloat(average.toFixed(2)),
        reviewCount: itemReviews.length,
      };
    });

    const sorted = itemsWithRatings
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    return { data: sorted, total: itemsWithRatings.length };
  },

  getDrivers: async () => {
    try {
      const [driversResponse, reviewsResponse] = await Promise.all([
        directusFetch("/items/Drivers", {
          searchParams: {
            fields:
              "*,image.id,image.filename_download,languages,specialties,driver_reviews.id",
            sort: "name",
          },
        }),
        directusFetch("/items/DriverReviews", {
          searchParams: {
            fields:
              "id,rating,comment,driver.id,created_at,user.first_name,user.last_name",
            limit: -1,
          },
        }).catch(() => ({ data: [] })),
      ]);

      const drivers = driversResponse?.data || [];
      const reviews = reviewsResponse?.data || [];

      const groupedReviews = reviews.reduce((acc: any, review: any) => {
        const driverId =
          typeof review.driver === "object" ? review.driver?.id : review.driver;
        if (!driverId) return acc;
        acc[driverId] = acc[driverId] || [];
        acc[driverId].push(review);
        return acc;
      }, {});

      return drivers.map((driver: any) => {
        const driverReviews = groupedReviews[driver.id] || [];
        const average =
          driverReviews.length > 0
            ? driverReviews.reduce(
                (sum: number, r: any) => sum + (r.rating || 0),
                0
              ) / driverReviews.length
            : null;

        return {
          ...driver,
          image: formatImageUrl(driver.image),
          rating: average ? parseFloat(average.toFixed(2)) : null,
          reviewCount: driverReviews.length,
          reviews: driverReviews,
        };
      });
    } catch (error) {
      console.error("Get drivers error:", error);
      return [];
    }
  },
};

// Booking API calls
export const bookingAPI = {
  createBooking: async (bookingData: any) =>
    directusFetch("/items/Bookings", {
      method: "POST",
      auth: true,
      body: cleanPayload(bookingData),
    }),

  getUserBookings: async (userId: string) =>
    directusFetch("/items/Bookings", {
      auth: true,
      searchParams: {
        "filter[user][id][_eq]": userId,
        fields:
          "*,item.*,driver.*,user.id,destinations,status,type,start_date,participants",
        sort: "-start_date",
      },
    }),

  cancelBooking: async (bookingId: string) =>
    directusFetch(`/items/Bookings/${bookingId}`, {
      method: "PATCH",
      auth: true,
      body: { status: "cancelled" },
    }),

  updateBookingStatus: async (bookingId: string, status: BookingStatus) =>
    directusFetch(`/items/Bookings/${bookingId}`, {
      method: "PATCH",
      auth: true,
      body: { status },
    }),
};

// Payment API calls (placeholders for future integration)
export const paymentAPI = {
  processPayment: async (paymentData: any) =>
    directusFetch("/payments/process", {
      method: "POST",
      auth: true,
      body: paymentData,
    }),

  getPaymentHistory: async () =>
    directusFetch("/payments/history", {
      auth: true,
    }),
};

export const reviewAPI = {
  submitActivityReview: async (reviewData: any) =>
    directusFetch("/items/Review", {
      method: "POST",
      auth: true,
      body: cleanPayload(reviewData),
    }),

  getActivityReviews: async (activityId: string | number) =>
    directusFetch("/items/Review", {
      searchParams: {
        "filter[itemId][_eq]": activityId,
        fields:
          "id,rating,comment,created_at,user.id,user.first_name,user.last_name,booking.id",
        sort: "-created_at",
        limit: -1,
      },
    }),

  getUserActivityReviews: async (userId: string) =>
    directusFetch("/items/Review", {
      auth: true,
      searchParams: {
        "filter[user][_eq]": userId,
        fields: "id,itemId.id,rating,comment,booking.id",
        limit: -1,
      },
    }),

  submitDriverReview: async (reviewData: any) =>
    directusFetch("/items/DriverReviews", {
      method: "POST",
      auth: true,
      body: cleanPayload(reviewData),
    }),

  getDriverReviews: async (driverId: string | number) =>
    directusFetch("/items/DriverReviews", {
      searchParams: {
        "filter[driver][_eq]": driverId,
        fields:
          "id,rating,comment,created_at,user.id,user.first_name,user.last_name,booking.id",
        sort: "-created_at",
        limit: -1,
      },
    }),

  getUserDriverReviews: async (userId: string) =>
    directusFetch("/items/DriverReviews", {
      auth: true,
      searchParams: {
        "filter[user][_eq]": userId,
        fields: "id,driver.id,driver.name,rating,comment,booking.id",
        limit: -1,
      },
    }),
};

export default {
  auth: authAPI,
  user: userAPI,
  booking: bookingAPI,
  payment: paymentAPI,
  review: reviewAPI,
  directus: directusAPI,
};
