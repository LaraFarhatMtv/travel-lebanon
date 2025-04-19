
import React from 'react';
import { Bed } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  resetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ resetFilters }) => {
  return (
    <div className="text-center py-16">
      <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-700 mb-2">No accommodations found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
      <Button onClick={resetFilters}>
        Clear filters
      </Button>
    </div>
  );
};

export default EmptyState;
