import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      addresses: [],
      orders: [],
      wishlist: [],

      setUser: (userData) => {
        set({ user: userData, isAuthenticated: !!userData });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('safari_auth_token');
        }
        const cartStore = localStorage.getItem('cart-store');
        if (cartStore) {
          localStorage.removeItem('cart-store');
        }
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
          orders: [],
          wishlist: []
        });
      },

      setAddresses: (addresses) => set({ addresses }),
      setOrders: (orders) => set({ orders }),
      setWishlist: (wishlist) => set({ wishlist }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useUserStore;