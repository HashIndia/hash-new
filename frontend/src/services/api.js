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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Handle 401 errors - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        await api.post('/auth/refresh-token');
        processQueue(null);
        isRefreshing = false;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh failed - redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, create a standardized error object
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
  logoutAll: () => api.post('/auth/logout-all'),
  refreshToken: () => api.post('/auth/refresh-token'),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
  resendOTP: (phone) => api.post('/auth/resend-otp', { phone }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, passwordData) => api.patch(`/auth/reset-password/${token}`, passwordData),
  updatePassword: (passwordData) => api.patch('/auth/update-password', passwordData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.patch('/auth/update-me', userData),

  // Address Management
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.patch(`/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),

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