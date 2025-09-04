import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/useUserStore";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const { isAuthenticated, user } = useUserStore();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getShippingCost,
    getTax,
    getGrandTotal
  } = useCartStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your cart');
    }
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const subtotal = getCartTotal();
  const shipping = getShippingCost();
  const tax = getTax();
  const total = getGrandTotal();

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-foreground mb-4 font-space">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild
              size="lg" 
              className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white px-8 py-3 rounded-xl shadow-lg shadow-hash-purple/25"
            >
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center font-space"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Shopping Cart
        </motion.h1>

        <motion.div 
          className="grid gap-6 lg:grid-cols-3 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Cart Items */}
          <motion.div className="lg:col-span-2 space-y-4" variants={itemVariants}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        src={item.product.images?.[0]?.url || item.product.images?.[0] || "https://placehold.co/150x150/64748b/fff?text=Product"}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x150/64748b/fff?text=Product";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-foreground">{item.product.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 font-bold text-xl self-center sm:self-start"
                        >
                          ×
                        </button>
                      </div>
                      
                      <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{item.product.description}</p>
                        
                      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 md:px-3 py-1 bg-accent hover:bg-accent/80 text-foreground transition-colors text-sm md:text-base"
                          >
                            -
                          </button>
                          <span className="px-3 md:px-4 py-1 font-semibold text-foreground text-sm md:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 md:px-3 py-1 bg-accent hover:bg-accent/80 text-foreground transition-colors text-sm md:text-base"
                          >
                            +
                          </button>
                        </div>

                        {/* Size & Color */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {item.size && (
                            <span className="px-2 md:px-3 py-1 bg-hash-blue/10 text-hash-blue rounded-lg text-xs md:text-sm font-medium border border-hash-blue/20">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-2 md:px-3 py-1 bg-hash-green/10 text-hash-green rounded-lg text-xs md:text-sm font-medium border border-hash-green/20">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <div className="text-lg md:text-xl font-bold text-hash-purple text-center sm:text-left">
                          ₹{item.price * item.quantity}
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground text-center sm:text-right">
                          {item.quantity} × ₹{item.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card shadow-lg rounded-2xl overflow-hidden sticky top-4 border border-border">
              <CardHeader className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple text-white">
                <CardTitle className="text-xl font-space">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${Math.round(shipping)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Gateway Charges (2%)</span>
                  <span>₹{Math.round(tax)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button asChild
                    size="lg" 
                    className="w-full bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all shadow-hash-purple/25"
                  >
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-2 border-border hover:bg-accent rounded-xl py-3"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
