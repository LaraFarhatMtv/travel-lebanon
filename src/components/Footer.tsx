import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-amber-500" />
              <span className="text-xl font-bold">Lebanon Tours</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your gateway to authentic Lebanese experiences. Discover the
              beauty of Lebanon with our comprehensive tourism platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants?id=3"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/activities?id=4"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-tours"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Custom Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/accommodations?id=5"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Accommodations
                </Link>
              </li>
              <li>
                <Link
                  to="/drivers"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Travel Guide</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Safety Tips</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Seasonal Events</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Partner With Us</a>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-500" />
                <span className="text-gray-400">
                  123 Tourism Street, Beirut, Lebanon
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-500" />
                <span className="text-gray-400">+961 1 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-500" />
                <a
                  href="mailto:info@lebanontours.com"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  info@lebanontours.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-gray-500">
                &copy; {currentYear} Lebanon Tours. All rights reserved.
              </p>
            </div>
            {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-amber-500 transition-colors">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-amber-500 transition-colors">
                Terms of Service
              </a>
              <span>|</span>
              <a href="#" className="hover:text-amber-500 transition-colors">
                Cookie Policy
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
