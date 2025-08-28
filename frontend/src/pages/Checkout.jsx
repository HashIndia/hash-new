import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import AddressForm from "../components/AddressForm";
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/useUserStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI, ordersAPI, paymentsAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { load } from "cashfree-pg-sdk-javascript";

export default function Checkout() {
  const { items, clearCart, getCartTotal, getShippingCost, getTax, getGrandTotal } = useCartStore();
  const { user, addresses, setAddresses } = useUserStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load addresses when component mounts
  useEffect(() => {
    const loadAddresses = async () => {
      if (user && (!addresses || addresses.length === 0)) {
        try {
          const response = await authAPI.getAddresses();
          setAddresses(response.data.addresses || []);
        } catch (error) {
          console.error('Failed to load addresses:', error);
        }
      }
    };
    
    loadAddresses();
  }, [user, setAddresses]);

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0]._id || addresses[0].id);
    }
  }, [addresses]);

  const subtotal = getCartTotal();
  const shipping = getShippingCost();
  const tax = getTax();
  const total = getGrandTotal();

  const handleAddAddress = async (addressData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.addAddress(addressData);
      const newAddress = response.data.address;
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress._id || newAddress.id);
      setShowAddressForm(false);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address!');
      return;
    }

    setIsLoading(true);
    
    try {
      // First create the order
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          image: item.product.images?.[0],
          size: item.size,
          color: item.color,
        })),
        shippingAddress: addresses.find(addr => (addr._id || addr.id) === selectedAddress),
        paymentMethod,
        totalAmount: total,
        shippingCost: shipping,
        taxAmount: tax,
      };

      const orderResponse = await ordersAPI.createOrder(orderData);
      const order = orderResponse.data.order;
      
      if (paymentMethod === 'cod') {
        // For COD, just show success and navigate
        toast.success("Order placed successfully!");
        clearCart();
        navigate('/order-success', { 
          state: { 
            orderId: order._id,
            orderNumber: order.orderNumber || 'N/A',
            paymentMethod: 'cod',
            status: 'confirmed'
          }
        });
      } else {
        // For online payment, integrate Cashfree
        await initiatePayment(order._id, total);
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async (orderId, amount) => {
    try {
      // Create payment order
      const paymentResponse = await paymentsAPI.createPaymentOrder({
        orderId,
        amount
      });

      const { paymentSessionId } = paymentResponse.data;

      // Initialize Cashfree SDK
      const cashfree = await load({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      });

      // Checkout options
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/order-success?order_id=${orderId}`,
      };

      // Open Cashfree checkout
      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          console.error('Payment failed:', result.error);
          toast.error('Payment failed. Please try again.');
        } else if (result.redirect) {
          console.log('Payment successful, redirecting...');
          // Handle success - the returnUrl will handle the redirect
        }
      });

    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading && !showAddressForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-lg mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <motion.div 
        className="container mx-auto py-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-slate-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address & Payment */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Delivery Address */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-slate-500 mb-4">No addresses saved. Please add one.</div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {addresses.map((address, idx) => (
                      <motion.label 
                        key={address._id || address.id || idx} 
                        className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === (address._id || address.id)}
                          onChange={() => setSelectedAddress(address._id || address.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{address.line1}</div>
                          <div className="text-sm text-slate-600">{address.city}, {address.state} - {address.zip}</div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                )}
                
                <AnimatePresence>
                  {showAddressForm ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressForm(false)} isLoading={isLoading} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddressForm(true)}
                        className="w-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Add New Address
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'online', icon: '💳', label: 'Online Payment (Card/UPI/Net Banking)' },
                      { id: 'cod', icon: '💰', label: 'Cash on Delivery' }
                    ].map((method) => (
                      <motion.label 
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          paymentMethod === method.id 
                            ? 'border-slate-800 bg-slate-50' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </motion.label>
                    ))}
                  </div>

                  {/* Payment Details Forms */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <h4 className="font-semibold text-slate-900">Card Details</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <Input
                            placeholder="Card Number (1234 5678 9012 3456)"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                            maxLength={19}
                          />
                          <Input
                            placeholder="Name on Card"
                            value={paymentDetails.nameOnCard}
                            onChange={(e) => handlePaymentDetailsChange('nameOnCard', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="MM/YY"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                              maxLength={5}
                            />
                            <Input
                              placeholder="CVV"
                              value={paymentDetails.cvv}
                              onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                              maxLength={3}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>🔒</span>
                          <span>Your payment information is secure and encrypted</span>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'upi' && (
                      <motion.div
                        key="upi-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <h4 className="font-semibold text-slate-900">UPI Details</h4>
                        <Input
                          placeholder="Enter UPI ID (example@paytm)"
                          value={paymentDetails.upiId}
                          onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
                        />
                        <div className="grid grid-cols-4 gap-2">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                            <Button key={app} variant="outline" size="sm" className="text-xs">
                              {app}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'cod' && (
                      <motion.div
                        key="cod-info"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-slate-50 rounded-lg"
                      >
                        <h4 className="font-semibold text-slate-900 mb-2">Cash on Delivery</h4>
                        <p className="text-sm text-slate-600">
                          Pay when your order is delivered to your doorstep. Additional charges may apply.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map(item => (
                      <motion.div 
                        key={item.id} 
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={item.product.images?.[0] || 'https://placehold.co/60x60/64748b/fff?text=Item'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900">{item.product.name}</div>
                          <div className="text-xs text-slate-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-slate-900">₹{item.price * item.quantity}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax (18%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg text-slate-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="w-full py-4 text-lg font-semibold bg-slate-800 hover:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-slate-400"
                    >
                      {isLoading ? 'Placing Order...' : `Place Order - ₹${total}`}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}