
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Restaurants from "./pages/Restaurants";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import CustomTours from "./pages/CustomTours";
import Accommodations from "./pages/Accommodations";
import AccommodationDetail from "./pages/AccommodationDetail";
import Drivers from "./pages/Drivers";
import UserProfile from "./pages/UserProfile";
import RestaurantDetail from "./pages/RestaurantDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // If we're still checking the authentication state, show nothing
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// App component with Routes wrapped in AuthProvider
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    
    {/* Protected Routes */}
    <Route path="/restaurants" element={
      <ProtectedRoute>
        <Restaurants />
      </ProtectedRoute>
    } />
    <Route path="/restaurants/detail/:id" element={
      <ProtectedRoute>
        <RestaurantDetail />
      </ProtectedRoute>
    } />
    <Route path="/activities" element={
      <ProtectedRoute>
        <Activities />
      </ProtectedRoute>
    } />
    <Route path="/activities/:activityType" element={
      <ProtectedRoute>
        <Activities />
      </ProtectedRoute>
    } />
    <Route path="/activities/detail/:id" element={
      <ProtectedRoute>
        <ActivityDetail />
      </ProtectedRoute>
    } />
    <Route path="/custom-tours" element={
      <ProtectedRoute>
        <CustomTours />
      </ProtectedRoute>
    } />
    <Route path="/accommodations" element={
      <ProtectedRoute>
        <Accommodations />
      </ProtectedRoute>
    } />
    <Route path="/accommodations/:id" element={
      <ProtectedRoute>
        <AccommodationDetail />
      </ProtectedRoute>
    } />
    <Route path="/drivers" element={
      <ProtectedRoute>
        <Drivers />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
