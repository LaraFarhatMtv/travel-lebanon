
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name: string;
  role: 'tourist' | 'activity_provider' | 'admin';
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
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
});

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // For demo purposes, we'll simulate fetching user data
          // In a real app, you'd validate the token with your backend
          try {
            // Normally you'd make an API call here
            setUser({
              id: '12345',
              email: 'demo@example.com',
              name: 'Demo User',
              role: 'tourist',
            });
          } catch (error) {
            console.error('Error validating token:', error);
            localStorage.removeItem('authToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
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
      // In a real app, this would be an API call that returns the user and a token
      // const { user, token } = await authAPI.login(email, password);

      // For demo purposes
      if (email && password) {
        // Simulate successful login

        const response = await authAPI.login(email, password)
        if (response) {
          console.log("response data user", response?.data)
          localStorage.setItem('authToken', response?.data?.access_token);

          const mockUser = {
            id: '12345',
            email: email,
            name: email.split('@')[0],
            role: 'tourist' as const,
          }

          setUser(mockUser);
          toast.success('Successfully logged in!');
          navigate('/');
        }





      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const { user, token } = await authAPI.register(userData);

      // For demo purposes
      if (userData.email && userData.password) {
        // Simulate successful registration

        // const mockUser = {
        //   id: '12345',
        //   email: userData.email,
        //   name: userData.firstName + ' ' + userData.lastName,
        //   role: 'tourist' as const,
        // };

        // localStorage.setItem('authToken', 'mock-jwt-token');
        // setUser(mockUser);
        // toast.success('Registration successful!');
        // navigate('/');
        const response = await authAPI.register(userData)
        if (response) {

          await login(userData.email,userData.password);
          
          //   console.log("register", response)
          //   localStorage.setItem('authToken', response?.data?.access_token);

          //   const mockUser = {
          //     id: '12345',
          //     email:userData?.email,
          //     name: userData?.email.split('@')[0],
          //     role: 'tourist' as const,
          //   }

          //   setUser(mockUser);
          //   toast.success('Successfully logged in!');
          //   navigate('/');
        }

      } else {
        throw new Error('Required fields missing');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      // In a real app, you'd call your API to invalidate the token
      // await authAPI.logout();

      // Clear local storage and state
      localStorage.removeItem('authToken');
      setUser(null);
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
