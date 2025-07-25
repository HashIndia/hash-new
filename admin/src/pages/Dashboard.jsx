import { useMemo, memo, useCallback } from 'react';
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
import useOrderStore from '../stores/useOrderStore';
import useInventoryStore from '../stores/useInventoryStore';
import useCustomerStore from '../stores/useCustomerStore';

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

const recentOrdersData = [
  { id: 'ORD001', customer: 'John Doe', amount: '$140.36', status: 'pending' },
  { id: 'ORD002', customer: 'Jane Smith', amount: '$97.18', status: 'shipped' },
  { id: 'ORD003', customer: 'Bob Johnson', amount: '$107.96', status: 'delivered' }
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

const Dashboard = () => {
  // Use stable selectors to prevent infinite re-renders
  const orders = useOrderStore(state => state.orders);
  const customers = useCustomerStore(state => state.customers);
  const products = useInventoryStore(state => state.products);

  // Memoize computed values to prevent recalculation on every render
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
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
    const vip = customers.filter(c => c.tags.includes('VIP')).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = customers.length > 0 
      ? customers.reduce((sum, c) => sum + (c.totalSpent / Math.max(c.totalOrders, 1)), 0) / customers.length 
      : 0;
    
    return {
      total,
      active,
      inactive,
      vip,
      avgOrderValue,
      totalRevenue
    };
  }, [customers]);

  const lowStockProducts = useMemo(() => {
    return products.filter(product => product.stock < 20);
  }, [products]);

  // Use useMemo for derived data to prevent re-computation
  const stats = useMemo(() => [
    {
      name: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toFixed(2)}`,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center text-sm ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          key="sales-chart"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
            <SalesChart />
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          key="category-chart"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            <CategoryChart />
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          key="recent-orders"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <a href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentOrdersData.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          key="low-stock"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">All products are well stocked</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 