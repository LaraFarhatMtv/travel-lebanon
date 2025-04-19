
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
      <div className="relative py-16 px-6 md:px-12 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Rest Houses & Beach Resorts</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Find and book the perfect accommodation for your Lebanese adventure
        </p>
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search accommodations by name or location..."
              className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
