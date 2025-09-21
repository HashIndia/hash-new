import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../utils/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
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
  const addToCart = useCartStore(state => state.addToCart);
  const { wishlist, setWishlist, isAuthenticated } = useUserStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && product) {
      setIsWishlisted(wishlist.some(item => item._id === product._id));
    }
  }, [wishlist, product]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addToCart(product, 1);
    setIsAddingToCart(false);
    setJustAdded(true);
    
    // Reset success state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await authAPI.removeFromWishlist(product._id);
        setWishlist(wishlist.filter(item => item._id !== product._id));
        toast.success('Removed from wishlist');
      } else {
        await authAPI.addToWishlist(product._id);
        setWishlist([...wishlist, product]);
        toast.success('Added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Calculate discount and pricing
  const currentPrice = product.salePrice && product.saleStartDate && product.saleEndDate ? 
    (new Date() >= new Date(product.saleStartDate) && new Date() <= new Date(product.saleEndDate) ? product.salePrice : product.price) : 
    product.price;
  
  const discountPercentage = product.salePrice && currentPrice < product.price ? 
    Math.round(((product.price - currentPrice) / product.price) * 100) : 0;
  
  const isNewProduct = product.isFeatures || (new Date() - new Date(product.createdAt)) < (7 * 24 * 60 * 60 * 1000); // 7 days
  const isBestSeller = product.isFeatures;

  // Get primary image or fallback
  const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                      product.images?.[0]?.url || 
                      "https://placehold.co/400x500/64748b/fff?text=Product";

  // Mock data for demo purposes (replace with real data when available)
  const mockRating = 4.9;
  const mockReviews = 256;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border border-border rounded-2xl">
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
              <motion.img
                src={primaryImage}
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
                  <Link to={`/product/${product._id}`}>
                    <motion.h3 
                      className="font-bold text-xl text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {product.name}
                    </motion.h3>
                  </Link>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-gray-900">₹{currentPrice}</div>
                    {discountPercentage > 0 && (
                      <>
                        <div className="text-lg text-gray-500 line-through">₹{product.price}</div>
                        <span className="badge badge-success text-xs">
                          Save ₹{product.price - currentPrice}
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
                    <span className="text-sm text-gray-600 font-medium">({mockRating})</span>
                    <span className="text-xs text-gray-500">• {mockReviews} reviews</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600 font-medium">Category:</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                      {product.category}
                    </span>
                    {product.brand && (
                      <>
                        <span className="text-sm text-gray-600 font-medium">Brand:</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                          {product.brand}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Free delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Stock: {product.stock}</span>
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
                      to={`/product/${product._id}`}
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
      <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-hash-purple/20 transition-all duration-300 bg-card border border-border hover:border-hash-purple/30 rounded-2xl">
        <div className="relative overflow-hidden">
          <Link to={`/product/${product._id}`}>
            <motion.img
              src={primaryImage}
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
                  ? 'bg-hash-pink/20 text-hash-pink border border-hash-pink/30' 
                  : 'bg-card hover:bg-hash-purple/10 text-foreground hover:text-hash-purple'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            <Link 
              to={`/product/${product._id}`}
              className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-hash-purple/20 transition-colors group/btn border border-border"
            >
              <Eye className="w-5 h-5 text-foreground group-hover/btn:text-hash-purple" />
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
          <Link to={`/product/${product._id}`}>
            <motion.h3 
              className="font-bold text-xl text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              {product.name}
            </motion.h3>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl font-bold text-gray-900">₹{currentPrice}</div>
            {discountPercentage > 0 && (
              <>
                <div className="text-lg text-gray-500 line-through">₹{product.price}</div>
                <span className="badge badge-success text-xs">
                  Save ₹{product.price - currentPrice}
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
            <span className="text-sm text-gray-600 font-medium">({mockRating})</span>
            <span className="text-xs text-gray-500">• {mockReviews} reviews</span>
          </div>
          
          <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Stock: {product.stock}</span>
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