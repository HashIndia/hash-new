import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingCart,
  Plus,
  Check,
  Zap,
  TrendingUp,
  Award,
  Truck
} from 'lucide-react';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const addToCart = useCartStore(state => state.addItem);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addToCart(product);
    setIsAddingToCart(false);
    setJustAdded(true);
    
    // Reset success state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100);
  const isNewProduct = true; // In real app, this would come from product data
  const isBestSeller = Math.random() > 0.7; // Mock bestseller logic

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 rounded-2xl">
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
              <motion.img
                src={product.images[0] || "https://placehold.co/400x500/64748b/fff?text=Product"}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <span className="badge bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md">
                    {discountPercentage}% OFF
                  </span>
                )}
                {isNewProduct && (
                  <span className="badge bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md">
                    New
                  </span>
                )}
                {isBestSeller && (
                  <span className="badge bg-purple-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Best Seller
                  </span>
                )}
              </div>
            </div>
            
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start h-full">
                <div className="flex-1">
                  <Link to={`/product/${product.id}`}>
                    <motion.h3 
                      className="font-bold text-xl text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {product.name}
                    </motion.h3>
                  </Link>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
                    {discountPercentage > 0 && (
                      <>
                        <div className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.3)}</div>
                        <span className="badge badge-success text-xs">
                          Save ₹{Math.round(product.price * 0.3)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">(4.9)</span>
                    <span className="text-xs text-gray-500">• 256 reviews</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600 font-medium">Available sizes:</span>
                    {product.sizes.slice(0, 4).map((size) => (
                      <span key={size} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-xs text-gray-500 font-medium">+{product.sizes.length - 4} more</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Free delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Trending</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 ml-6">
                  <div className="flex gap-2">
                    <motion.button 
                      onClick={handleWishlist}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md ${
                        isWishlisted 
                          ? 'bg-red-50 text-red-500 border border-red-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </motion.button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all shadow-md group"
                    >
                      <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </Link>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || justAdded}
                      className={`btn-gradient px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                        justAdded ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isAddingToCart ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <div className="spinner w-4 h-4 border-white" />
                            Adding...
                          </motion.div>
                        ) : justAdded ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Added!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="default"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border-0 rounded-2xl">
        <div className="relative overflow-hidden">
          <Link to={`/product/${product.id}`}>
            <motion.img
              src={product.images[0] || "https://placehold.co/400x500/64748b/fff?text=Product"}
              alt={product.name}
              className="w-full h-80 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </Link>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          
          {/* Actions */}
          <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <motion.button 
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all ${
                isWishlisted 
                  ? 'bg-red-50 text-red-500 border border-red-200' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            <Link 
              to={`/product/${product.id}`}
              className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group/btn"
            >
              <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-600" />
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <motion.span 
                className="bg-red-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {discountPercentage}% OFF
              </motion.span>
            )}
            {isNewProduct && (
              <motion.span 
                className="bg-green-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Zap className="w-3 h-3" />
                New
              </motion.span>
            )}
            {isBestSeller && (
              <motion.span 
                className="bg-purple-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Award className="w-3 h-3" />
                Bestseller
              </motion.span>
            )}
          </div>
        </div>
        
        <CardContent className="p-8">
          <Link to={`/product/${product.id}`}>
            <motion.h3 
              className="font-bold text-xl text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              {product.name}
            </motion.h3>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
            {discountPercentage > 0 && (
              <>
                <div className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.3)}</div>
                <span className="badge badge-success text-xs">
                  Save ₹{Math.round(product.price * 0.3)}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">(4.9)</span>
            <span className="text-xs text-gray-500">• 256 reviews</span>
          </div>
          
          <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {product.sizes.slice(0, 3).map((size) => (
                <span key={size} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-xs text-gray-500 font-medium">+{product.sizes.length - 3}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Free delivery</span>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || justAdded}
              className={`w-full btn-gradient py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all ${
                justAdded ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              <AnimatePresence mode="wait">
                {isAddingToCart ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <div className="spinner w-4 h-4 border-white" />
                    Adding to Cart...
                  </motion.div>
                ) : justAdded ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 