import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ordersAPI } from "../services/api";
import toast from "react-hot-toast";

export default function Orders() {
  const { orders, setOrders, user } = useUserStore();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await ordersAPI.getUserOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user, setOrders]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">No Orders Yet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg">
              <a href="/shop">Start Shopping</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <motion.div 
        className="container mx-auto py-12 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Order History</h1>
          <p className="text-slate-600">Track your orders and view purchase history</p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id || order.id}
              variants={itemVariants}
              layout
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Order #{order.orderNumber || order._id}
                      </h3>
                      <p className="text-slate-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900 mb-2">
                        ₹{order.totalAmount}
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        <span>{getStatusIcon(order.status)}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress */}
                  {order.status !== 'cancelled' && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Order Progress</span>
                        <span>{order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : '33%'}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-slate-800 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: order.status === 'delivered' ? '100%' : 
                                   order.status === 'shipped' ? '66%' : '33%' 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>Ordered</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                    
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      Download Invoice
                    </Button>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-slate-200"
                    >
                      <h4 className="font-semibold text-slate-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <img
                              src={item.image || item.product?.images?.[0] || `https://placehold.co/60x60/64748b/fff?text=Item`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-900">{item.name}</h5>
                              <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">₹{item.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                        <h4 className="font-semibold text-slate-900 mb-3">Delivery Address</h4>
                        <div className="text-slate-600">
                          <p>{order.shippingAddress?.line1}</p>
                          {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          {order.shippingAddress?.landmark && <p>Near: {order.shippingAddress.landmark}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary Stats */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {orders.length}
              </div>
              <div className="text-slate-600">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)}
              </div>
              <div className="text-slate-600">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {orders.filter(order => order.status === 'delivered').length}
              </div>
              <div className="text-slate-600">Delivered</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 