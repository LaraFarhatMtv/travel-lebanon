
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface FilterSectionProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  currentTab, 
  setCurrentTab, 
  priceRange, 
  setPriceRange 
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Tabs 
          defaultValue="all" 
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="beach-resort">Beach Resorts</TabsTrigger>
            <TabsTrigger value="mountain-resort">Mountain Resorts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}/night</div>
        <Slider
          defaultValue={[0, 300]}
          max={300}
          step={5}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default FilterSection;
