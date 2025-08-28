import axios from 'axios';

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple response interceptor - NO automatic token refresh
adminApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.log('[Admin API Error]', error.response?.status, error.config?.url);
    
    // For 401 errors, just redirect to login - don't try to refresh
    if (error.response?.status === 401) {
      console.log('[Admin API] 401 error, redirecting to login');
      localStorage.removeItem('admin-auth');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => adminApi.post('/admin/auth/login', credentials),
  logout: () => adminApi.post('/admin/auth/logout'),
  getCurrentAdmin: () => adminApi.get('/admin/auth/me'),
};

// Products API for admin
export const productsAPI = {
  getProducts: (params) => adminApi.get('/admin/products', { params }),
  getProduct: (id) => adminApi.get(`/admin/products/${id}`),
  createProduct: (productData) => adminApi.post('/admin/products', productData),
  updateProduct: (id, productData) => adminApi.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => adminApi.delete(`/admin/products/${id}`),
};

// Orders API for admin
export const ordersAPI = {
  getOrders: (params) => adminApi.get('/admin/orders', { params }),
  getOrder: (id) => adminApi.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, statusData) => adminApi.patch(`/admin/orders/${id}/status`, statusData),
  generateOTP: (orderId) => adminApi.post(`/admin/orders/${orderId}/generate-otp`),
  verifyOTP: (orderId, otp) => adminApi.post(`/admin/orders/${orderId}/verify-otp`, { otp }),
};

export const inventoryAPI = {
  getLowStock: () => adminApi.get('/admin/products/inventory/low-stock'),
  getOutOfStock: () => adminApi.get('/admin/products/inventory/out-of-stock'),
  updateStock: (id, stockData) => adminApi.patch(`/admin/products/${id}/stock`, stockData),
  bulkUpdateStock: (updates) => adminApi.patch('/admin/products/bulk-stock', { updates }),
};

export const customersAPI = {
  getAllCustomers: (params) => adminApi.get('/admin/customers', { params }),
  getCustomers: (params) => adminApi.get('/admin/customers', { params }),
  getCustomer: (id) => adminApi.get(`/admin/customers/${id}`),
  updateCustomer: (id, customerData) => adminApi.put(`/admin/customers/${id}`, customerData),
  updateCustomerStatus: (id, status) => adminApi.patch(`/admin/customers/${id}/status`, { status }),
};

export const campaignsAPI = {
  getCampaigns: (params) => adminApi.get('/admin/campaigns', { params }),
  getCampaign: (id) => adminApi.get(`/admin/campaigns/${id}`),
  createCampaign: (campaignData) => adminApi.post('/admin/campaigns', campaignData),
  updateCampaign: (id, campaignData) => adminApi.put(`/admin/campaigns/${id}`, campaignData),
  deleteCampaign: (id) => adminApi.delete(`/admin/campaigns/${id}`),
  sendCampaign: (id) => adminApi.post(`/admin/campaigns/${id}/send`),
};

// Analytics API for admin
export const analyticsAPI = {
  getDashboardStats: () => adminApi.get('/admin/analytics/dashboard'),
  getRevenueAnalytics: (params) => adminApi.get('/admin/analytics/revenue', { params }),
  getCustomerAnalytics: (params) => adminApi.get('/admin/analytics/customers', { params }),
  getProductAnalytics: (params) => adminApi.get('/admin/analytics/products', { params }),
  getSalesData: (params) => adminApi.get('/admin/analytics/revenue', { params }),
};

// Error handling utility
export const handleAPIError = (error, defaultMessage = 'An unexpected error occurred.') => {
  console.error('API Error:', error);
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

export default adminApi;