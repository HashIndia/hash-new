import { create } from 'zustand';
import { customersAPI, handleAPIError } from '../services/api.js';

const useCustomerStore = create((set, get) => ({
  // State
  customers: [],
  selectedCustomer: null,
  filters: {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    order: 'desc'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  // Customer Management Actions
  loadCustomers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };

      const response = await customersAPI.getAllCustomers(queryParams);
      
      set({
        customers: response.data.customers,
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

  loadCustomer: async (customerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customersAPI.getCustomer(customerId);
      set({ 
        selectedCustomer: response.data.customer, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateCustomerStatus: async (customerId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customersAPI.updateCustomerStatus(customerId, status);
      const updatedCustomer = response.data.customer;
      
      set(state => ({
        customers: state.customers.map(customer =>
          customer._id === customerId ? updatedCustomer : customer
        ),
        selectedCustomer: state.selectedCustomer?._id === customerId ? updatedCustomer : state.selectedCustomer,
        isLoading: false
      }));
      
      return { success: true, data: updatedCustomer };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Filter and Search Actions
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
    
    // Automatically reload customers with new filters
    get().loadCustomers();
  },

  clearFilters: () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      sortBy: 'createdAt',
      order: 'desc'
    };
    
    set({ 
      filters: defaultFilters,
      pagination: { ...get().pagination, page: 1 }
    });
    
    get().loadCustomers();
  },

  searchCustomers: (searchTerm) => {
    set(state => ({
      filters: { ...state.filters, search: searchTerm },
      pagination: { ...state.pagination, page: 1 }
    }));
    
    get().loadCustomers();
  },

  // Pagination Actions
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
    get().loadCustomers();
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
  getCustomerById: (customerId) => {
    const { customers } = get();
    return customers.find(customer => customer._id === customerId);
  },

  getCustomersByStatus: (status) => {
    const { customers } = get();
    if (status === 'all') return customers;
    
    if (status === 'verified') {
      return customers.filter(customer => customer.phoneVerified);
    } else if (status === 'unverified') {
      return customers.filter(customer => !customer.phoneVerified);
    }
    
    return customers.filter(customer => customer.status === status);
  },

  getCustomersCount: () => {
    const { customers } = get();
    return {
      total: customers.length,
      verified: customers.filter(customer => customer.phoneVerified).length,
      unverified: customers.filter(customer => !customer.phoneVerified).length,
      active: customers.filter(customer => customer.status === 'active').length,
      inactive: customers.filter(customer => customer.status === 'inactive').length,
    };
  },

  getTopCustomers: (limit = 5) => {
    const { customers } = get();
    return customers
      .filter(customer => customer.orderStats)
      .sort((a, b) => (b.orderStats.totalSpent || 0) - (a.orderStats.totalSpent || 0))
      .slice(0, limit);
  },

  getRecentCustomers: (limit = 5) => {
    const { customers } = get();
    return customers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // Clear actions
  clearSelectedCustomer: () => set({ selectedCustomer: null }),
  clearError: () => set({ error: null }),
}));

export default useCustomerStore; 