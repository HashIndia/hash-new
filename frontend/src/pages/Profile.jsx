import { useEffect, useState } from "react";
import { authAPI, ordersAPI } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import AddressForm from "../components/AddressForm";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, addresses, orders, setAddresses, setOrders } = useUserStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      // Prevent infinite loops - only fetch if user exists and data not already loaded
      if (!user || dataLoaded) return;

      try {
        const [addressRes, orderRes] = await Promise.all([
          authAPI.getAddresses(),
          ordersAPI.getUserOrders(),
        ]);

        if (isMounted) {
          setAddresses(addressRes.data.addresses || []);
          setOrders(orderRes.data.orders || []);
          setDataLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          // Don't retry automatically on error
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-renders

  const handleAddAddress = async (addressData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.addAddress(addressData);
      const newAddress = response.data.address;
      setAddresses([...addresses, newAddress]);
      setShowAddressForm(false);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = async (addressData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.updateAddress(
        editingAddress._id,
        addressData
      );
      const updatedAddress = response.data.address;
      setAddresses(
        addresses.map((addr) =>
          addr._id === editingAddress._id ? updatedAddress : addr
        )
      );
      setEditingAddress(null);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error("Failed to update address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await authAPI.deleteAddress(addressId);
      setAddresses(addresses.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address. Please try again.");
    }
  };

  if (!user || !dataLoaded) {
    return <ProfilePageSkeleton />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center font-space">My Profile</h1>

        {(showAddressForm || editingAddress) && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AddressForm
              onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
              onCancel={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              initialData={editingAddress}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="bg-card border-b border-border">
                <CardTitle className="font-space text-foreground">My Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <strong className="text-foreground">Name:</strong> 
                    <span className="text-muted-foreground">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-foreground">Email:</strong> 
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-foreground">Phone:</strong> 
                    <span className="text-muted-foreground">{user.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between bg-card border-b border-border">
                <CardTitle className="font-space text-foreground">My Addresses</CardTitle>
                <Button 
                  onClick={() => setShowAddressForm(true)}
                  className="bg-hash-purple hover:bg-hash-purple/90 text-white"
                >
                  Add Address
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className="border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">{addr.name}</p>
                            <p className="text-muted-foreground">
                              {addr.line1}, {addr.line2 && `${addr.line2},`}{" "}
                              {addr.city}
                            </p>
                            <p className="text-muted-foreground">
                              {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-muted-foreground">Phone: {addr.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingAddress(addr)}
                              className="border-hash-purple text-hash-purple hover:bg-hash-purple hover:text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAddress(addr._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No addresses found.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card border border-border shadow-lg">
                            <CardHeader className="bg-card border-b border-border">
                <CardTitle className="text-foreground">Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">
                              Order #{order.orderNumber}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-lg font-bold text-hash-purple mt-1">
                              ₹{(order.totalAmount || order.total || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">Items:</p>
                            <div className="space-y-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <div className="flex-1">
                                    <span className="text-foreground">{item.name || 'Product'}</span>
                                    {item.size && item.color && (
                                      <span className="text-muted-foreground ml-2">
                                        ({item.size}, {item.color})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-muted-foreground">
                                    Qty: {item.quantity} × ₹{item.price}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  +{order.items.length - 3} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-1">Shipping Address:</p>
                            <p className="text-sm text-muted-foreground">
                              {order.shippingAddress.name}, {order.shippingAddress.line1}
                              {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                              {order.shippingAddress.state && ` - ${order.shippingAddress.state}`}
                              {order.shippingAddress.pincode && ` ${order.shippingAddress.pincode}`}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders found.</p>
                    <Button 
                      onClick={() => window.location.href = '/shop'}
                      className="bg-hash-purple hover:bg-hash-purple/90 text-white"
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}