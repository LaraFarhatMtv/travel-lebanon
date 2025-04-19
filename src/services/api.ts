/**
 * API Service for backend communication
 * This service provides methods for authentication, data fetching, and other backend operations
 */

// Base URL for API calls - would point to your actual API in production
const API_BASE_URL = 'http://localhost:8055';

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      // In a real implementation, this would be a fetch call to your authentication endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData: any) => {
    try {
      var dataToSend = {
        email: userData?.email,
        password: userData?.password,
        role: "c672a94c-5121-49d2-af2a-82e91075206a",
        first_name: userData?.firstName,
        last_name: userData?.lastName,
      }
      // In a real implementation, this would be a fetch call to your registration endpoint
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return response; 
     
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // In a real implementation, this would be a fetch call to your logout endpoint
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

// User profile API calls
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      // In a real implementation, this would fetch the user's profile
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication token from storage
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};
export const directusAPI = {
  // Get user profile
  getCategories: async () => {
    try {
      // In a real implementation, this would fetch the user's profile
      const response = await fetch(`${API_BASE_URL}/items/Category?fields=id,title`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication token from storage
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  getsubCategories: async (id) => {
    try {
      // In a real implementation, this would fetch the user's profile
      const response = await fetch(`${API_BASE_URL}/items/SubCategory?filter[categoryId][_eq]=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  getItems: async (subcategoryId = null, categoryId = null) => {
    let url = `${API_BASE_URL}/items/Items?fields=*,subcategoryId.*,subcategoryId.categoryId.*`;

    if (subcategoryId) {
      url += `&filter[subcategoryId][_eq]=${subcategoryId}`;
    } else if (categoryId) {
      url += `&filter[subcategoryId.categoryId][_eq]=${categoryId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Directus error response:', error);
      throw new Error('Failed to fetch items');
    }

    return await response.json();
  }
};
// Booking API calls
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },
};

// Payment API calls
export const paymentAPI = {
  // Process payment
  processPayment: async (paymentData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  },
};

// Review API calls
export const reviewAPI = {
  // Submit a review
  submitReview: async (reviewData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit review error:', error);
      throw error;
    }
  },

  // Get reviews for an activity
  getActivityReviews: async (activityId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  booking: bookingAPI,
  payment: paymentAPI,
  review: reviewAPI,
};
