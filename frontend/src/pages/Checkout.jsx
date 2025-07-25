import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import AddressForm from "../components/AddressForm";
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { addresses, setAddresses } = useUserStore();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: ''
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleAddAddress = (address) => {
    setAddresses([...addresses, address]);
    setShowAddressForm(false);
    setSelectedAddress(addresses.length);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (addresses.length === 0) {
      alert('Please add a delivery address!');
      return;
    }
    setOrderPlaced(true);
    clearCart();
    setTimeout(() => {
      window.location.href = '/orders';
    }, 3000);
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="max-w-md w-full mx-6 border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <motion.div 
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold text-green-600 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Order Placed Successfully!
              </motion.h2>
              <motion.p 
                className="text-slate-600 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Thank you for your purchase. You'll receive a confirmation email shortly.
              </motion.p>
              <motion.div 
                className="text-sm text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Redirecting to orders...
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
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
                        key={idx} 
                        className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === idx}
                          onChange={() => setSelectedAddress(idx)}
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
                      <AddressForm onSave={handleAddAddress} />
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
                      { id: 'card', icon: '💳', label: 'Credit/Debit Card' },
                      { id: 'upi', icon: '📱', label: 'UPI Payment' },
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
                          src={item.images?.[0] || 'https://placehold.co/60x60/64748b/fff?text=Item'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-600">Qty: {item.qty}</div>
                        </div>
                        <div className="font-semibold text-slate-900">₹{item.price * item.qty}</div>
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
                      className="w-full py-4 text-lg font-semibold bg-slate-800 hover:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Place Order - ₹{total}
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