import { create } from 'zustand';

const useInventoryStore = create((set, get) => ({
  products: [
    {
      id: 1,
      name: 'Cotton T-Shirt',
      category: 'T-Shirts',
      brand: 'Fashion Co',
      price: 29.99,
      stock: 150,
      sku: 'TSH001',
      status: 'active',
      images: ['https://via.placeholder.com/200'],
      description: 'Comfortable cotton t-shirt',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Navy'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Denim Jeans',
      category: 'Jeans',
      brand: 'Denim Plus',
      price: 59.99,
      stock: 75,
      sku: 'JNS001',
      status: 'active',
      images: ['https://via.placeholder.com/200'],
      description: 'Classic denim jeans',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Blue', 'Black'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: 3,
      name: 'Summer Dress',
      category: 'Dresses',
      brand: 'Elegant Style',
      price: 79.99,
      stock: 45,
      sku: 'DRS001',
      status: 'active',
      images: ['https://via.placeholder.com/200'],
      description: 'Beautiful summer dress',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Red', 'Blue', 'Green'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    }
  ],
  isLoading: false,
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'name',

  // Actions
  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set(state => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id, updates) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    }));
  },

  deleteProduct: (id) => {
    set(state => ({
      products: state.products.filter(product => product.id !== id)
    }));
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sortBy) => set({ sortBy }),

  // Getters
  getFilteredProducts: () => {
    const { products, searchTerm, selectedCategory, sortBy } = get();
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  },

  getCategories: () => {
    const { products } = get();
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  },

  getLowStockProducts: () => {
    const { products } = get();
    return products.filter(product => product.stock < 20);
  }
}));

export default useInventoryStore; 