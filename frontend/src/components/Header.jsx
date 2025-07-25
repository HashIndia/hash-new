import { Link, NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../stores/useUserStore';
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

export default function Header() {
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

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

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="avatar avatar-md">
            <span className="text-lg font-bold">#</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
            HASH
          </h1>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink 
            to="/shop" 
            className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
          >
            <Package className="w-4 h-4" />
            Shop
          </NavLink>
          
          <NavLink 
            to="/cart" 
            className={({isActive}) => `nav-link relative ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="notification-dot">
                {cartCount}
              </span>
            )}
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink 
                to="/orders" 
                className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <Package className="w-4 h-4" />
                Orders
              </NavLink>
              
              <NavLink 
                to="/profile" 
                className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <User className="w-4 h-4" />
                Profile
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="btn-ghost relative p-2"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="notification-dot w-4 h-4 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="badge badge-primary">{unreadCount} new</span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                              notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="avatar avatar-sm">
                    <span className="text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-md">
                            <span className="text-sm">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        <Link
                          to="/rewards"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Gift className="w-4 h-4" />
                          Rewards
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {!isAuthenticated && (
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden btn-ghost p-2"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            {/* Mobile Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-search w-full"
                />
              </form>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="px-6 py-4 space-y-2">
              <NavLink 
                to="/shop" 
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'} w-full justify-start`}
              >
                <Package className="w-5 h-5" />
                Shop
              </NavLink>
              
              <NavLink 
                to="/cart" 
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `nav-link relative ${isActive ? 'nav-link-active' : 'nav-link-inactive'} w-full justify-start`}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto badge badge-primary">
                    {cartCount}
                  </span>
                )}
              </NavLink>
              
              {isAuthenticated && (
                <>
                  <NavLink 
                    to="/orders" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'} w-full justify-start`}
                  >
                    <Package className="w-5 h-5" />
                    Orders
                  </NavLink>
                  
                  <NavLink 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({isActive}) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'} w-full justify-start`}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </NavLink>

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <button
                      onClick={() => {setShowNotifications(!showNotifications)}}
                      className="nav-link nav-link-inactive w-full justify-start relative"
                    >
                      <Bell className="w-5 h-5" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto badge badge-primary">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </nav>
            
            {/* Mobile Auth */}
            <div className="px-6 py-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="avatar avatar-md">
                      <span className="text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full font-medium py-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full btn-gradient py-3 font-medium">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 