import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../utils/useUserStore';
import useNotificationStore from '../stores/useNotificationStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  LogIn,
  UserPlus,
  Bell,
  Heart,
  LogOut,
  ChevronDown,
  Users
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Header() {
  const { items, getCartCount } = useCartStore();
  const { user, isAuthenticated, logout: logoutFromStore } = useUserStore();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = getCartCount();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      logoutFromStore();
      try {
        await authAPI.logout();
      } catch (error) {}
      toast.success('Logged out successfully.');
      navigate('/');
    } catch (error) {
      toast.error('Logout completed with some issues.');
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 bg-neutral-100">
            <img
              src="/"
              alt="Hash Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/hash-logo-text.jpg"
              alt="Hash"
              className="h-6 sm:h-8 object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/shop" className="text-neutral-700 hover:text-black font-medium transition-all duration-200 hover:scale-105">
            Shop
          </Link>
          <Link to="/about" className="text-neutral-700 hover:text-black font-medium transition-all duration-200 hover:scale-105">
            About Us
          </Link>
          <Link to="/#core-team" className="text-neutral-700 hover:text-black font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1" onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('core-team')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            <Users className="w-4 h-4" /> Core
          </Link>
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group-hover:scale-105">
              <ShoppingCart className="w-6 h-6 text-neutral-700 group-hover:text-black transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="group">
                <div className="p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group-hover:scale-105">
                  <Heart className="w-6 h-6 text-neutral-700 group-hover:text-black transition-colors" />
                </div>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 hover:scale-105 group"
                >
                  <Bell className="w-6 h-6 text-neutral-700 group-hover:text-black transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <NotificationCenter
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center shadow">
                    <span className="text-neutral-700 text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-neutral-700 font-medium hidden lg:block">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-black transition-all duration-200 group-hover:rotate-180" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <span className="text-neutral-700 font-bold">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-800">{user?.name}</p>
                            <p className="text-sm text-neutral-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 transition-all duration-200 group w-full"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-5 h-5 text-neutral-700 group-hover:scale-110 transition-transform" />
                          <span className="text-neutral-800 font-medium">Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 transition-all duration-200 group w-full"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-5 h-5 text-neutral-700 group-hover:scale-110 transition-transform" />
                          <span className="text-neutral-800 font-medium">Orders</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group w-full text-left"
                        >
                          <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                          <span className="text-red-500 font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="font-medium border-neutral-200 hover:border-black hover:bg-neutral-100 hover:text-black transition-all duration-200">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-black hover:bg-neutral-800 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
                <Link to="/register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-neutral-700" />
          ) : (
            <Menu className="w-6 h-6 text-neutral-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/shop"
                className="block p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/#core-team"
                className="p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200 flex items-center gap-2"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('core-team')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Users className="w-4 h-4" /> Core
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-black text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left p-3 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block p-3 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block p-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}