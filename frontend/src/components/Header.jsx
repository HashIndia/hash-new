import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../stores/useUserStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  Package,
  LogIn,
  UserPlus,
  Bell,
  Settings,
  Heart,
  Gift,
  LogOut,
  ChevronDown
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Header() {
  const { items, getCartCount } = useCartStore();
  const { user, isAuthenticated, logout: logoutFromStore } = useUserStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = getCartCount();

  // Mock notifications - in real app this would come from a store
  const notifications = [
    { id: 1, message: 'Your order #1234 has been shipped!', time: '2 minutes ago', unread: true, type: 'order' },
    { id: 2, message: 'New collection available - Summer 2024', time: '1 hour ago', unread: true, type: 'announcement' },
    { id: 3, message: 'Your wishlist item is on sale!', time: '3 hours ago', unread: false, type: 'sale' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In real app, navigate to search results
      console.log('Search for:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      // Always clear the frontend state first
      logoutFromStore();
      
      // Then try to notify the backend (but don't fail if it doesn't work)
      try {
        await authAPI.logout();
      } catch (error) {
        console.warn('Backend logout failed, but user state cleared:', error);
      }
      
      toast.success('Logged out successfully.');
      navigate('/');
    } catch (error) {
      // Even if backend logout fails, we've cleared the frontend state
      toast.error('Logout completed with some issues.');
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          HASH
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/shop" className="text-gray-600 hover:text-gray-800">Shop</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-gray-800" />
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-800">
                <Heart className="w-6 h-6" />
              </Link>
              <NotificationCenter />
              <Link to="/profile" className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="font-medium">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="btn-gradient font-medium">
                <Link to="/register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}