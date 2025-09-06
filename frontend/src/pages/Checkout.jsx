import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import AddressForm from "../components/AddressForm";
import CheckoutPageSkeleton from "../components/CheckoutPageSkeleton";
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/useUserStore";
import useNotificationStore from "../stores/useNotificationStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI, ordersAPI, paymentsAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";

export default function Checkout() {
  const { items, clearCart, getCartTotal, getShippingCost, getTax, getGrandTotal } = useCartStore();
  const { user, addresses, setAddresses, isAuthenticated } = useUserStore();
  const { createOrderNotification } = useNotificationStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to cart if no items
  if (!items || items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access checkout');
    }
  }, [isAuthenticated]);

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
      setInitialLoading(false);
    };
    
    loadAddresses();
  }, [user, setAddresses]);

  // Preload Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
          image: item.product.images?.[0]?.url || item.product.images?.[0],
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
      
      // For online payment, integrate Razorpay
      await initiateRazorpayPayment(order._id, total);
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateRazorpayPayment = async (orderId, amount) => {
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        // Dynamically load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => processRazorpayPayment(orderId, amount);
        script.onerror = () => {
          toast.error('Failed to load payment gateway. Please try again.');
        };
        document.body.appendChild(script);
        return;
      }
      
      await processRazorpayPayment(orderId, amount);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const processRazorpayPayment = async (orderId, amount) => {
    try {
      // Create Razorpay order
      const paymentResponse = await paymentsAPI.createPaymentOrder({
        orderId,
        amount
      });

      const { razorpayOrderId, key } = paymentResponse.data;

      const options = {
        key: key, // Razorpay key from backend
        amount: amount * 100, // Amount in paisa
        currency: 'INR',
        name: 'HASH',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await paymentsAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.verified) {
              toast.success("Payment successful!");
              
              // Create notification for order confirmation
              createOrderNotification(
                orderId, 
                'confirmed', 
                amount
              );
              
              clearCart();
              navigate('/order-success', { 
                state: { 
                  orderId: orderId,
                  orderNumber: verifyResponse.data.order?.orderNumber || orderId,
                  paymentId: response.razorpay_payment_id,
                  paymentMethod: verifyResponse.data.order?.paymentMethod || 'online',
                  status: 'confirmed',
                  totalAmount: amount
                }
              });
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#8B5CF6' // Hash purple color
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Razorpay payment processing failed:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  // Show initial loading skeleton
  if (initialLoading) {
    return <CheckoutPageSkeleton />;
  }

  if (isLoading && !showAddressForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hash-purple/20 border-t-hash-purple rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="container mx-auto py-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-foreground font-space"
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
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-space">
                  <span className="bg-hash-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-muted-foreground mb-4">No addresses saved. Please add one.</div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {addresses.map((address, idx) => (
                      <motion.label 
                        key={address._id || address.id || idx} 
                        className="flex items-start gap-3 p-3 border-2 border-border rounded-lg cursor-pointer hover:bg-accent transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === (address._id || address.id)}
                          onChange={() => setSelectedAddress(address._id || address.id)}
                          className="mt-1 text-hash-purple focus:ring-hash-purple"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{address.line1}</div>
                          <div className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.zip}</div>
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
                        className="w-full border-2 border-border text-muted-foreground hover:bg-accent"
                      >
                        Add New Address
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-space">
                  <span className="bg-hash-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'online', icon: '💳', label: 'Online Payment (Card/UPI/Net Banking/Wallet)' }
                    ].map((method) => (
                      <motion.label 
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          paymentMethod === method.id 
                            ? 'border-hash-purple bg-hash-purple/5' 
                            : 'border-border hover:border-hash-purple/50 hover:bg-accent'
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
                        <span className="font-medium text-foreground">{method.label}</span>
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
                        className="space-y-4 p-4 bg-accent/50 rounded-lg"
                      >
                        <h4 className="font-semibold text-foreground">Card Details</h4>
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
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm sticky top-6 border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-space">
                  <span className="bg-hash-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
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
                        className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={item.product.images?.[0]?.url || item.product.images?.[0] || 'https://placehold.co/60x60/64748b/fff?text=Item'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/60x60/64748b/fff?text=Item';
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-hash-purple">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Gateway Charges (2%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-foreground">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
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
                      className="w-full py-4 text-lg font-semibold bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 shadow-hash-purple/25"
                    >
                      {isLoading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
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