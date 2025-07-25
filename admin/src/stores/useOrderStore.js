import { create } from 'zustand';
import { ordersAPI, handleAPIError } from '../services/api.js';

const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  selectedOrder: null,
  filters: {
    status: 'all',
    paymentStatus: 'all',
    search: '',
    startDate: '',
    endDate: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  analytics: {
    summary: null,
    dailyStats: []
  },
  isLoading: false,
  error: null,

  // Order Management Actions
  loadOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };

      const response = await ordersAPI.getAllOrders(queryParams);
      
      set({
        orders: response.data.orders,
        pagination: {
          page: response.page,
          limit: response.limit || 10,
          total: response.total,
          totalPages: response.totalPages
        },
        isLoading: false
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  loadOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getOrder(orderId);
      set({ 
        selectedOrder: response.data.order, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, statusData);
      const updatedOrder = response.data.order;
      
      set(state => ({
        orders: state.orders.map(order =>
          order._id === orderId ? updatedOrder : order
        ),
        selectedOrder: state.selectedOrder?._id === orderId ? updatedOrder : state.selectedOrder,
        isLoading: false
      }));
      
      return { success: true, data: updatedOrder };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Analytics Actions
  loadOrderAnalytics: async (period = '30d') => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getOrderAnalytics(period);
      
      set({
        analytics: {
          summary: response.data.summary,
          dailyStats: response.data.dailyStats
        },
        isLoading: false
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Filter and Search Actions
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
    
    // Automatically reload orders with new filters
    get().loadOrders();
  },

  clearFilters: () => {
    const defaultFilters = {
      status: 'all',
      paymentStatus: 'all',
      search: '',
      startDate: '',
      endDate: ''
    };
    
    set({ 
      filters: defaultFilters,
      pagination: { ...get().pagination, page: 1 }
    });
    
    get().loadOrders();
  },

  searchOrders: (searchTerm) => {
    set(state => ({
      filters: { ...state.filters, search: searchTerm },
      pagination: { ...state.pagination, page: 1 }
    }));
    
    get().loadOrders();
  },

  // Pagination Actions
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
    get().loadOrders();
  },

  nextPage: () => {
    const { pagination } = get();
    if (pagination.page < pagination.totalPages) {
      get().setPage(pagination.page + 1);
    }
  },

  prevPage: () => {
    const { pagination } = get();
    if (pagination.page > 1) {
      get().setPage(pagination.page - 1);
    }
  },

  // Utility Actions
  getOrderById: (orderId) => {
    const { orders } = get();
    return orders.find(order => order._id === orderId);
  },

  getOrdersByStatus: (status) => {
    const { orders } = get();
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  },

  getOrdersCount: () => {
    const { orders } = get();
    return {
      total: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      processing: orders.filter(order => order.status === 'processing').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    };
  },

  getTotalRevenue: () => {
    const { orders } = get();
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.total, 0);
  },

  getRecentOrders: (limit = 5) => {
    const { orders } = get();
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // Clear actions
  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));

export default useOrderStore; 