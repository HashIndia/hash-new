import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, Share, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import useProductStore from '../stores/useProductStore';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../stores/useUserStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing quality! Fits perfectly and looks exactly like the pictures.',
    date: '2024-01-15'
  },
  {
    id: 2,
    user: 'Mike Chen',
    rating: 4,
    comment: 'Great product, fast shipping. Very satisfied with the purchase.',
    date: '2024-01-10'
  },
  {
    id: 3,
    user: 'Emma Wilson',
    rating: 5,
    comment: 'Excellent quality and comfort. Highly recommend!',
    date: '2024-01-08'
  }
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, currentProduct, loadProduct, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { wishlist, setWishlist, isAuthenticated } = useUserStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load product on mount
  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id, loadProduct]);

  // Try to get product from store or use current product
  const product = currentProduct || products.find(p => p._id === id);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && product) {
      setIsWishlisted(wishlist.some(item => item._id === product._id));
    }
  }, [wishlist, product]);

  // Default/safe product structure
  const safeProduct = product ? {
    _id: product._id,
    name: product.name || 'Product Name',
    description: product.description || 'No description available',
    price: product.price || 0,
    salePrice: product.salePrice || product.price || 0,
    images: Array.isArray(product.images) ? product.images : 
             product.images ? [product.images] : 
             [{ url: '/placeholder-image.jpg', isPrimary: true }],
    stock: product.stock || 0,
    category: product.category || 'General',
    sizes: product.sizes || [],
    colors: product.colors || [],
    brand: product.brand || 'Unknown Brand',
    reviews: product.reviews || [],
    features: product.features || []
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-hash-purple mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!safeProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleWishlist = async () => {
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

  const handleAddToCart = () => {
    if (safeProduct.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (safeProduct.sizes && safeProduct.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (safeProduct.colors && safeProduct.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart(safeProduct, quantity, {
      size: selectedSize,
      color: selectedColor
    });

    toast.success('Added to cart successfully!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: safeProduct.name,
          text: safeProduct.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const currentPrice = safeProduct.salePrice || safeProduct.price;
  const originalPrice = safeProduct.salePrice ? safeProduct.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 hover:bg-accent text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-xl"
            >
              <img
                src={safeProduct.images[activeImage]?.url || '/placeholder-image.jpg'}
                alt={safeProduct.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{discount}%
                </Badge>
              )}
              <Button
                onClick={handleWishlist}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm hover:bg-card border border-border"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-hash-pink text-hash-pink' : 'text-muted-foreground'}`} />
              </Button>
            </motion.div>

            {/* Thumbnail Images */}
            {safeProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {safeProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-hash-purple' : 'border-border'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${safeProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-2 bg-hash-purple/10 text-hash-purple border-hash-purple/20">
                {safeProduct.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 font-space">
                {safeProduct.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {safeProduct.brand}
              </p>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-hash-purple">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground">({mockReviews.length} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-foreground leading-relaxed mb-6">
                {safeProduct.description}
              </p>
            </motion.div>

            {/* Size Selection */}
            {safeProduct.sizes && safeProduct.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {safeProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedSize === size
                          ? 'border-hash-purple bg-hash-purple text-white'
                          : 'border-border hover:border-hash-purple/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {safeProduct.colors && safeProduct.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {safeProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        selectedColor === color
                          ? 'border-hash-purple bg-hash-purple text-white'
                          : 'border-border hover:border-hash-purple/50 text-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${safeProduct.stock > 0 ? 'bg-hash-green' : 'bg-destructive'}`}></div>
              <span className={`text-sm font-medium ${safeProduct.stock > 0 ? 'text-hash-green' : 'text-destructive'}`}>
                {safeProduct.stock > 0 ? `${safeProduct.stock} items in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  -
                </button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center bg-background border-border"
                  min="1"
                  max={safeProduct.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(safeProduct.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-muted-foreground">Max: {safeProduct.stock}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={safeProduct.stock === 0}
                className="flex-1 bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-hash-purple/25"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {safeProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="px-6 py-4 rounded-xl border-2 border-border hover:border-hash-purple transition-all duration-300"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-hash-green" />
                <span className="text-sm text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-hash-blue" />
                <span className="text-sm text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-hash-orange" />
                <span className="text-sm text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground font-space">
                Customer Reviews ({mockReviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-hash-purple/10 rounded-full flex items-center justify-center font-semibold text-hash-purple">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{review.user}</div>
                          <div className="flex text-hash-orange text-sm">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}