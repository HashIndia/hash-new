import { create } from 'zustand';

const mockProducts = [
  {
    id: '1',
    name: 'Hash Black T-Shirt',
    price: 499,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white'],
    images: ['/assets/black-tshirt.jpg'],
    description: 'Premium cotton t-shirt with bold #HASH branding.',
    reviews: [],
    tags: ['tshirt', 'black', 'cotton'],
  },
  // Add more mock products as needed
];

const useProductStore = create((set) => ({
  products: mockProducts,
  filters: { size: '', color: '', sort: '' },
  setFilters: (filters) => set({ filters }),
  addReview: (productId, review) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, reviews: [...p.reviews, review] }
          : p
      ),
    })),
}));

export default useProductStore; 