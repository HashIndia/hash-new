import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      addresses: [],
      orders: [],
      wishlist: [],

      // Actions
      setUser: (userData) => {
        console.log('[UserStore] Setting user:', userData?.email);
        set({ user: userData, isAuthenticated: !!userData });
      },
      
      logout: () => {
        console.log('[UserStore] Logging out user');
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