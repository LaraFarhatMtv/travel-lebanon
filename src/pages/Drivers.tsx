import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { directusAPI } from "@/services/api";
import type { DriverProfile, DriverReview } from "@/types/directus";
import {
  MapPin,
  Search,
  Car,
  Star,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";

const normalizeArray = (value: DriverProfile["languages"]) => {
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

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);
  const {
    data: driversResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => directusAPI.getDrivers(),
  });

  const drivers = useMemo(() => {
    if (!driversResponse) return [];
    return driversResponse.map((driver) => {
      const specialties = normalizeArray(driver.specialties);
      const languages = normalizeArray(driver.languages);
      const reviews = (driver.reviews as DriverReview[]) || [];
      const computedRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
                reviews.length
              ).toFixed(2)
            )
          : null;

      return {
        ...driver,
        specialties,
        languages,
        reviews,
        rating: driver.rating ?? computedRating,
      };
    });
  }, [driversResponse]);

  const filteredDrivers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return drivers.filter((driver) => {
      const nameMatch = driver.name?.toLowerCase().includes(term);
      const locationMatch = driver.location?.toLowerCase().includes(term);
      const specialties = driver.specialties || [];
      const specialtyMatch = specialties.some((specialty) =>
        specialty.toLowerCase().includes(term)
      );

      const matchesSearch = term
        ? nameMatch || locationMatch || specialtyMatch
        : true;

      if (!matchesSearch) return false;
      if (currentTab === "all") return true;

      return specialties.some((specialty) =>
        specialty.toLowerCase().includes(currentTab.toLowerCase())
      );
    });
  }, [drivers, searchTerm, currentTab]);

  const toggleDriverDetails = (id: number) => {
    setExpandedDriver(expandedDriver === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-700 to-red-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Licensed Tour Drivers
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Find professional drivers to take you on your custom tour around
            Lebanon
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, location, or specialty..."
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 focus-visible:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Tabs
          defaultValue="all"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          {/* <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="city">City Tours</TabsTrigger>
            <TabsTrigger value="mountain">Mountain</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="off-road">Off-road</TabsTrigger>
            <TabsTrigger value="coast">Coastal</TabsTrigger>
          </TabsList> */}
        </Tabs>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading drivers from Directus...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Can't load drivers
          </h3>
          <p className="text-gray-500 mb-6">
            Please ensure Directus is running and try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : filteredDrivers.length > 0 ? (
        <div className="space-y-6">
          {filteredDrivers.map((driver) => (
            <Card
              key={driver.id}
              className={expandedDriver === driver.id ? "border-red-300" : ""}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <div className="h-full p-6 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img
                        src={driver.image}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{driver.name}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>
                          {driver.rating ?? "No rating yet"}
                          {driver.reviewCount !== undefined &&
                            ` · ${driver.reviewCount} reviews`}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {driver.years_experience
                          ? `${driver.years_experience} years experience`
                          : "Experienced local guide"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Car className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Vehicle</div>
                        <div className="text-gray-700">
                          {driver.vehicle || "Comfortable touring vehicle"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-700">
                          {driver.location || "Lebanon"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {(driver.specialties || []).map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-red-50 text-red-800"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Languages</div>
                      <div className="text-gray-700">
                        {(driver.languages || []).length
                          ? driver.languages.join(", ")
                          : "English, Arabic"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div
                        className={`font-medium ${
                          driver.availability === "Available"
                            ? "text-green-600"
                            : driver.availability === "Limited Availability"
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        {driver.availability}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span className="font-medium">{driver.phone}</span>
                    </div>

                    <Button
                      className="w-full mb-3 bg-red-600 hover:bg-red-700"
                      onClick={() =>
                        (window.location.href = `tel:${driver.phone.replace(
                          /\s/g,
                          ""
                        )}`)
                      }
                    >
                      Call Now
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleDriverDetails(driver.id)}
                    >
                      {expandedDriver === driver.id
                        ? "Hide Details"
                        : "Show Details"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedDriver === driver.id && (
                <CardFooter className="block border-t p-6">
                  <div className="mb-4 space-y-3">
                    <h4 className="font-semibold text-lg">Reviews</h4>
                    {driver.reviews && driver.reviews.length > 0 ? (
                      driver.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b last:border-0 py-3"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {[review.user?.first_name, review.user?.last_name]
                                .filter(Boolean)
                                .join(" ") || "Traveler"}
                            </span>
                            <div className="flex">
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
                          </div>
                          <p className="text-gray-700 mt-1">
                            {review.message && review.message.trim()
                              ? review.message
                              : "No comment provided."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No reviews yet. Be the first to leave feedback after
                        your custom tour.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/custom-tours?driver=${driver.id}`)
                      }
                    >
                      Book Custom Tour
                    </Button>
                    {/* <Button
                      variant="default"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Request Day Rate
                    </Button> */}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No drivers found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or search term
          </p>
          {/* <Button
            onClick={() => {
              setSearchTerm("");
              setCurrentTab("all");
            }}
          >
            Clear filters
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default Drivers;
