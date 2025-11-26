import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Mountain, Car, Hotel, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595571024048-45a59fc7ed76?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-20 px-6 md:px-12 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Lebanon
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the beauty, history, and culture of Lebanon with our
            comprehensive tourism platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Link to="/custom-tours">Start Exploring</Link>
            </Button>
            {!isAuthenticated && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                <Link to="/signup">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Plan Your Perfect Lebanese Adventure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dining */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-blue-50 p-3 rounded-full w-fit mb-4">
              <Utensils className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Local Cuisine</h3>
            <p className="text-gray-600 mb-4">
              Discover authentic Lebanese restaurants near you, browse menus,
              and get contact information.
            </p>
            <Link
              to="/restaurants?id=3"
              className="text-blue-600 font-medium hover:underline"
            >
              Find Restaurants →
            </Link>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-green-50 p-3 rounded-full w-fit mb-4">
              <Mountain className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Exciting Activities</h3>
            <p className="text-gray-600 mb-4">
              Book hiking, camping, paragliding and more seasonal activities
              throughout Lebanon.
            </p>
            <Link
              to="/activities?id=4"
              className="text-green-600 font-medium hover:underline"
            >
              Browse Activities →
            </Link>
          </div>

          {/* Custom Tours */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-purple-50 p-3 rounded-full w-fit mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Tours</h3>
            <p className="text-gray-600 mb-4">
              Create your own personalized tour and connect with local drivers
              to explore Lebanon.
            </p>
            <Link
              to="/custom-tours"
              className="text-purple-600 font-medium hover:underline"
            >
              Customize Tour →
            </Link>
          </div>

          {/* Accommodations */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-amber-50 p-3 rounded-full w-fit mb-4">
              <Hotel className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Rest Houses & Resorts
            </h3>
            <p className="text-gray-600 mb-4">
              Find and book comfortable accommodations and beach resorts
              throughout Lebanon.
            </p>
            <Link
              to="/accommodations?id=5"
              className="text-amber-600 font-medium hover:underline"
            >
              Find Accommodations →
            </Link>
          </div>

          {/* Transportation */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-red-50 p-3 rounded-full w-fit mb-4">
              <Car className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Transportation</h3>
            <p className="text-gray-600 mb-4">
              Connect with reliable drivers to take you on your custom tours and
              adventures.
            </p>
            <Link
              to="/drivers"
              className="text-red-600 font-medium hover:underline"
            >
              Find Drivers →
            </Link>
          </div>

          {/* Seasonal Events */}
          {/* <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-teal-50 p-3 rounded-full w-fit mb-4">
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Seasonal Events</h3>
            <p className="text-gray-600 mb-4">
              Stay updated on current seasonal activities and events happening
              throughout Lebanon.
            </p>
            <Link
              to="/seasonal"
              className="text-teal-600 font-medium hover:underline"
            >
              View Events →
            </Link>
          </div> */}
        </div>
      </section>

      {/* Popular Destinations
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Beirut', 'Byblos', 'Baalbek', 'Kadisha Valley', 'Jeita Grotto', 'Tyre'].map((destination) => (
            <div key={destination} className="group relative h-64 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all z-10"></div>
              <img 
                src={`https://source.unsplash.com/featured/?lebanon,${destination.toLowerCase()}`} 
                alt={destination} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                <h3 className="text-2xl font-bold mb-2">{destination}</h3>
                <Link to={`/destination/${destination.toLowerCase().replace(' ', '-')}`} className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex hover:bg-white/30 transition-colors">
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Experience Lebanon?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create an account today to start planning your perfect Lebanese
          adventure, from customized tours to exciting activities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-indigo-700 hover:bg-gray-100"
          >
            <Link to="/signup">Sign Up Now</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white/20"
          >
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </section> */}
    </div>
  );
};

export default Index;
