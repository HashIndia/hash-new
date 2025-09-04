import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ordersAPI, handleAPIError } from '../services/api.js';
import useUserStore from './useUserStore.js';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Cart Actions
      addToCart: (product, quantity = 1, options = {}) => {
        // Check if user is authenticated before adding to cart
        const { isAuthenticated } = useUserStore.getState();
        
        if (!isAuthenticated) {
          toast.error('Please login to add items to cart');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }

        const { items } = get();
        const { size, color } = options;
        
        // Create unique item key based on product id and options
        const itemKey = `${product._id}-${size || ''}-${color || ''}`;
        const existingItemIndex = items.findIndex(item => 
          item.product._id === product._id && 
          item.size === size && 
          item.color === color
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem = {
            id: itemKey,
            product,
            quantity,
            size: size || '',
            color: color || '',
            price: product.price
          };
          set({ items: [...items, newItem] });
        }
      },

      removeFromCart: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      // Order Actions
      createOrder: async (shippingAddress, paymentMethod = 'online') => {
        const { items } = get();
        
        if (items.length === 0) {
          return { success: false, error: 'Cart is empty' };
        }

        set({ isLoading: true, error: null });
        
        try {
          // Prepare order items
          const orderItems = items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          }));

          const orderData = {
            items: orderItems,
            shippingAddress,
            paymentMethod
          };

          const response = await ordersAPI.createOrder(orderData);
          
          // Clear cart after successful order
          set({ items: [], isLoading: false });
          
          return { 
            success: true, 
            data: response.data.order 
          };
        } catch (error) {
          const errorMessage = handleAPIError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Computed Values
      getCartTotal: () => {
        const { items } = get();
        const total = items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
        return parseFloat(total.toFixed(2));
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingCost: () => {
        const total = get().getCartTotal();
        // Always return 0 for shipping (free shipping)
        return 0;
      },

      getTax: () => {
        const total = get().getCartTotal();
        const tax = total * 0.02; // 2% Gateway charges
        return parseFloat(tax.toFixed(2));
      },

      getGrandTotal: () => {
        const subtotal = get().getCartTotal();
        const shipping = get().getShippingCost();
        const tax = get().getTax();
        const total = subtotal + shipping + tax;
        return parseFloat(total.toFixed(2));
      },

      // Validation
      validateCartItems: () => {
        const { items } = get();
        const errors = [];

        items.forEach(item => {
          if (!item.product) {
            errors.push(`Invalid product in cart`);
          }
          if (item.quantity <= 0) {
            errors.push(`Invalid quantity for ${item.product?.name}`);
          }
          if (item.product?.stock && item.quantity > item.product.stock) {
            errors.push(`Insufficient stock for ${item.product.name}`);
          }
        });

        return {
          isValid: errors.length === 0,
          errors
        };
      },

      // Utility Actions
      isInCart: (productId, options = {}) => {
        const { items } = get();
        const { size, color } = options;
        return items.some(item => 
          item.product._id === productId && 
          item.size === (size || '') && 
          item.color === (color || '')
        );
      },

      getItemQuantity: (productId, options = {}) => {
        const { items } = get();
        const { size, color } = options;
        const item = items.find(item => 
          item.product._id === productId && 
          item.size === (size || '') && 
          item.color === (color || '')
        );
        return item ? item.quantity : 0;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore; 