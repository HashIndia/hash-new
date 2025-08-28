import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthAPI, handleAPIError } from '../services/api.js';

const useAuthStore = create(persist(
  (set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Authentication Actions
    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        const response = await adminAuthAPI.login(credentials);
        const { user } = response.data; // Backend returns { data: { user: admin } }
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
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

          logout: async () => {
        try {
          await adminAuthAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
        }
      },

      logoutAll: async () => {
        try {
          await adminAuthAPI.logoutAll();
        } catch (error) {
          console.error('Logout all error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
        }
      },

      checkAuth: async () => {
        try {
          const response = await adminAuthAPI.getCurrentAdmin();
          set({ 
            user: response.data.user, // Backend returns { data: { user: admin } }
            isAuthenticated: true 
          });
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
    name: 'admin-auth',
    partialize: (state) => ({ 
      user: state.user, 
      isAuthenticated: state.isAuthenticated 
    })
  }
));

export default useAuthStore;