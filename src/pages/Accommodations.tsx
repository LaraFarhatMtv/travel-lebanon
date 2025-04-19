
import React, { useState } from 'react';
import HeroSection from '@/components/accommodations/HeroSection';
import FilterSection from '@/components/accommodations/FilterSection';
import AccommodationCard from '@/components/accommodations/AccommodationCard';
import EmptyState from '@/components/accommodations/EmptyState';
import { accommodations } from '@/data/accommodations';

const Accommodations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  
  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = currentTab === "all" || accommodation.type === currentTab;
    const matchesPrice = accommodation.pricePerNight >= priceRange[0] && accommodation.pricePerNight <= priceRange[1];
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setCurrentTab("all");
    setPriceRange([0, 300]);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <FilterSection
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      
      {filteredAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map(accommodation => (
            <AccommodationCard 
              key={accommodation.id} 
              accommodation={accommodation} 
            />
          ))}
        </div>
      ) : (
        <EmptyState resetFilters={resetFilters} />
      )}
    </div>
  );
};

export default Accommodations;
