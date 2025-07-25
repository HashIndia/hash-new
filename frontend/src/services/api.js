import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Create a standardized error object
    const standardError = {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(standardError);
  }
);

// Auth API
export const authAPI = {
  // User Authentication
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
  resendOTP: (phone) => api.post('/auth/resend-otp', { phone }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  changePassword: (passwordData) => api.patch('/auth/change-password', passwordData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.patch('/auth/update-profile', userData),

  // Address Management
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.patch(`/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.patch(`/auth/addresses/${addressId}/default`),

  // Wishlist Management
  getWishlist: () => api.get('/auth/wishlist'),
  addToWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/auth/wishlist/${productId}`),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products?${queryString}`);
  },
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getCategories: () => api.get('/products/categories'),
  addReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/orders/my-orders?${queryString}`);
  },
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.patch(`/orders/${orderId}/cancel`),
  verifyDeliveryOTP: (orderId, otp) => api.post(`/orders/${orderId}/verify-delivery`, { otp }),
};

// Cart API (if needed for server-side cart management)
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.patch(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (orderData) => api.post('/payments/create-intent', orderData),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // You can customize error handling based on your needs
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  } else if (error.status === 404) {
    return 'Resource not found.';
  } else if (error.status === 403) {
    return 'You are not authorized to perform this action.';
  } else if (error.status === 400) {
    return error.message || 'Invalid request.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Loading state management
export const createLoadingState = () => {
  let isLoading = false;
  let loadingPromise = null;
  
  return {
    isLoading: () => isLoading,
    wrap: async (apiCall) => {
      if (isLoading) {
        return loadingPromise;
      }
      
      isLoading = true;
      loadingPromise = apiCall();
      
      try {
        const result = await loadingPromise;
        return result;
      } finally {
        isLoading = false;
        loadingPromise = null;
      }
    },
  };
};

export default api; 