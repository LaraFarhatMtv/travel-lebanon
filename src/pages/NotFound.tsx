
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle size={64} className="text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">Explore Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
