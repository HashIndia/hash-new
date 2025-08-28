import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useCartStore from "../stores/useCartStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Cart() {
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
            <Button asChild
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
            >
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-slate-900 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Shopping Cart
        </motion.h1>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || "https://placehold.co/150x150/64748b/fff?text=Product"}
                        alt={item.product.name}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{item.product.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.product.description}</p>
                        
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-semibold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Size & Color */}
                        <div className="flex gap-2">
                          {item.size && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-xl font-bold text-slate-900">
                          ₹{item.price * item.quantity}
                        </div>
                        <div className="text-sm text-slate-500">
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
            <Card className="bg-white shadow-lg rounded-2xl overflow-hidden sticky top-4">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${Math.round(shipping)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (18%)</span>
                  <span>₹{Math.round(tax)}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button asChild
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-2 border-slate-200 hover:bg-slate-50 rounded-xl py-3"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 500 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <p className="text-amber-800 text-sm">
                      Add ₹{Math.round(500 - subtotal)} more for free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
