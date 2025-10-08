
import axios from 'axios';
import useUserStore from '../utils/useUserStore';

// Safari/iOS detection utility
const isSafariOrIOS = () => {
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isMac = /Macintosh/.test(userAgent);
  return isSafari || isIOS || isMac;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000, // Increased timeout for slow networks
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;
let authToken = null;

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

api.interceptors.request.use(
  (config) => {
    if (isSafariOrIOS() && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (isSafariOrIOS() && response.headers['x-auth-token']) {
      authToken = response.headers['x-auth-token'];
      localStorage.setItem('safari_auth_token', authToken);
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      refreshAttempts = 0;
    }

    if (error.response?.status === 401 && !originalRequest._retry && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
      const noRefreshEndpoints = ['/auth/refresh-token', '/auth/login', '/auth/register', '/auth/verify-otp'];
      const shouldSkipRefresh = noRefreshEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

      if (shouldSkipRefresh) {
        refreshAttempts = 0;
        authToken = null;
        localStorage.removeItem('safari_auth_token');
        
        // Only logout and redirect for login/register endpoints, not for initial auth checks
        if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
          useUserStore.getState().logout();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
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
        const refreshResponse = await api.post('/auth/refresh-token');
        refreshAttempts = 0;

        if (isSafariOrIOS() && refreshResponse.headers?.['x-auth-token']) {
          authToken = refreshResponse.headers['x-auth-token'];
          localStorage.setItem('safari_auth_token', authToken);
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        refreshAttempts = 0;
        authToken = null;
        localStorage.removeItem('safari_auth_token');
        processQueue(refreshError, null);
        
        // Only clear state and redirect if we're not on login page and not doing initial auth check
        if (!window.location.pathname.includes('/login') && !originalRequest.url?.includes('/auth/me')) {
          useUserStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      refreshAttempts = 0;
      authToken = null;
      localStorage.removeItem('safari_auth_token');
      
      // Only clear state and redirect if we're not on login page and not doing initial auth check
      if (!window.location.pathname.includes('/login') && !originalRequest.url?.includes('/auth/me')) {
        useUserStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

if (isSafariOrIOS()) {
  const storedToken = localStorage.getItem('safari_auth_token');
  if (storedToken) {
    authToken = storedToken;
  }
}

export const setSafariAuthToken = (token) => {
  if (isSafariOrIOS()) {
    authToken = token;
    localStorage.setItem('safari_auth_token', token);
  }
};

export const clearSafariAuthToken = () => {
  if (isSafariOrIOS()) {
    authToken = null;
    localStorage.removeItem('safari_auth_token');
  }
};

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
  resendOTP: (registrationToken) => api.post('/auth/resend-otp', { registrationToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.patch(`/auth/reset-password/${token}`, { password }),
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
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

export const reviewsAPI = {
  getProductReviews: (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getUserReviews: (params = {}) => api.get('/reviews/user', { params }),
  updateReview: (reviewId, reviewData) => api.patch(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getReviewStats: (productId) => api.get(`/reviews/stats/${productId}`),
};

export const handleAPIError = (error, defaultMessage = 'An unexpected error occurred.') => {
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

export default api;