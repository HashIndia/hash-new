import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useCartStore from "../stores/useCartStore";
import { motion } from "framer-motion";

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Shopping Cart</h1>
          <p className="text-slate-600">Review your items and proceed to checkout</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            variants={itemVariants}
          >
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <motion.img
                        src={item.images?.[0] || 'https://placehold.co/120x120/64748b/fff?text=Item'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.name}</h3>
                        <div className="text-2xl font-bold text-slate-800 mb-3">
                          ₹{item.price}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-semibold text-slate-900">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">
                          ₹{item.price * item.qty}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.qty} × ₹{item.price}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">
                      💡 Add ₹{999 - subtotal} more to get free shipping!
                    </div>
                  )}
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-slate-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button asChild className="w-full" size="lg">
                        <a href="/checkout">Proceed to Checkout</a>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button asChild variant="outline" className="w-full">
                        <a href="/shop">Continue Shopping</a>
                      </Button>
                    </motion.div>
                  </div>
                  
                  {items.length > 1 && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 