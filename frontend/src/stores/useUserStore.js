import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  addresses: [],
  orders: [],
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setAddresses: (addresses) => set({ addresses }),
  setOrders: (orders) => set({ orders }),
}));

export default useUserStore; 