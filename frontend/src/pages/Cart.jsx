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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-foreground mb-8 text-center font-space"
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
                className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border"
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
                        <h3 className="text-lg font-semibold text-foreground">{item.product.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.product.description}</p>
                        
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 bg-accent hover:bg-accent/80 text-foreground transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-semibold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-accent hover:bg-accent/80 text-foreground transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Size & Color */}
                        <div className="flex gap-2">
                          {item.size && (
                            <span className="px-3 py-1 bg-hash-blue/10 text-hash-blue rounded-lg text-sm font-medium border border-hash-blue/20">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-3 py-1 bg-hash-green/10 text-hash-green rounded-lg text-sm font-medium border border-hash-green/20">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-xl font-bold text-hash-purple">
                          ${item.price * item.quantity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} × ${item.price}
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
                  <span>${Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${Math.round(shipping)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (18%)</span>
                  <span>${Math.round(tax)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>${Math.round(total)}</span>
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

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                  <div className="bg-hash-orange/10 border border-hash-orange/20 rounded-xl p-3 text-center">
                    <p className="text-hash-orange text-sm">
                      Add ${Math.round(50 - subtotal)} more for free shipping!
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
