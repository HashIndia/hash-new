import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { adminAuthAPI, productsAPI, ordersAPI, customersAPI } from '../services/api';

// Move static data outside component to prevent re-creation
const salesData = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 32 },
  { name: 'Apr', sales: 4500, orders: 28 },
  { name: 'May', sales: 6000, orders: 45 },
  { name: 'Jun', sales: 5500, orders: 38 }
];

const categoryData = [
  { name: 'T-Shirts', value: 35, color: '#3b82f6' },
  { name: 'Jeans', value: 25, color: '#8b5cf6' },
  { name: 'Dresses', value: 20, color: '#10b981' },
  { name: 'Accessories', value: 20, color: '#f59e0b' }
];

// Memoized chart components to prevent re-renders
const SalesChart = memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={salesData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line 
        type="monotone" 
        dataKey="sales" 
        stroke="#3b82f6" 
        strokeWidth={2}
        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
      />
    </LineChart>
  </ResponsiveContainer>
));

SalesChart.displayName = 'SalesChart';

const CategoryChart = memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
));

CategoryChart.displayName = 'CategoryChart';

export default function Dashboard() {
  // ALL HOOKS MUST BE CALLED AT THE TOP - BEFORE ANY CONDITIONS OR EARLY RETURNS
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Real data from API instead of dummy stores
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0
  });

  // Memoize computed values to prevent recalculation on every render
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    return {
      total,
      pending,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
      avgOrderValue
    };
  }, [orders]);

  const customerStats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const inactive = customers.filter(c => c.status === 'inactive').length;
    const vip = customers.filter(c => c.tags?.includes('VIP')).length;
    
    return {
      total,
      active,
      inactive,
      vip
    };
  }, [customers]);

  const lowStockProducts = useMemo(() => {
    return products.filter(product => (product.stock || 0) < 20);
  }, [products]);

  // Use useMemo for derived data to prevent re-computation
  const stats = useMemo(() => [
    {
      name: 'Total Revenue',
      value: `₹${orderStats.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      name: 'Total Orders',
      value: orderStats.total,
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Customers',
      value: customerStats.total,
      change: '+15.3%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Low Stock Items',
      value: lowStockProducts.length,
      change: '-2.1%',
      changeType: 'decrease',
      icon: Package,
      color: 'bg-orange-500'
    }
  ], [orderStats, customerStats, lowStockProducts]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('[Dashboard] Fetching data...');
      // Fetch all data in parallel with error handling
      const [ordersResult, customersResult, productsResult] = await Promise.all([
        ordersAPI.getOrders({ limit: 100 }).catch(() => ({ data: { orders: [] } })),
        customersAPI.getCustomers({ limit: 100 }).catch(() => ({ data: { customers: [] } })),
        productsAPI.getProducts({ limit: 100 }).catch(() => ({ data: { products: [] } })),
      ]);

      // Handle orders - safe extraction
      if (ordersResult) {
        const ordersData = ordersResult.data?.orders || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setOrders([]);
      }

      // Handle customers - safe extraction
      if (customersResult) {
        const customersData = customersResult.data?.customers || [];
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } else {
        setCustomers([]);
      }

      // Handle products - safe extraction
      if (productsResult) {
        const productsData = productsResult.data?.products || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } else {
        setProducts([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays as fallback
      setOrders([]);
      setCustomers([]);
      setProducts([]);
    }
  }, []);

  // ALL HOOKS CALLED ABOVE - NOW SAFE FOR EFFECTS AND CONDITIONAL LOGIC
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await adminAuthAPI.getCurrentAdmin();
        setAdmin(response.data.user);
        console.log('[Admin Dashboard] Admin authenticated:', response.data.user.email);
        
        // Fetch dashboard data after authentication
        await fetchDashboardData();
      } catch (error) {
        console.log('[Admin Dashboard] Not authenticated, redirecting to login');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await adminAuthAPI.logout();
    } catch (error) {
      console.log('Logout error (ignored):', error);
    } finally {
      localStorage.removeItem('admin-auth');
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {admin.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Summary */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <p className="text-gray-600 mb-6">Real-time data from your store</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{customerStats.total}</p>
                <p className="text-sm text-gray-600">Active: {customerStats.active}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                <p className="text-3xl font-bold text-green-600">{orderStats.total}</p>
                <p className="text-sm text-gray-600">Pending: {orderStats.pending}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
                <p className="text-3xl font-bold text-purple-600">{products.length}</p>
                <p className="text-sm text-gray-600">Low Stock: {lowStockProducts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};