import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "sonner";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

const mapUser = (profile: any): User => {
  if (!profile) {
    throw new Error("Invalid profile payload");
  }
  const nameFromProfile = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    name: nameFromProfile.length ? nameFromProfile : profile.email,
    role: profile.role?.name ?? profile.role ?? "tourist",
  };
};

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const profile = await authAPI.getCurrentUser();
      if (profile?.data) {
        setUser(mapUser(profile.data));
      } else if (profile) {
        setUser(mapUser(profile));
      }
    } catch (err) {
      console.error("Unable to refresh user", err);
      localStorage.removeItem("authToken");
      setUser(null);
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await refreshUser();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await authAPI.login(email, password);
      if (response?.data?.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        await refreshUser();
        toast.success("Successfully logged in!");
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      if (!userData.email || !userData.password) {
        throw new Error("Required fields missing");
      }
      await authAPI.register(userData);
      await login(userData.email, userData.password);
      toast.success("Registration successful!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      try {
        await authAPI.logout();
      } catch (err) {
        console.warn("Logout request failed, clearing session anyway", err);
      }

      localStorage.removeItem("authToken");
      setUser(null);
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
