import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Utensils,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { directusAPI, bookingAPI, reviewAPI } from "@/services/api";
import type {
  ActivityItem,
  ActivityReview,
  BookingRecord,
} from "@/types/directus";

interface RestaurantDetailLocationState {
  restaurant?: RestaurantRecord;
  source?: "static" | "directus";
}

type RestaurantRecord = ActivityItem & {
  menu?: any;
  openHours?: string;
  hours?: string;
  phone?: string;
};

const reservationTimes = [
  "12:00",
  "13:00",
  "14:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const combineDateAndTime = (date: Date, time: string) => {
  const [hours, minutes] = time
    .split(":")
    .map((part) => parseInt(part, 10) || 0);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.toISOString();
};

const parseMenu = (menuData: any) => {
  if (!menuData) return [];
  if (Array.isArray(menuData)) return menuData;
  if (typeof menuData === "string") {
    try {
      const parsed = JSON.parse(menuData);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return menuData
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((item) => ({ name: item }));
    }
  }
  return [];
};

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState =
    (location.state as RestaurantDetailLocationState) || null;
  const fallbackRestaurant = locationState?.restaurant ?? null;
  const fallbackSource = locationState?.source ?? "directus";
  const { user, isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(
    fallbackRestaurant
  );
  const [source, setSource] = useState<"directus" | "static">(
    fallbackSource ?? "directus"
  );
  const [loading, setLoading] = useState(!fallbackRestaurant);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("19:00");
  const [partySize, setPartySize] = useState<string>("2");
  const [notes, setNotes] = useState("");
  const [reservationLoading, setReservationLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      if (fallbackSource === "static" && fallbackRestaurant) {
        setRestaurant(fallbackRestaurant);
        setSource("static");
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        const result = await directusAPI.getActivityById(id);
        if (result) {
          setRestaurant(result);
          setSource("directus");
          setError(null);
        } else if (fallbackRestaurant) {
          setRestaurant(fallbackRestaurant);
          setSource("static");
          setError(null);
        } else {
          setError("Restaurant not found");
        }
      } catch (err) {
        console.error("Failed to fetch restaurant", err);
        if (fallbackRestaurant) {
          setRestaurant(fallbackRestaurant);
          setSource("static");
          setError(null);
        } else {
          setError("Failed to load restaurant details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, fallbackRestaurant, fallbackSource]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setBookings([]);
        return;
      }
      try {
        const response = await bookingAPI.getUserBookings(user.id);
        setBookings(response?.data || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const {
    data: reviewsResponse,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["restaurant-reviews", id],
    queryFn: () =>
      id ? reviewAPI.getActivityReviews(id) : Promise.resolve({ data: [] }),
    enabled: !!id,
  });

  const reviews: ActivityReview[] = reviewsResponse?.data || [];
  const averageRating = useMemo(() => {
    if (!reviews.length) return restaurant?.rating ?? null;
    const total = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return Number((total / reviews.length).toFixed(1));
  }, [reviews, restaurant?.rating]);

  const menuItems = useMemo(
    () => parseMenu(restaurant?.menu),
    [restaurant?.menu]
  );
  const locationLabel = restaurant?.location || "Lebanon";
  const openHours =
    restaurant?.openHours || restaurant?.hours || "Daily 12:00 PM - 11:00 PM";
  const getReviewerLabel = (review: ActivityReview) => {
    const reviewUser = review.user || review.userID;
    const firstName = review.user?.first_name || review.userID?.first_name;
    const lastName = review.user?.last_name || review.userID?.last_name;
    const name = [firstName, lastName].filter(Boolean).join(" ");
    if (name) {
      return name;
    }
    if (reviewUser?.email) {
      return reviewUser.email.split("@")[0];
    }
    return "Traveler";
  };
  const eligibleBookings = useMemo(() => {
    if (!bookings.length || !id) return [];
    const numericId = Number(id);
    return bookings.filter((booking) => {
      const bookingItemId =
        typeof booking.item === "object" ? booking.item?.id : booking.item;
      return (
        bookingItemId === numericId &&
        booking.status !== "cancelled" &&
        booking.item
      );
    });
  }, [bookings, id]);

  const userHasReviewed = useMemo(() => {
    if (!user?.id) return false;
    return reviews.some(
      (review) => review.user?.id === user.id || review.userID?.id === user.id
    );
  }, [reviews, user?.id]);

  useEffect(() => {
    if (eligibleBookings.length > 0 && !selectedBooking) {
      setSelectedBooking(eligibleBookings[0].id);
    }
  }, [eligibleBookings, selectedBooking]);

  const handleReservation = async () => {
    if (!selectedDate) {
      toast.error("Please pick a date for your reservation.");
      return;
    }

    if (!selectedTime) {
      toast.error("Please pick a time.");
      return;
    }

    if (!isAuthenticated || !user?.id) {
      toast.info("Please log in to make a reservation.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!restaurant) {
      toast.error("Restaurant details missing.");
      return;
    }

    try {
      setReservationLoading(true);
      const partyCount = parseInt(partySize, 10) || 2;
      await bookingAPI.createBooking({
        status: "completed",
        type: "restaurant",
        start_date: combineDateAndTime(selectedDate, selectedTime),
        participants: partyCount,
        notes:
          notes ||
          `Restaurant reservation: ${restaurant.title || "Dining experience"}`,
        item: source === "directus" ? Number(id) : undefined,
        user: user.id,
      });
      toast.success("Reservation received! We will confirm via email.");
      setNotes("");
      setSelectedDate(undefined);
      setSelectedTime("19:00");
      setPartySize("2");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create reservation";
      toast.error(message);
    } finally {
      setReservationLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!id || !selectedBooking) {
      toast.error("Please select a reservation to review.");
      return;
    }
    try {
      await reviewAPI.submitActivityReview({
        itemId: Number(id),
        booking: selectedBooking,
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      toast.success("Thank you for reviewing this restaurant!");
      setReviewDialogOpen(false);
      setReviewComment("");
      setReviewRating("5");
      await refetchReviews();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save review";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-amber-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load restaurant
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Restaurant not found"}
          </p>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => navigate("/restaurants")}
          >
            Back to Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-80 rounded-xl overflow-hidden">
              <img
                src={
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop"
                }
                alt={restaurant.title || "Restaurant"}
                className="w-full h-full object-cover"
              />
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      {restaurant.title || "Restaurant"}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Utensils className="h-4 w-4" />
                      <span>
                        {restaurant.subCategoryId?.name || "Restaurant"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-600" />
                    <span>{locationLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold">
                      {averageRating ?? "New"}{" "}
                      {reviews.length > 0 && (
                        <span className="text-sm text-gray-500">
                          ({reviews.length} reviews)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {restaurant.description ||
                    "A welcoming dining experience featuring regional flavors and seasonal ingredients."}
                </p>
                <div className="flex flex-wrap gap-4 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    {openHours}
                  </span>
                  {restaurant.phone && (
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-600" />
                      {restaurant.phone}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menu Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {menuItems.length > 0 ? (
                  menuItems.map((item: any, index: number) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-start justify-between gap-4 border-b pb-4 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.name || `Dish ${index + 1}`}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="font-medium text-amber-700">
                        {item.price || "$$"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Menu information will be available soon. Please contact the
                    restaurant directly for details.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Guest Reviews</CardTitle>
                  {/* <p className="text-sm text-gray-500">
                    Hear from diners who visited this restaurant.
                  </p> */}
                </div>
                {/* <Button
                  variant="outline"
                  disabled={
                    !isAuthenticated ||
                    userHasReviewed ||
                    !eligibleBookings.length
                  }
                  onClick={() => setReviewDialogOpen(true)}
                >
                  {userHasReviewed ? "Review submitted" : "Leave a review"}
                </Button> */}
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewsLoading ? (
                  <p className="text-sm text-gray-500">Loading reviews…</p>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {getReviewerLabel(review)}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < (review.rating || 0)
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.created_at
                            ? format(new Date(review.created_at), "MMM d, yyyy")
                            : "Recently"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {review.message && review.message.trim()
                          ? review.message
                          : "No comment provided."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No reviews yet. Be the first to share your dining experience
                    after your reservation.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Reserve a table</CardTitle>
                <p className="text-sm text-gray-500">
                  Select a date, time, and party size to request a reservation.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservationTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Party size</Label>
                  <Select value={partySize} onValueChange={setPartySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select party size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }).map((_, index) => {
                        const value = String(index + 1);
                        return (
                          <SelectItem key={value} value={value}>
                            {value} {Number(value) === 1 ? "guest" : "guests"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Allergies, seating preference, special occasion..."
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={handleReservation}
                  disabled={reservationLoading}
                >
                  {reservationLoading ? "Submitting..." : "Make Reservation"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>
                  Reservations are confirmed by the restaurant within a few
                  hours.
                </p>
                <p>
                  If you have urgent requests feel free to call{" "}
                  <span className="font-medium text-gray-800">
                    {restaurant.phone || "+961 1 234 567"}
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share your dining experience</DialogTitle>
            <DialogDescription>
              We link reviews to reservations to keep feedback authentic.
            </DialogDescription>
          </DialogHeader>
          {eligibleBookings.length === 0 ? (
            <p className="text-sm text-gray-500">
              You need a reservation for this restaurant before leaving a
              review.
            </p>
          ) : (
            <div className="space-y-4">
              {eligibleBookings.length > 1 && (
                <div className="space-y-2">
                  <Label>Select reservation</Label>
                  <Select
                    value={selectedBooking}
                    onValueChange={setSelectedBooking}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a booking" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleBookings.map((booking) => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.start_date
                            ? format(
                                new Date(booking.start_date),
                                "MMM d, yyyy"
                              )
                            : "Reservation"}{" "}
                          · {booking.participants || 2} guests
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Rating</Label>
                <Select value={reviewRating} onValueChange={setReviewRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value} {value === 1 ? "star" : "stars"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>What stood out?</Label>
                <Textarea
                  rows={4}
                  placeholder="Tell fellow travellers about the food, service, or ambience."
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!eligibleBookings.length || !selectedBooking}
            >
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestaurantDetail;
