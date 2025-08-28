import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // State
      notifications: [],
      demoNotificationsInitialized: false,
      
      // Actions
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true
          }))
        }));
      },

      removeNotification: (notificationId) => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.id !== notificationId
          )
        }));
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      setDemoNotificationsInitialized: (value) => {
        set({ demoNotificationsInitialized: value });
      },

      // Helper to create order status notifications
      createOrderNotification: (orderId, status, orderTotal) => {
        const notifications = {
          confirmed: {
            type: 'order',
            title: 'Order Confirmed',
            message: `Your order #${orderId} has been confirmed and is being processed.`,
            icon: 'Package',
            color: 'text-hash-green'
          },
          processing: {
            type: 'order',
            title: 'Order Processing',
            message: `Your order #${orderId} is being prepared for shipment.`,
            icon: 'Package',
            color: 'text-hash-blue'
          },
          shipped: {
            type: 'order',
            title: 'Order Shipped',
            message: `Great news! Your order #${orderId} has been shipped and is on its way to you.`,
            icon: 'Truck',
            color: 'text-hash-purple'
          },
          delivered: {
            type: 'order',
            title: 'Order Delivered',
            message: `Your order #${orderId} has been successfully delivered. Enjoy your purchase!`,
            icon: 'CheckCircle',
            color: 'text-hash-green'
          },
          cancelled: {
            type: 'order',
            title: 'Order Cancelled',
            message: `Your order #${orderId} has been cancelled. Refund will be processed within 3-5 business days.`,
            icon: 'XCircle',
            color: 'text-red-500'
          }
        };

        const notification = notifications[status];
        if (notification) {
          get().addNotification({
            ...notification,
            orderId,
            orderTotal
          });
        }
      },

      // Helper to create wishlist notifications
      createWishlistNotification: (productName, discount) => {
        get().addNotification({
          type: 'wishlist',
          title: 'Price Drop Alert',
          message: `${productName} is now ${discount}% off! Don't miss out on this deal.`,
          icon: 'Heart',
          color: 'text-hash-pink'
        });
      },

      // Helper to create cart reminder notifications
      createCartReminderNotification: (itemCount) => {
        get().addNotification({
          type: 'cart',
          title: 'Cart Reminder',
          message: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} waiting in your cart. Complete your purchase now!`,
          icon: 'ShoppingCart',
          color: 'text-hash-blue'
        });
      }
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        demoNotificationsInitialized: state.demoNotificationsInitialized
      })
    }
  )
);

export default useNotificationStore;
