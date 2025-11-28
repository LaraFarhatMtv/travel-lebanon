import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { directusAPI } from "@/services/api";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [data, setData] = useState([]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const getcategories = async () => {
      try {
        const response = await directusAPI.getCategories();
        if (response) {
          console.log(response.data);
          setData(response.data);
        }
      } catch (e) {
        console.log("error fetch categories", e);
      }
    };
    getcategories();
  }, []);

  const primaryLinks = [
    { label: "Home", to: "/" },
    { label: "Restaurants", to: "/restaurants?id=3" },
    { label: "Activities", to: "/activities?id=4" },
    { label: "Accommodations", to: "/accommodations?id=5" },
    { label: "Custom Tours", to: "/custom-tours" },
    { label: "Drivers", to: "/drivers" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <MapPin className="h-6 w-6 text-amber-600 mr-2" />
          <span className="font-bold text-xl">TravelLebanon</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-amber-50"
            >
              {link.label}
            </Link>
          ))}
          {data &&
            data.length > 0 &&
            data
              .filter(
                (item) =>
                  !primaryLinks.some(
                    (link) =>
                      link.label.toLowerCase() === item.title?.toLowerCase()
                  )
              )
              .map((item) => (
                <Link
                  key={`category-${item.id}`}
                  to={`/${item.title}?id=${item.id}`}
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-amber-50"
                >
                  {item.title}
                </Link>
              ))}
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-amber-50 transition"
              >
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-700" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-3 space-y-2">
          {primaryLinks.map((link) => (
            <Link
              key={`mobile-${link.to}`}
              to={link.to}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {data &&
            data.length > 0 &&
            data
              .filter(
                (item) =>
                  !primaryLinks.some(
                    (link) =>
                      link.label.toLowerCase() === item.title?.toLowerCase()
                  )
              )
              .map((item) => (
                <Link
                  key={`mobile-category-${item.id}`}
                  to={`/${item.title}?id=${item.id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Trips & Profile
            </Link>
          )}
          <div className="border-t pt-3 mt-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-amber-700" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1 w-full mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-amber-600 text-white hover:bg-amber-700 text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
