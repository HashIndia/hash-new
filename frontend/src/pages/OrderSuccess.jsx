import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { paymentsAPI } from '../services/api';
import useNotificationStore from '../stores/useNotificationStore';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrderNotification } = useNotificationStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get('order_id');
  const orderData = location.state; // Order data passed from checkout

  useEffect(() => {
    if (orderData) {
      // Use data passed from checkout (successful payment)
      setIsVerifying(false);
      setPaymentStatus('SUCCESS');
      setOrderDetails({
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber || orderData.orderId,
        paymentMethod: orderData.paymentMethod,
        status: orderData.status,
        totalAmount: orderData.totalAmount
      });
    } else if (orderId) {
      // Fallback for direct URL access
      setIsVerifying(false);
      setPaymentStatus('SUCCESS');
      setOrderDetails({
        orderId: orderId,
        orderNumber: orderId,
        paymentMethod: 'online'
      });
    } else {
      setIsVerifying(false);
      setPaymentStatus('failed');
    }
  }, [orderId, orderData]);

  const getStatusIcon = () => {
    if (isVerifying) return <Loader className="w-16 h-16 animate-spin text-hash-blue" />;
    if (paymentStatus === 'SUCCESS') return <CheckCircle className="w-16 h-16 text-hash-green" />;
    return <XCircle className="w-16 h-16 text-red-500" />;
  };

  const getStatusMessage = () => {
    if (isVerifying) return 'Verifying your payment...';
    if (paymentStatus === 'SUCCESS') {
      return 'Payment Successful!';
    }
    return 'Payment Failed';
  };

  const getStatusDescription = () => {
    if (isVerifying) return 'Please wait while we confirm your payment.';
    if (paymentStatus === 'SUCCESS') {
      return 'Your order has been confirmed and will be processed shortly.';
    }
    return 'Your payment could not be processed. Please try again or contact support.';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-hash-purple/10 via-hash-blue/10 to-hash-pink/10" />
      
      {/* Floating particles for success animation */}
      {paymentStatus === 'SUCCESS' && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-hash-green/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 20,
                opacity: 0 
              }}
              animate={{ 
                y: -20, 
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          ))}
        </>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        <Card className="shadow-2xl bg-card/90 backdrop-blur-sm border border-border overflow-hidden">
          {/* Header with gradient */}
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple text-white relative">
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Success sparkles */}
            {paymentStatus === 'SUCCESS' && (
              <>
                <motion.div 
                  className="absolute top-4 left-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
                <motion.div 
                  className="absolute top-4 right-4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              </>
            )}
            
            <div className="relative z-10">
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.6 }}
              >
                {getStatusIcon()}
              </motion.div>
              <CardTitle className="text-2xl font-bold font-space">
                {getStatusMessage()}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 p-6">
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {getStatusDescription()}
            </motion.p>

            {orderDetails && (
              <motion.div 
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-hash-green rounded-full"></div>
                  Order Details
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Order ID:</span> {orderDetails.orderId || orderDetails._id}
                  </p>
                  {orderDetails.orderNumber && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Order Number:</span> {orderDetails.orderNumber}
                    </p>
                  )}
                  {orderDetails.totalAmount && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Total Amount:</span> 
                      <span className="text-hash-green font-bold"> ₹{orderDetails.totalAmount}</span>
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Payment Method:</span> {
                      orderDetails.paymentMethod === 'upi' ? 'UPI' :
                      orderDetails.paymentMethod === 'card' ? 'Card' :
                      orderDetails.paymentMethod === 'netbanking' ? 'Net Banking' :
                      orderDetails.paymentMethod === 'wallet' ? 'Wallet' :
                      orderDetails.paymentMethod === 'emi' ? 'EMI' :
                      'Online Payment'
                    }
                  </p>
                  {orderDetails.status && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Status:</span> 
                      <span className="ml-1 px-2 py-1 bg-hash-green/10 text-hash-green rounded-full text-xs font-medium">
                        {orderDetails.status}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {paymentStatus === 'SUCCESS' && (
                <Button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-gradient-to-r from-hash-green to-hash-blue hover:from-hash-green/90 hover:to-hash-blue/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View My Orders
                </Button>
              )}
              
              {paymentStatus === 'FAILED' && (
                <Button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Try Again
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full py-3 font-medium hover:bg-hash-purple/10 hover:border-hash-purple/50 hover:text-hash-purple transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
