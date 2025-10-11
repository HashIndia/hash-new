import { create } from 'zustand';
import { productsAPI, handleAPIError } from '../services/api.js';

const useProductStore = create((set, get) => ({
  // State
  products: [],
  categories: [],
  currentProduct: null,
  filters: {
    category: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'createdAt',
    order: 'desc'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,
  isInitialized: false,

  // Initialize store
  initialize: async (forceRefresh = false) => {
    const state = get();
    if (state.isInitialized && !forceRefresh) return;

    set({ isInitialized: true });

    // Load categories and products in parallel for faster initialization
    // Don't await - let them load in background
    const promises = [
      get().loadCategories().catch(error => {
        console.warn('Categories loading failed:', error);
      }),
      get().loadProducts().catch(error => {
        console.warn('Products loading failed:', error);
      })
    ];

    // Don't wait for completion, just start the processes
    Promise.allSettled(promises).then(() => {
      console.log('✅ Store initialization completed');
    });
  },

  // Product Actions
  loadProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };

      const response = await productsAPI.getProducts(queryParams);
      
      set({
        products: response.data.products,
        pagination: {
          page: response.page,
          limit: response.limit || 12,
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

  loadProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getProduct(productId);
      set({ 
        currentProduct: response.data.product, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  searchProducts: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.searchProducts(query);
      set({ 
        products: response.data.products, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  loadCategories: async () => {
    try {
      const response = await productsAPI.getCategories();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },

  // Filter Actions
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
    
    // Automatically reload products with new filters
    get().loadProducts();
  },

  clearFilters: () => {
    const defaultFilters = {
      category: 'all',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'createdAt',
      order: 'desc'
    };
    
    set({ 
      filters: defaultFilters,
      pagination: { ...get().pagination, page: 1 }
    });
    
    get().loadProducts();
  },

  // Pagination Actions
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
    get().loadProducts();
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

  // Review Actions
  addReview: async (productId, reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.addReview(productId, reviewData);
      const updatedProduct = response.data.product;
      
      // Update current product if it matches
      const { currentProduct } = get();
      if (currentProduct && currentProduct._id === productId) {
        set({ currentProduct: updatedProduct });
      }
      
      // Update product in products list
      set(state => ({
        products: state.products.map(product =>
          product._id === productId ? updatedProduct : product
        ),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Utility Actions
  getProductById: (productId) => {
    const { products } = get();
    return products.find(product => product._id === productId);
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
  clearError: () => set({ error: null }),
}));

export default useProductStore;