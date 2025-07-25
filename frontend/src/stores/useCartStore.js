import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  addToCart: (product, qty = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        ),
      });
    } else {
      set({ items: [...items, { ...product, qty }] });
    }
  },
  removeFromCart: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clearCart: () => set({ items: [] }),
  updateQty: (id, qty) =>
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, qty } : i
      ),
    }),
}));

export default useCartStore; 