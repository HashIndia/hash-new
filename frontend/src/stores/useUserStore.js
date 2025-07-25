import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, ordersAPI, handleAPIError } from '../services/api.js';

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      addresses: [],
      orders: [],
      wishlist: [],
      isLoading: false,
      error: null,

      // Authentication Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user } = response.data;
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Load user data after login
          await get().loadUserData();
          
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      verifyOTP: async (otpData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.verifyOTP(otpData);
          const { user } = response.data;
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          await get().loadUserData();
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            addresses: [], 
            orders: [], 
            wishlist: [] 
          });
        }
      },

      logoutAll: async () => {
        try {
          await authAPI.logoutAll();
        } catch (error) {
          console.error('Logout all error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            addresses: [], 
            orders: [], 
            wishlist: [] 
          });
        }
      },

      // Profile Actions
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(userData);
          set({ 
            user: response.data.user, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.changePassword(passwordData);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Address Actions
      loadAddresses: async () => {
        try {
          const response = await authAPI.getAddresses();
          set({ addresses: response.data.addresses });
        } catch (error) {
          console.error('Failed to load addresses:', error);
        }
      },

      addAddress: async (addressData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.addAddress(addressData);
          const newAddress = response.data.address;
          set(state => ({ 
            addresses: [...state.addresses, newAddress],
            isLoading: false 
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      updateAddress: async (addressId, addressData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateAddress(addressId, addressData);
          const updatedAddress = response.data.address;
          set(state => ({
            addresses: state.addresses.map(addr => 
              addr._id === addressId ? updatedAddress : addr
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

      deleteAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.deleteAddress(addressId);
          set(state => ({
            addresses: state.addresses.filter(addr => addr._id !== addressId),
            isLoading: false
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Order Actions
      loadOrders: async (params = {}) => {
        try {
          const response = await ordersAPI.getUserOrders(params);
          set({ orders: response.data.orders });
        } catch (error) {
          console.error('Failed to load orders:', error);
        }
      },

      // Wishlist Actions
      loadWishlist: async () => {
        try {
          const response = await authAPI.getWishlist();
          set({ wishlist: response.data.wishlist });
        } catch (error) {
          console.error('Failed to load wishlist:', error);
        }
      },

      addToWishlist: async (productId) => {
        try {
          await authAPI.addToWishlist(productId);
          await get().loadWishlist();
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          return { success: false, error: errorMessage };
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          await authAPI.removeFromWishlist(productId);
          set(state => ({
            wishlist: state.wishlist.filter(item => item._id !== productId)
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          return { success: false, error: errorMessage };
        }
      },

      // Utility Actions
      loadUserData: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;
        
        try {
          await Promise.all([
            get().loadAddresses(),
            get().loadOrders(),
            get().loadWishlist()
          ]);
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      },

      checkAuth: async () => {
        try {
          const response = await authAPI.getCurrentUser();
          set({ 
            user: response.data.user, 
            isAuthenticated: true 
          });
          await get().loadUserData();
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false 
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
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