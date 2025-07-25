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
        // Try to refresh the admin token
        await api.post('/admin/refresh-token');
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

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  logoutAll: () => api.post('/admin/logout-all'),
  refreshToken: () => api.post('/admin/refresh-token'),
  getCurrentAdmin: () => api.get('/admin/me'),
};

// Dashboard API
export const dashboardAPI = {
  getAnalytics: (period = '30d') => api.get(`/admin/dashboard?period=${period}`),
  getSystemStats: () => api.get('/admin/system-stats'),
};

// Customer Management API
export const customersAPI = {
  getAllCustomers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/customers?${queryString}`);
  },
  getCustomer: (customerId) => api.get(`/admin/customers/${customerId}`),
  updateCustomerStatus: (customerId, status) => 
    api.patch(`/admin/customers/${customerId}/status`, { status }),
  searchCustomers: (query) => 
    api.get(`/admin/customers?search=${encodeURIComponent(query)}`),
};

// Product Management API
export const productsAPI = {
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products?${queryString}`);
  },
  getProduct: (productId) => api.get(`/products/${productId}`),
  createProduct: (productData) => {
    const formData = new FormData();
    
    // Append regular fields
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle file uploads
        if (productData.images && productData.images.length > 0) {
          Array.from(productData.images).forEach(file => {
            formData.append('images', file);
          });
        }
      } else if (Array.isArray(productData[key])) {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct: (productId, productData) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        if (productData.images && productData.images.length > 0) {
          Array.from(productData.images).forEach(file => {
            formData.append('images', file);
          });
        }
      } else if (Array.isArray(productData[key])) {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    return api.patch(`/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  getCategories: () => api.get('/products/categories'),
};

// Order Management API
export const ordersAPI = {
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/orders?${queryString}`);
  },
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, statusData) => 
    api.patch(`/orders/${orderId}/status`, statusData),
  getOrderAnalytics: (period = '30d') => 
    api.get(`/orders/analytics/overview?period=${period}`),
  searchOrders: (query) => 
    api.get(`/orders?search=${encodeURIComponent(query)}`),
};

// Campaign Management API
export const campaignsAPI = {
  getAllCampaigns: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/campaigns?${queryString}`);
  },
  getCampaign: (campaignId) => api.get(`/admin/campaigns/${campaignId}`),
  createCampaign: (campaignData) => api.post('/admin/campaigns', campaignData),
  updateCampaign: (campaignId, campaignData) => 
    api.patch(`/admin/campaigns/${campaignId}`, campaignData),
  sendCampaign: (campaignId) => api.post(`/admin/campaigns/${campaignId}/send`),
  deleteCampaign: (campaignId) => api.delete(`/admin/campaigns/${campaignId}`),
  
  // Templates
  getCampaignTemplates: () => api.get('/admin/campaigns/templates'),
  createTemplate: (templateData) => api.post('/admin/campaigns/templates', templateData),
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: (period = '30d') => api.get(`/admin/dashboard?period=${period}`),
  getRevenueAnalytics: (period = '30d') => 
    api.get(`/admin/analytics/revenue?period=${period}`),
  getCustomerAnalytics: (period = '30d') => 
    api.get(`/admin/analytics/customers?period=${period}`),
  getProductAnalytics: (period = '30d') => 
    api.get(`/admin/analytics/products?period=${period}`),
  getOrderAnalytics: (period = '30d') => 
    api.get(`/orders/analytics/overview?period=${period}`),
};

// Inventory Management API
export const inventoryAPI = {
  updateStock: (productId, stockData) => 
    api.patch(`/products/${productId}/stock`, stockData),
  getLowStockProducts: () => api.get('/products?stock=low'),
  getOutOfStockProducts: () => api.get('/products?stock=out'),
  bulkUpdateStock: (updates) => api.patch('/products/bulk-stock', { updates }),
};

// File Upload API
export const uploadAPI = {
  uploadImages: (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (imageUrl) => api.delete('/upload/images', { data: { imageUrl } }),
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Customize error handling based on your needs
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

// Loading state management utility
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

// Toast notification helper
export const showNotification = (message, type = 'info') => {
  // You can integrate with your notification system here
  console.log(`${type.toUpperCase()}: ${message}`);
};

export default api; 