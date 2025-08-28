import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Heart, ShoppingCart, User, AlertCircle, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import useUserStore from '../stores/useUserStore';
import useNotificationStore from '../stores/useNotificationStore';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { user } = useUserStore();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    createOrderNotification 
  } = useNotificationStore();

  // Icon mapping for notifications
  const iconMap = {
    Package,
    Heart,
    ShoppingCart,
    User,
    AlertCircle,
    Truck,
    CheckCircle,
    XCircle
  };

  // Demo: Create some initial real-looking notifications for demo purposes
  useEffect(() => {
    if (user && notifications.length === 0) {
      // Simulate some recent order notifications
      setTimeout(() => {
        createOrderNotification('ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(), 'shipped', 2499);
      }, 1000);
      
      setTimeout(() => {
        createOrderNotification('ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(), 'delivered', 1899);
      }, 1500);
      
      setTimeout(() => {
        createOrderNotification('ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(), 'confirmed', 1299);
      }, 2000);
    }
  }, [user, notifications.length, createOrderNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-hash-blue';
      case 'wishlist': return 'text-hash-pink';
      case 'cart': return 'text-hash-green';
      case 'account': return 'text-hash-purple';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-80 z-50"
          >
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border border-border">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple text-white rounded-t-lg">
                  <h3 className="font-semibold font-space">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-white hover:text-white hover:bg-white/20 h-8 px-2 text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p>No notifications yet</p>
                      <p className="text-xs mt-1">We'll notify you about order updates</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = iconMap[notification.icon] || Package;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 border-b border-border hover:bg-accent/50 transition-colors ${
                            !notification.read ? 'bg-hash-purple/5' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-full bg-accent/50 ${getNotificationColor(notification.type)}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h4>
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="text-muted-foreground hover:text-foreground ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-hash-purple hover:text-hash-blue"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
