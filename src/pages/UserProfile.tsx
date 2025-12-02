import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Route,
  Star,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { bookingAPI, reviewAPI, userAPI } from "@/services/api";
import type {
  ActivityReview,
  BookingRecord,
  DriverReview,
} from "@/types/directus";
import { autoCompletePastBookings } from "@/utils/bookings";

interface ReviewDialogState {
  open: boolean;
  booking: BookingRecord | null;
}

//

const bookingTypeLabels: Record<string, string> = {
  activity: "Activity",
  custom: "Custom tour",
  restaurant: "Restaurant",
  accommodation: "Stay",
};

const bookingPreviewImages: Record<string, string> = {
  activity:
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop",
  restaurant:
    "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop",
  accommodation:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
  custom:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
};

const getDetailPathForBooking = (
  booking: BookingRecord,
  itemId?: number | string | null
) => {
  if (!itemId) return null;
  switch (booking.type) {
    case "activity":
      return `/activities/detail/${itemId}`;
    case "restaurant":
      return `/restaurants/detail/${itemId}`;
    case "accommodation":
      return `/accommodations/${itemId}`;
    default:
      return null;
  }
};

const normalizeArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const normalizeDestinations = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(",")
        .map((entry) => ({
          name: entry.trim(),
        }))
        .filter((dest) => dest.name);
    }
  }
  return [];
};

const isBookingCompleted = (booking: BookingRecord) => {
  if (booking.status === "completed") return true;
  if (!booking.start_date) return false;
  return new Date(booking.start_date).getTime() < Date.now();
};

const getBookingDate = (booking: BookingRecord) => {
  if (!booking.start_date) return "Date TBD";
  return format(new Date(booking.start_date), "EEE, MMM d, yyyy");
};

const getItemFromBooking = (booking: BookingRecord) => {
  if (!booking.item) return null;
  if (typeof booking.item === "object") return booking.item;
  return null;
};

const getDriverFromBooking = (booking: BookingRecord) => {
  if (!booking.driver) return null;
  if (typeof booking.driver === "object") return booking.driver;
  return null;
};

const getBookingPreview = (booking: BookingRecord) => {
  const item = getItemFromBooking(booking);
  const destinations = normalizeDestinations(booking.destinations);

  const detailPath = getDetailPathForBooking(
    booking,
    typeof item?.id === "number" ? item.id : null
  );

  const title =
    item?.title ||
    destinations[0]?.name ||
    booking.notes ||
    "Reserved experience";

  const subtitle =
    item?.location ||
    destinations[0]?.name ||
    booking.notes ||
    "We'll finalize the details soon.";

  const image =
    item?.image ||
    bookingPreviewImages[booking.type] ||
    bookingPreviewImages.default;

  return { title, subtitle, detailPath, image };
};

const UserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activityReviewState, setActivityReviewState] =
    useState<ReviewDialogState>({ open: false, booking: null });
  const [driverReviewState, setDriverReviewState] = useState<ReviewDialogState>(
    {
      open: false,
      booking: null,
    }
  );
  const [activityReviewForm, setActivityReviewForm] = useState({
    rating: "5",
    comment: "",
  });
  const [driverReviewForm, setDriverReviewForm] = useState({
    rating: "5",
    comment: "",
  });

  const { data: profileResponse, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userAPI.getProfile(),
    enabled: !!user?.id,
  });

  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: () => bookingAPI.getUserBookings(user!.id),
    enabled: !!user?.id,
  });

  const {
    data: activityReviewsResponse,
    isLoading: activityReviewsLoading,
    refetch: refetchActivityReviews,
  } = useQuery({
    queryKey: ["user-activity-reviews", user?.id],
    queryFn: () => reviewAPI.getUserActivityReviews(user!.id),
    enabled: !!user?.id,
  });

  const {
    data: driverReviewsResponse,
    isLoading: driverReviewsLoading,
    refetch: refetchDriverReviews,
  } = useQuery({
    queryKey: ["user-driver-reviews", user?.id],
    queryFn: () => reviewAPI.getUserDriverReviews(user!.id),
    enabled: !!user?.id,
  });

  const profile = profileResponse?.data ?? profileResponse ?? null;
  const bookings: BookingRecord[] = bookingsResponse?.data ?? [];
  const activityReviews: ActivityReview[] = activityReviewsResponse?.data ?? [];
  const driverReviews: DriverReview[] = driverReviewsResponse?.data ?? [];

  useEffect(() => {
    const syncBookingStatuses = async () => {
      if (!bookings.length || !user?.id) return;
      const updated = await autoCompletePastBookings(bookings);
      if (updated) {
        queryClient.invalidateQueries({
          queryKey: ["user-bookings", user.id],
        });
      }
    };
    syncBookingStatuses();
  }, [bookings, queryClient, user?.id]);

  const bookingsSorted = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        // Use created_at if available, otherwise fall back to id (higher id = newer)
        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : Number(a.id) || 0;
        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : Number(b.id) || 0;
        return dateB - dateA;
      }),
    [bookings]
  );

  const upcomingBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          !isBookingCompleted(booking) && booking.status !== "cancelled"
      ),
    [bookings]
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => isBookingCompleted(booking)),
    [bookings]
  );

  const activityReviewMap = useMemo(() => {
    const map = new Map<string, ActivityReview>();
    activityReviews.forEach((review) => {
      const bookingId =
        typeof review.booking === "object"
          ? review.booking?.id
          : review.booking;
      if (bookingId) {
        map.set(bookingId, review);
      }
    });
    return map;
  }, [activityReviews]);

  const driverReviewMap = useMemo(() => {
    const map = new Map<string, DriverReview>();
    driverReviews.forEach((review) => {
      const bookingId =
        typeof review.booking === "object"
          ? review.booking?.id
          : review.booking;
      if (bookingId) {
        map.set(bookingId, review);
      }
    });
    return map;
  }, [driverReviews]);

  const visitedPlaces = useMemo(() => {
    const map = new Map<
      number,
      {
        item: any;
        booking: BookingRecord;
      }
    >();

    bookings.forEach((booking) => {
      const item = getItemFromBooking(booking);
      if (!item?.id) return;
      if (!map.has(item.id)) {
        map.set(item.id, { item, booking });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  const profileInitials = useMemo(() => {
    const initials =
      [profile?.first_name, profile?.last_name]
        .filter(Boolean)
        .map((value) => value?.charAt(0))
        .join("") ||
      user?.name?.slice(0, 2) ||
      "TR";
    return initials.toUpperCase();
  }, [profile?.first_name, profile?.last_name, user?.name]);

  const stats = [
    {
      label: "Total trips",
      value: bookings.length,
      icon: Route,
    },
    // {
    //   label: "Upcoming",
    //   value: upcomingBookings.length,
    //   icon: Calendar,
    // },
    // {
    //   label: "Completed",
    //   value: completedBookings.length,
    //   icon: CheckCircle2,
    // },
    // {
    //   label: "Reviews left",
    //   value: activityReviews.length + driverReviews.length,
    //   icon: Star,
    // },
  ];

  const loading = profileLoading || bookingsLoading;

  const openActivityReview = (booking: BookingRecord) => {
    setActivityReviewForm({
      rating: "5",
      comment: "",
    });
    setActivityReviewState({ open: true, booking });
  };

  const openDriverReview = (booking: BookingRecord) => {
    setDriverReviewForm({
      rating: "5",
      comment: "",
    });
    setDriverReviewState({ open: true, booking });
  };

  const handleSubmitActivityReview = async () => {
    if (!activityReviewState.booking) return;
    const booking = activityReviewState.booking;
    const item = getItemFromBooking(booking);
    if (!item?.id) {
      toast.error("Missing activity information for this booking.");
      return;
    }

    try {
      await reviewAPI.submitActivityReview({
        itemId: item.id,
        booking: booking.id,
        rating: Number(activityReviewForm.rating),
        message: activityReviewForm.comment,
        userID: user?.id,
      });
      toast.success("Review submitted!");
      setActivityReviewState({ open: false, booking: null });
      setActivityReviewForm({ rating: "5", comment: "" });
      await refetchActivityReviews();
      queryClient.invalidateQueries({
        queryKey: ["activity-reviews", String(item.id)],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save review";
      toast.error(message);
    }
  };

  const handleSubmitDriverReview = async () => {
    if (!driverReviewState.booking) return;
    const booking = driverReviewState.booking;
    const driver = getDriverFromBooking(booking);
    if (!driver?.id) {
      toast.error("Missing driver information for this booking.");
      return;
    }

    try {
      await reviewAPI.submitDriverReview({
        driver: driver.id,
        booking: booking.id,
        rating: Number(driverReviewForm.rating),
        message: driverReviewForm.comment,
        userID: user?.id,
      });
      toast.success("Driver review submitted!");
      setDriverReviewState({ open: false, booking: null });
      setDriverReviewForm({ rating: "5", comment: "" });
      await refetchDriverReviews();
      queryClient.invalidateQueries({
        queryKey: ["drivers"],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save review";
      toast.error(message);
    }
  };

  if (!user?.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <h2 className="text-2xl font-bold">Sign in to view your trips</h2>
            <p className="text-gray-600">
              You need an account to track bookings, reviews, and saved drivers.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <Card>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-100 text-emerald-900 text-xl">
                {profileInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Traveler profile
              </p>
              <h1 className="text-3xl font-bold">
                {profile?.first_name || profile?.last_name
                  ? `${profile?.first_name ?? ""} ${
                      profile?.last_name ?? ""
                    }`.trim()
                  : user.name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              {profile?.created_at && (
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {format(new Date(profile.created_at), "MMMM yyyy")}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="gap-2 border-emerald-200 text-emerald-900"
            >
              <UserIcon className="h-4 w-4" />
              {profile?.location ? profile.location : "Lebanon Explorer"}
            </Badge>
            {/* <Badge variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              {bookings.length
                ? `${bookings.length} trip${
                    bookings.length === 1 ? "" : "s"
                  } booked`
                : "No trips yet"}
            </Badge> */}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border border-emerald-50 bg-emerald-50/50"
          >
            <CardContent className="py-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                <stat.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* tips was here */}

        <Card>
          <CardHeader>
            <CardTitle>Driver experiences</CardTitle>
            <p className="text-sm text-gray-500">
              Keep track of every driver you toured with.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings.filter((booking) => booking.driver).length === 0 && (
              <p className="text-sm text-gray-500">
                You have not booked a driver yet. Book a custom tour and select
                a preferred driver directly from Directus.
              </p>
            )}

            {bookings
              .filter((booking) => booking.driver)
              .map((booking) => {
                const driver = getDriverFromBooking(booking);
                if (!driver) return null;
                const hasReview = driverReviewMap.has(booking.id);
                const completed = isBookingCompleted(booking);

                return (
                  <div
                    key={`${booking.id}-${driver.id}`}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {getBookingDate(booking)}
                        </p>
                        <h4 className="font-semibold">{driver.name}</h4>
                        <p className="text-sm text-gray-600">
                          {driver.vehicle || "Private vehicle"}
                        </p>
                      </div>
                      <div className="text-right">
                        {driver.rating && (
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{driver.rating}</span>
                          </div>
                        )}
                        {driver.reviewCount !== undefined && (
                          <p className="text-xs text-gray-500">
                            {driver.reviewCount} public reviews
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {normalizeArray(driver.languages).map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4">
                      {completed && !hasReview ? (
                        <Button
                          size="sm"
                          onClick={() => openDriverReview(booking)}
                        >
                          Share driver review
                        </Button>
                      ) : hasReview ? (
                        <Badge
                          variant="outline"
                          className="text-emerald-700 gap-1"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Review submitted
                        </Badge>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Review available after the trip is completed.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Places you've visited</CardTitle>
          <p className="text-sm text-gray-500">
            Every activity you completed automatically shows up here.
          </p>
        </CardHeader>
        <CardContent>
          {visitedPlaces.length === 0 ? (
            <p className="text-sm text-gray-500">
              Complete an activity to start building your travel history.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visitedPlaces.map(({ item, booking }) => {
                const hasReview = activityReviewMap.has(booking.id);
                const completed = isBookingCompleted(booking);
                const detailPath = getDetailPathForBooking(booking, item.id);
                const buttonLabel =
                  booking.type === "restaurant"
                    ? "View restaurant"
                    : booking.type === "accommodation"
                    ? "View accommodation"
                    : "View activity";

                return (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <div className="h-40 bg-gray-100">
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          {getBookingDate(booking)}
                        </p>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.location && (
                          <p className="text-sm text-gray-600">
                            {item.location}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {detailPath && (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to={detailPath}
                              state={{
                                [booking.type === "restaurant"
                                  ? "restaurant"
                                  : booking.type === "accommodation"
                                  ? "accommodation"
                                  : "activity"]: item,
                                source: "profile",
                              }}
                            >
                              {buttonLabel}
                            </Link>
                          </Button>
                        )}
                        {completed && !hasReview && (
                          <Button
                            size="sm"
                            onClick={() => openActivityReview(booking)}
                          >
                            Review
                          </Button>
                        )}
                        {hasReview && (
                          <Badge
                            variant="outline"
                            className="text-emerald-700 gap-1"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Your reviews</CardTitle>
          <p className="text-sm text-gray-500">
            A recap of every review you've submitted through Directus.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Activity reviews
            </h3>
            {activityReviewsLoading ? (
              <p className="text-sm text-gray-500">Loading reviews…</p>
            ) : activityReviews.length === 0 ? (
              <p className="text-sm text-gray-500">
                You haven't shared feedback on an activity yet.
              </p>
            ) : (
              <div className="space-y-4">
                {activityReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              "h-4 w-4",
                              index < review.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {review.message && review.message.trim()
                        ? review.message
                        : "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Car className="h-5 w-5 text-emerald-600" />
              Driver reviews
            </h3>
            {driverReviewsLoading ? (
              <p className="text-sm text-gray-500">Loading reviews…</p>
            ) : driverReviews.length === 0 ? (
              <p className="text-sm text-gray-500">
                Share feedback on drivers once your tours are completed.
              </p>
            ) : (
              <div className="space-y-4">
                {driverReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {review.driver?.name || "Driver"}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={cn(
                                "h-4 w-4",
                                index < review.rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {review.message && review.message.trim()
                        ? review.message
                        : "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card> */}

      <Dialog
        open={activityReviewState.open}
        onOpenChange={(open) =>
          setActivityReviewState((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review your experience</DialogTitle>
            <DialogDescription>
              Reviews are tied to your bookings so travelers can trust the
              feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <Select
                value={activityReviewForm.rating}
                onValueChange={(value) =>
                  setActivityReviewForm((prev) => ({ ...prev, rating: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} {value === 1 ? "Star" : "Stars"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                className="mt-2"
                rows={4}
                placeholder="Share what stood out during your tour"
                value={activityReviewForm.comment}
                onChange={(event) =>
                  setActivityReviewForm((prev) => ({
                    ...prev,
                    comment: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitActivityReview}>Submit review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={driverReviewState.open}
        onOpenChange={(open) =>
          setDriverReviewState((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review your driver</DialogTitle>
            <DialogDescription>
              Driver reviews help other travelers choose the perfect guide.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <Select
                value={driverReviewForm.rating}
                onValueChange={(value) =>
                  setDriverReviewForm((prev) => ({ ...prev, rating: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} {value === 1 ? "Star" : "Stars"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                className="mt-2"
                rows={4}
                placeholder="How was the ride? Share tips for other guests."
                value={driverReviewForm.comment}
                onChange={(event) =>
                  setDriverReviewForm((prev) => ({
                    ...prev,
                    comment: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitDriverReview}>
              Submit driver review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
