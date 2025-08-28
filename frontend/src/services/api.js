import axios from 'axios';
import useUserStore from '../stores/useUserStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Essential for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1; // Reduced to 1 to prevent loops

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

// Add request interceptor to log cookies
api.interceptors.request.use(
  (config) => {
    // Only log important requests to reduce console spam
    if (config.url?.includes('/login') || config.url?.includes('/register')) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
      console.log('[API Request] withCredentials:', config.withCredentials);
      console.log('[API Request] Current cookies:', document.cookie);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Reset refresh attempts on successful requests
    if (error.response?.status !== 401) {
      refreshAttempts = 0;
    }

    // Only try to refresh on 401 errors that aren't already retries
    if (error.response?.status === 401 && !originalRequest._retry && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
      
      // Never try to refresh these endpoints
      const noRefreshEndpoints = ['/auth/refresh-token', '/auth/login', '/auth/register', '/auth/verify-otp'];
      const shouldSkipRefresh = noRefreshEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
      
      if (shouldSkipRefresh) {
        console.log('[API] Auth endpoint failed, not attempting refresh');
        refreshAttempts = 0;
        useUserStore.getState().logout();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      refreshAttempts++;

      try {
        console.log(`[API] Attempting token refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})...`);
        await api.post('/auth/refresh-token');
        console.log('[API] Token refresh successful');
        refreshAttempts = 0;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        console.log('[API] Token refresh failed:', refreshError);
        refreshAttempts = 0;
        processQueue(refreshError, null);
        useUserStore.getState().logout();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If we've hit the refresh limit, logout immediately
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.log('[API] Max refresh attempts exceeded, logging out');
      refreshAttempts = 0;
      useUserStore.getState().logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
  resendOTP: (registrationToken) => api.post('/auth/resend-otp', { registrationToken }),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.patch(`/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),
  getWishlist: () => api.get('/auth/wishlist'),
  addToWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/auth/wishlist/${productId}`),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/products/categories'),
};

export const ordersAPI = {
  getUserOrders: (params = {}) => api.get('/orders', { params }),
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
};

export const paymentsAPI = {
  createPaymentOrder: (orderData) => api.post('/payments/create-order', orderData),
  verifyPayment: (orderId) => api.get(`/payments/verify/${orderId}`),
};

export const handleAPIError = (error, defaultMessage = 'An unexpected error occurred.') => {
  console.error('API Error:', error);
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

export default api;