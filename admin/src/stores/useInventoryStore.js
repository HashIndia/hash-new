import { create } from 'zustand';
import { productsAPI, inventoryAPI, handleAPIError } from '../services/api.js';

const useInventoryStore = create((set, get) => ({
  // State
  products: [],
  categories: [],
  filters: {
    search: '',
    category: 'all',
    status: 'all',
    stockStatus: 'all'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  selectedProduct: null,
  isLoading: false,
  error: null,

  // Product Management Actions
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

      const response = await productsAPI.getAllProducts(queryParams);
      
      set({
        products: response.data.products,
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

  loadProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getProduct(productId);
      set({ 
        selectedProduct: response.data.product, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.createProduct(productData);
      const newProduct = response.data.product;
      
      set(state => ({
        products: [newProduct, ...state.products],
        isLoading: false
      }));
      
      return { success: true, data: newProduct };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  updateProduct: async (productId, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.updateProduct(productId, productData);
      const updatedProduct = response.data.product;
      
      set(state => ({
        products: state.products.map(product =>
          product._id === productId ? updatedProduct : product
        ),
        selectedProduct: state.selectedProduct?._id === productId ? updatedProduct : state.selectedProduct,
        isLoading: false
      }));
      
      return { success: true, data: updatedProduct };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await productsAPI.deleteProduct(productId);
      
      set(state => ({
        products: state.products.filter(product => product._id !== productId),
        selectedProduct: state.selectedProduct?._id === productId ? null : state.selectedProduct,
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Stock Management Actions
  updateStock: async (productId, stockData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryAPI.updateStock(productId, stockData);
      const updatedProduct = response.data.product;
      
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

  bulkUpdateStock: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryAPI.bulkUpdateStock(updates);
      
      // Reload products to get updated stock values
      await get().loadProducts();
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Category Management
  loadCategories: async () => {
    try {
      const response = await productsAPI.getCategories();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },

  // Filter and Search Actions
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
      search: '',
      category: 'all',
      status: 'all',
      stockStatus: 'all'
    };
    
    set({ 
      filters: defaultFilters,
      pagination: { ...get().pagination, page: 1 }
    });
    
    get().loadProducts();
  },

  searchProducts: (searchTerm) => {
    set(state => ({
      filters: { ...state.filters, search: searchTerm },
      pagination: { ...state.pagination, page: 1 }
    }));
    
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

  // Stock Alert Actions
  getLowStockProducts: async () => {
    try {
      const response = await inventoryAPI.getLowStockProducts();
      return response.data.products;
    } catch (error) {
      console.error('Failed to load low stock products:', error);
      return [];
    }
  },

  getOutOfStockProducts: async () => {
    try {
      const response = await inventoryAPI.getOutOfStockProducts();
      return response.data.products;
    } catch (error) {
      console.error('Failed to load out of stock products:', error);
      return [];
    }
  },

  // Utility Actions
  getProductById: (productId) => {
    const { products } = get();
    return products.find(product => product._id === productId);
  },

  getFilteredProducts: () => {
    const { products, filters } = get();
    let filtered = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.stockStatus !== 'all') {
      if (filters.stockStatus === 'low') {
        filtered = filtered.filter(product => product.stock <= 10 && product.stock > 0);
      } else if (filters.stockStatus === 'out') {
        filtered = filtered.filter(product => product.stock === 0);
      } else if (filters.stockStatus === 'in') {
        filtered = filtered.filter(product => product.stock > 10);
      }
    }

    return filtered;
  },

  // Clear actions
  clearSelectedProduct: () => set({ selectedProduct: null }),
  clearError: () => set({ error: null }),
}));

export default useInventoryStore; 