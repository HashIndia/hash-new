import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import useOrderStore from '../stores/useOrderStore';
import useCustomerStore from '../stores/useCustomerStore';
import useInventoryStore from '../stores/useInventoryStore';
import useAnalyticsStore from '../stores/useAnalyticsStore';

// Move static data outside component to prevent re-creation
const revenueDataFallback = [
  { date: '2024-01-01', revenue: 4500, orders: 23 },
  { date: '2024-01-02', revenue: 3200, orders: 18 },
  { date: '2024-01-03', revenue: 5100, orders: 28 },
  { date: '2024-01-04', revenue: 4800, orders: 25 },
  { date: '2024-01-05', revenue: 6200, orders: 34 },
  { date: '2024-01-06', revenue: 5500, orders: 29 },
  { date: '2024-01-07', revenue: 7200, orders: 42 }
];

const topProductsDataFallback = [
  { name: 'Cotton T-Shirt', sales: 145, revenue: 4350 },
  { name: 'Denim Jeans', sales: 98, revenue: 5880 },
  { name: 'Summer Dress', sales: 67, revenue: 5360 },
  { name: 'Hoodie', sales: 45, revenue: 2250 },
  { name: 'Sneakers', sales: 34, revenue: 3400 }
];

const customerSegmentDataFallback = [
  { name: 'New Customers', value: 35, color: '#3b82f6' },
  { name: 'Returning', value: 45, color: '#8b5cf6' },
  { name: 'VIP', value: 20, color: '#10b981' }
];

const trafficSourceData = [
  { source: 'Organic Search', visitors: 2400, conversions: 180 },
  { source: 'Social Media', visitors: 1800, conversions: 95 },
  { source: 'Direct', visitors: 1200, conversions: 145 },
  { source: 'Email', visitors: 800, conversions: 120 },
  { source: 'Paid Ads', visitors: 600, conversions: 85 }
];

const recentActivityData = [
  { action: 'New order received', details: 'Order #ORD004 - $87.50', time: '2 minutes ago', type: 'order' },
  { action: 'Low stock alert', details: 'Cotton T-Shirt - 8 units left', time: '15 minutes ago', type: 'alert' },
  { action: 'New customer registered', details: 'Sarah Johnson', time: '1 hour ago', type: 'customer' },
  { action: 'Payment processed', details: 'Order #ORD003 - $107.96', time: '2 hours ago', type: 'payment' }
];

// Memoized chart components to prevent re-renders
const RevenueChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="date" 
        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      />
      <YAxis />
      <Tooltip 
        formatter={(value, name) => [`$${value}`, 'Revenue']}
        labelFormatter={(date) => new Date(date).toLocaleDateString()}
      />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#3b82f6" 
        fillOpacity={1} 
        fill="url(#revenueGradient)"
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
));

RevenueChart.displayName = 'RevenueChart';

const CustomerSegmentChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
));

CustomerSegmentChart.displayName = 'CustomerSegmentChart';

const TopProductsChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="horizontal">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={100} />
      <Tooltip formatter={(value, name) => [value, name === 'sales' ? 'Sales' : 'Revenue']} />
      <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

TopProductsChart.displayName = 'TopProductsChart';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  
  const {
    dashboardStats,
    revenueAnalytics,
    customerAnalytics,
    productAnalytics,
    isLoading,
    error,
    initialize,
    loadRevenueAnalytics,
    loadCustomerAnalytics,
    loadProductAnalytics
  } = useAnalyticsStore();

  // Initialize analytics data on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Reload data when date range changes
  useEffect(() => {
    if (dateRange) {
      const params = { period: dateRange };
      Promise.all([
        loadRevenueAnalytics(params),
        loadCustomerAnalytics(params),
        loadProductAnalytics(params)
      ]);
    }
  }, [dateRange, loadRevenueAnalytics, loadCustomerAnalytics, loadProductAnalytics]);
  
  // Use stable selectors to prevent infinite re-renders - fallback to previous implementation for now
  const orders = useOrderStore(state => state.orders);
  const customers = useCustomerStore(state => state.customers);
  const products = useInventoryStore(state => state.products);

  // Use real data from analytics API when available, otherwise fallback to computed values
  const revenueData = revenueAnalytics?.dailyData?.map(item => ({
    date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
    revenue: item.revenue,
    orders: item.orders
  })) || revenueDataFallback;
  
  const topProductsData = productAnalytics?.topProducts?.map(product => ({
    name: product.name,
    sales: product.totalSold,
    revenue: product.revenue
  })) || topProductsDataFallback;
  
  const customerSegmentData = customerAnalytics?.customerSegments?.map(segment => ({
    name: segment._id === 'new' ? 'New Customers' : 
         segment._id === 'regular' ? 'Regular Customers' : 
         segment._id === 'loyal' ? 'Loyal Customers' : segment._id,
    value: segment.count,
    color: segment._id === 'new' ? '#3b82f6' : 
           segment._id === 'regular' ? '#8b5cf6' : 
           segment._id === 'loyal' ? '#10b981' : '#6b7280'
  })) || customerSegmentDataFallback;

  // Memoize computed values to prevent recalculation on every render
  const orderStats = useMemo(() => {
    // Use dashboard stats if available, otherwise compute from orders
    if (dashboardStats) {
      return {
        total: dashboardStats.orders.total,
        pending: dashboardStats.orders.pending,
        completed: dashboardStats.orders.completed,
        totalRevenue: dashboardStats.revenue.total,
        avgOrderValue: dashboardStats.orders.total > 0 ? 
          dashboardStats.revenue.total / dashboardStats.orders.total : 0
      };
    }
    
    // Fallback to computed values
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

  // Use useMemo for derived data to prevent re-computation
  const kpis = useMemo(() => [
    {
      title: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: orderStats.total,
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Order Value',
      value: `$${orderStats.avgOrderValue.toFixed(2)}`,
      change: '-2.1%',
      changeType: 'decrease',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ], [orderStats]);

  const handleDateRangeChange = useCallback((value) => {
    setDateRange(value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="bg-gray-300 w-12 h-12 rounded-lg"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${
                      kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <div className={`${kpi.color} p-3 rounded-lg`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          key="revenue-chart"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
            <RevenueChart data={revenueData} />
          </Card>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          key="customer-segments-chart"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
              <Button variant="outline" size="sm">
                <Users className="w-3 h-3 mr-1" />
                Manage Segments
              </Button>
            </div>
            <CustomerSegmentChart data={customerSegmentData} />
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          key="top-products-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <TopProductsChart data={topProductsData} />
          </Card>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          key="traffic-sources"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <Button variant="outline" size="sm">Optimize</Button>
            </div>
            <div className="space-y-4">
              {trafficSourceData.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <span className="text-sm text-gray-600">{source.visitors} visitors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(source.conversions / source.visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    {((source.conversions / source.visitors) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          key="recent-activity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivityData.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'customer' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          key="performance-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Revenue Growth</p>
                  <p className="text-xs text-green-700">Compared to last period</p>
                </div>
                <span className="text-lg font-bold text-green-600">+12.5%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Order Volume</p>
                  <p className="text-xs text-blue-700">Total orders this period</p>
                </div>
                <span className="text-lg font-bold text-blue-600">+8.2%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Customer Acquisition</p>
                  <p className="text-xs text-purple-700">New customers acquired</p>
                </div>
                <span className="text-lg font-bold text-purple-600">+15.3%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-orange-900">Product Performance</p>
                  <p className="text-xs text-orange-700">Best selling categories</p>
                </div>
                <span className="text-lg font-bold text-orange-600">T-Shirts</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 