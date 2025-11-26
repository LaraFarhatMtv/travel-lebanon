import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar as CalendarIcon,
  Info,
  CheckCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { directusAPI, bookingAPI, reviewAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type {
  ActivityReview,
  ActivityItem as ActivityItemType,
  BookingRecord,
} from "@/types/directus";
import { toast } from "sonner";
import { autoCompletePastBookings } from "@/utils/bookings";

interface ActivityDetailLocationState {
  activity?: ActivityItemType;
  source?: "static" | "directus" | "profile";
}

// Define an interface for the activity item
const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as ActivityDetailLocationState) || null;
  const fallbackActivity = locationState?.activity;
  const fallbackSource = locationState?.source;
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState<string>("1");
  const [activity, setActivity] = useState<ActivityItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [activitySource, setActivitySource] = useState<
    "directus" | "static" | "profile"
  >(fallbackSource ?? "directus");

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!id) return;

      if (fallbackSource === "static" && fallbackActivity) {
        setActivity(fallbackActivity);
        setActivitySource("static");
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await directusAPI.getActivityById(id);
        if (result) {
          setActivity(result);
          setActivitySource("directus");
          setError(null);
        } else if (fallbackActivity) {
          setActivity(fallbackActivity);
          setActivitySource(fallbackSource ?? "directus");
          setError(null);
        } else {
          setError("Activity not found");
        }
      } catch (err) {
        console.error("Error fetching activity:", err);
        if (fallbackActivity) {
          setActivity(fallbackActivity);
          setActivitySource(fallbackSource ?? "directus");
          setError(null);
        } else {
          setError("Failed to load activity details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [id, fallbackActivity, fallbackSource]);

  const fetchBookings = useCallback(async () => {
    if (!user?.id || !id) {
      setBookings([]);
      return;
    }
    try {
      const response = await bookingAPI.getUserBookings(user.id);
      const latestBookings = response?.data || [];
      setBookings(latestBookings);
      const autoCompleted = await autoCompletePastBookings(latestBookings);
      if (autoCompleted) {
        const refreshed = await bookingAPI.getUserBookings(user.id);
        setBookings(refreshed?.data || []);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  }, [user?.id, id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const {
    data: reviewsResponse,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["activity-reviews", id],
    queryFn: () =>
      id ? reviewAPI.getActivityReviews(id) : Promise.resolve({ data: [] }),
    enabled: !!id,
  });

  const reviews: ActivityReview[] = reviewsResponse?.data || [];

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const total = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const eligibleBookings = useMemo(() => {
    if (!bookings.length || !id) return [];
    const activityId = Number(id);
    return bookings.filter((booking) => {
      const bookingItemId =
        typeof booking.item === "object" ? booking.item?.id : booking.item;
      if (bookingItemId !== activityId) return false;
      if (booking.status === "completed") return true;
      const bookingDate = booking.start_date
        ? new Date(booking.start_date)
        : null;
      return bookingDate ? bookingDate.getTime() < Date.now() : false;
    });
  }, [bookings, id]);

  const userHasReviewed = useMemo(() => {
    if (!user?.id) return false;
    return reviews.some((review) => review.user?.id === user.id);
  }, [reviews, user?.id]);

  useEffect(() => {
    if (eligibleBookings.length > 0 && !selectedBooking) {
      setSelectedBooking(eligibleBookings[0].id);
    }
  }, [eligibleBookings, selectedBooking]);

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date before booking.");
      return;
    }

    if (!isAuthenticated || !user?.id) {
      toast.info("Please log in to book this activity.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!activity) {
      toast.error("Activity details are missing.");
      return;
    }

    const isDirectusActivity = activitySource !== "static";

    try {
      setBookingLoading(true);
      const participantCount = parseInt(participants, 10) || 1;
      await bookingAPI.createBooking({
        status: "pending",
        type: "activity",
        start_date: date.toISOString(),
        participants: participantCount,
        total_price: (activity.price || 0) * participantCount,
        item: isDirectusActivity ? Number(id) : undefined,
        notes: !isDirectusActivity
          ? `Static activity booking: ${activity.title ?? "Untitled activity"}`
          : undefined,
        user: user.id,
      });
      toast.success("Booking request received! We'll be in touch shortly.");
      await fetchBookings();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking";
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!id || !selectedBooking) {
      toast.error("Please pick a booking to review.");
      return;
    }
    try {
      await reviewAPI.submitActivityReview({
        itemId: Number(id),
        booking: selectedBooking,
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      toast.success("Thank you for sharing your experience!");
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

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load activity
          </h2>
          <p className="text-gray-600 mb-6">{error || "Activity not found"}</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <a href="/activities">Browse Activities</a>
          </Button>
        </div>
      </div>
    );
  }

  // Prepare data with fallbacks
  const title = activity.title || "Activity";
  const description = activity.description || "No description available";
  const price = activity.price || 45;
  const activityLocation = activity.location || "Lebanon";
  const rating = activity.rating || 4.7;

  // Parse JSON fields if needed
  let includes: string[] = [];
  let excludes: string[] = [];
  let requirements: string[] = [];
  let seasons: string[] = [];
  let availableDates: Date[] = [];

  try {
    if (typeof activity.includes === "string") {
      includes = JSON.parse(activity.includes);
    } else if (Array.isArray(activity.includes)) {
      includes = activity.includes;
    }

    if (typeof activity.excludes === "string") {
      excludes = JSON.parse(activity.excludes);
    } else if (Array.isArray(activity.excludes)) {
      excludes = activity.excludes;
    }

    if (typeof activity.requirements === "string") {
      requirements = JSON.parse(activity.requirements);
    } else if (Array.isArray(activity.requirements)) {
      requirements = activity.requirements;
    }

    if (typeof activity.seasons === "string") {
      // Try JSON first (e.g. '["Summer","Winter"]')
      try {
        const parsed = JSON.parse(activity.seasons);
        if (Array.isArray(parsed)) {
          seasons = parsed;
        } else if (typeof parsed === "string" && parsed.trim()) {
          seasons = [parsed.trim()];
        }
      } catch {
        // Fallback: support comma-separated or single plain string like "summer"
        const raw = activity.seasons.trim();
        if (raw) {
          seasons = raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    } else if (Array.isArray(activity.seasons)) {
      seasons = activity.seasons;
    }

    if (typeof activity.availableDates === "string") {
      availableDates = JSON.parse(activity.availableDates).map(
        (dateStr: string) => new Date(dateStr)
      );
    } else if (Array.isArray(activity.availableDates)) {
      availableDates = activity.availableDates.map(
        (dateStr: string) => new Date(dateStr)
      );
    }
  } catch (err) {
    console.error("Error parsing JSON fields:", err);
  }

  // If no available dates, create some default ones
  if (!availableDates.length) {
    const today = new Date();
    availableDates = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
    ];
  }

  // Setup images
  const images = [];
  if (activity.image) {
    images.push(activity.image);
  }

  // Add fallback images if needed
  while (images.length < 3) {
    images.push(
      `https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${
        1920 + images.length
      }`
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Activity details */}
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
                alt={`${title} scene 2`}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src={images[2]}
                alt={`${title} scene 3`}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Activity Title and Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">{activityLocation}</span>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">
                  {averageRating || rating}{" "}
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 px-3 py-1 flex items-center gap-1"
              >
                <Clock className="h-4 w-4" />
                {activity.duration || "6 hours"}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-3 py-1 flex items-center gap-1"
              >
                <Users className="h-4 w-4" />
                {activity.groupCount || "Small groups (5-10)"}
              </Badge>
              {seasons && seasons.length > 0 ? (
                seasons.map((season: string, i: number) => (
                  <Badge key={i} variant="outline" className="px-3 py-1">
                    {season}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="px-3 py-1">
                  All Seasons
                </Badge>
              )}
            </div>
          </div>

          {/* Tabs for Details */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="includes">What's Included</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {description}
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-green-600" />
                  Meeting Point
                </h3>
                <p className="text-gray-700">
                  {activity.meetingPoint || "Will be provided after booking"}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="includes" className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <CheckCheck className="h-5 w-5 text-green-600" />
                    Included in the Price
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {includes.length > 0 ? (
                      includes.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700">
                          {item}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="text-gray-700">Professional guide</li>
                        <li className="text-gray-700">Transportation</li>
                        <li className="text-gray-700">Lunch & snacks</li>
                        <li className="text-gray-700">Water</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Not Included
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {excludes.length > 0 ? (
                      excludes.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700">
                          {item}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="text-gray-700">Personal expenses</li>
                        <li className="text-gray-700">Optional gratuities</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="requirements" className="pt-6">
              <h3 className="text-lg font-semibold mb-3">What to Bring</h3>
              <ul className="list-disc pl-5 space-y-2">
                {requirements.length > 0 ? (
                  requirements.map((item: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      {item}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-gray-700">Comfortable walking shoes</li>
                    <li className="text-gray-700">
                      Sun protection (hat, sunglasses, sunscreen)
                    </li>
                    <li className="text-gray-700">Water bottle</li>
                    <li className="text-gray-700">Camera (optional)</li>
                  </>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    See what other travellers thought about this experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="text-lg font-semibold">
                    {averageRating || rating} / 5 · {reviews.length} reviews
                  </div>
                  <Button
                    variant="outline"
                    disabled={
                      !isAuthenticated ||
                      !eligibleBookings.length ||
                      userHasReviewed
                    }
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    {userHasReviewed ? "Review submitted" : "Leave a review"}
                  </Button>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="text-center text-gray-500 py-6">
                  Loading reviews...
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">
                        {[review.user?.first_name, review.user?.last_name]
                          .filter(Boolean)
                          .join(" ") || "Traveler"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "Recently"}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (review.rating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      {review.comment || "Great experience!"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No reviews yet. Book the experience and be the first to
                    share feedback!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Booking */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="text-2xl font-bold mb-6">
                ${price}
                <span className="text-gray-500 text-base font-normal">
                  {" "}
                  / person
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Select Date:</Label>
                  <div className="relative mt-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        // Disable dates that aren't in the available dates array
                        return !availableDates.some(
                          (availableDate) =>
                            availableDate.getDate() === date.getDate() &&
                            availableDate.getMonth() === date.getMonth() &&
                            availableDate.getFullYear() === date.getFullYear()
                        );
                      }}
                      className="border rounded-md"
                    />
                  </div>
                  {date && (
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {format(date, "EEEE, MMMM d, yyyy")}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="participants">Number of Participants:</Label>
                  <Select value={participants} onValueChange={setParticipants}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select participants" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "participant" : "participants"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <div>Price per person</div>
                    <div>${price}</div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div>Participants</div>
                    <div>x {participants}</div>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <div>Total</div>
                    <div>${price * parseInt(participants)}</div>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!date || bookingLoading}
                  className="w-full bg-green-600 hover:bg-green-700 mt-4"
                >
                  {bookingLoading ? "Submitting..." : "Book Now"}
                </Button>

                {!date && (
                  <div className="text-sm text-red-500 text-center">
                    Please select a date to continue
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="text-sm text-gray-500 text-center">
                    Log in or create an account to track your booking history.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your experience</DialogTitle>
            <DialogDescription>
              Reviews are available after you complete a booking for this
              experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {eligibleBookings.length === 0 && (
              <p className="text-sm text-red-500">
                You need a completed booking before you can leave a review.
              </p>
            )}
            {eligibleBookings.length > 1 && (
              <div className="space-y-2">
                <Label>Select booking</Label>
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
                          ? new Date(booking.start_date).toLocaleDateString()
                          : booking.id}
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
                    <SelectItem key={value} value={value.toString()}>
                      {value} {value === 1 ? "star" : "stars"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                placeholder="How was your experience?"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmitReview}
              disabled={!eligibleBookings.length || !selectedBooking}
            >
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityDetail;
