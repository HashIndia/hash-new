import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../stores/useUserStore';
import useNotificationStore from '../stores/useNotificationStore';
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
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = getCartCount();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In real app, navigate to search results
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
        // Backend logout failed, but user state cleared
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
    <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <img 
              src="/hash-logo.jpg" 
              alt="Hash Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <img 
              src="/hash-logo-text.jpg" 
              alt="Hash" 
              className="h-8 object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/shop" className="text-foreground/80 hover:text-hash-purple font-medium transition-all duration-200 hover:scale-105">
            Shop
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-xl hover:bg-hash-purple/10 transition-all duration-200 group-hover:scale-105">
              <ShoppingCart className="w-6 h-6 text-foreground/80 group-hover:text-hash-purple transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-hash-pink to-hash-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="group">
                <div className="p-2 rounded-xl hover:bg-hash-pink/10 transition-all duration-200 group-hover:scale-105">
                  <Heart className="w-6 h-6 text-foreground/80 group-hover:text-hash-pink transition-colors" />
                </div>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl hover:bg-hash-blue/10 transition-all duration-200 hover:scale-105 group"
                >
                  <Bell className="w-6 h-6 text-foreground/80 group-hover:text-hash-blue transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-hash-orange to-hash-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
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

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-primary/10 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-hash-purple to-hash-blue rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-foreground font-medium hidden lg:block">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-hash-purple transition-all duration-200 group-hover:rotate-180" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-border bg-gradient-to-r from-hash-purple/5 via-hash-blue/5 to-hash-pink/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-hash-purple to-hash-blue rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group w-full"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-5 h-5 text-hash-purple group-hover:scale-110 transition-transform" />
                          <span className="text-foreground font-medium">Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group w-full"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-5 h-5 text-hash-blue group-hover:scale-110 transition-transform" />
                          <span className="text-foreground font-medium">Orders</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-destructive/10 transition-all duration-200 group w-full text-left"
                        >
                          <LogOut className="w-5 h-5 text-destructive group-hover:scale-110 transition-transform" />
                          <span className="text-destructive font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="font-medium border-hash-purple/30 hover:border-hash-purple hover:bg-hash-purple/10 hover:text-hash-purple transition-all duration-200">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink hover:shadow-lg hover:shadow-hash-purple/25 transition-all duration-300 hover:scale-105 font-medium">
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
          className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-all duration-200"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
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
            className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              <Link
                to="/shop"
                className="block p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-gradient-to-r from-hash-pink to-hash-purple text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left p-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block p-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block p-3 rounded-xl bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink text-white font-medium transition-all duration-200"
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