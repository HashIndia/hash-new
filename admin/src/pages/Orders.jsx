import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  CheckCircle, 
  Clock,
  Package,
  AlertCircle,
  Send
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import OTPModal from '../components/OTPModal';
import useOrderStore from '../stores/useOrderStore';
import { format } from 'date-fns';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  
  const {
    searchTerm,
    statusFilter,
    dateRange,
    setSearchTerm,
    setStatusFilter,
    setDateRange,
    getFilteredOrders,
    updateOrderStatus,
    generateOTP,
    verifyOTP,
    addOrderNote
  } = useOrderStore();

  const orders = getFilteredOrders();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleOTPAction = (order) => {
    setSelectedOrder(order);
    setShowOTPModal(true);
  };

  const handleGenerateOTP = async (orderId) => {
    const otp = generateOTP(orderId);
    // In real app, you would send this OTP via SMS/email
    console.log(`OTP ${otp} generated for order ${orderId}`);
  };

  const handleVerifyOTP = async (orderId, enteredOTP) => {
    return verifyOTP(orderId, enteredOTP);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            Export Orders
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(order.status).replace('text-', 'bg-').replace('-800', '-100')}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.orderDate), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Customer</h4>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Items</h4>
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Delivery</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {order.customerAddress}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-blue-600">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        Mark as Shipped
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button
                        size="sm"
                        onClick={() => handleOTPAction(order)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {order.otpVerified ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Delivered
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            OTP Delivery
                          </>
                        )}
                      </Button>
                    )}
                    {order.status === 'delivered' && order.otpVerified && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified Delivery
                      </div>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> {order.notes}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        order={selectedOrder}
        onGenerateOTP={handleGenerateOTP}
        onVerifyOTP={handleVerifyOTP}
      />
    </div>
  );
};

export default Orders; 