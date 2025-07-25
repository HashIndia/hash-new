import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(persist(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (credentials) => {
      set({ isLoading: true });
      try {
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          const user = {
            id: 1,
            name: 'Admin User',
            email: credentials.email,
            role: 'admin'
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
    },

    logout: () => {
      set({ user: null, isAuthenticated: false });
    },

    checkAuth: () => {
      const { user } = get();
      if (user) {
        set({ isAuthenticated: true });
      }
    }
  }),
  {
    name: 'admin-auth',
    partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
  }
));

export default useAuthStore; 