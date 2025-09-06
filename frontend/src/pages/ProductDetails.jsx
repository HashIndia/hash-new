import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, Share, Truck, ShieldCheck, RotateCcw, Ruler } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ReviewsList from '../components/ReviewsList';
import SizeChart from '../components/SizeChart';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import SEO from '../components/SEO';
import useProductStore from '../stores/useProductStore';
import useCartStore from '../stores/useCartStore';
import useUserStore from '../stores/useUserStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  // Load product on mount
  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]); // Removed loadProduct from dependencies

  // Try to get product from store or use current product
  const product = currentProduct || products.find(p => p._id === id);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && product && product._id) {
      setIsWishlisted(wishlist.some(item => item._id === product._id));
    }
  }, [wishlist, product?._id]);

  // Helper functions for variant system
  const getAvailableSizes = () => {
    if (!safeProduct?.variants?.length) return [];
    const sizes = safeProduct.variants
      .filter(variant => variant.stock > 0)
      .map(variant => variant.size);
    const uniqueSizes = [...new Set(sizes)];
    return uniqueSizes;
  };

  const getAvailableColors = () => {
    if (!safeProduct?.variants?.length) return [];
    const colors = safeProduct.variants
      .filter(variant => variant.stock > 0)
      .map(variant => variant.color);
    const uniqueColors = colors.reduce((acc, color) => {
      const exists = acc.find(c => c.hex === color.hex);
      if (!exists) acc.push(color);
      return acc;
    }, []);
    return uniqueColors;
  };

  const getSizesForColor = (colorHex) => {
    if (!safeProduct?.variants?.length) return [];
    return safeProduct.variants
      .filter(variant => variant.color.hex === colorHex && variant.stock > 0)
      .map(variant => variant.size);
  };

  const getColorsForSize = (size) => {
    if (!safeProduct?.variants?.length) return [];
    const colors = safeProduct.variants
      .filter(variant => variant.size === size && variant.stock > 0)
      .map(variant => variant.color);
    return colors.reduce((acc, color) => {
      const exists = acc.find(c => c.hex === color.hex);
      if (!exists) acc.push(color);
      return acc;
    }, []);
  };

  const getVariantStock = (size, colorHex) => {
    if (!safeProduct?.variants?.length) return 0;
    const variant = safeProduct.variants.find(v => 
      v.size === size && v.color.hex === colorHex
    );
    return variant ? variant.stock : 0;
  };

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
    variants: product.variants || [],
    sizeChart: product.sizeChart || { hasChart: false },
    brand: product.brand || 'Unknown Brand',
    reviewStats: product.reviewStats || { averageRating: 0, totalReviews: 0 },
    features: product.features || []
  } : null;

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!safeProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')} className="bg-hash-purple hover:bg-hash-purple/90 text-white">
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
    // Check if product has variants
    if (safeProduct.variants && safeProduct.variants.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size');
        return;
      }
      
      if (!selectedColor) {
        toast.error('Please select a color');
        return;
      }
      
      // Check stock for selected variant
      const variantStock = getVariantStock(selectedSize, selectedColor);
      if (variantStock === 0) {
        toast.error('Selected combination is out of stock');
        return;
      }
      
      if (quantity > variantStock) {
        toast.error(`Only ${variantStock} items available for this combination`);
        return;
      }
    } else if (safeProduct.stock === 0) {
      toast.error('This product is out of stock');
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
        // Sharing failed, fall back to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('Product link copied to clipboard!');
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
      <SEO 
        title={`${safeProduct.name} - Premium ${safeProduct.category} | HASH India`}
        description={`Buy ${safeProduct.name} online at HASH India. ${safeProduct.description || 'Premium quality fashion item'} ₹${safeProduct.price}. Fast delivery, easy returns, best quality guaranteed.`}
        keywords={`${safeProduct.name}, ${safeProduct.category}, HASH India, buy ${safeProduct.category} online, premium fashion, trendy ${safeProduct.category}, fashion shopping`}
        url={`https://hashindia.com/product/${safeProduct._id}`}
        canonicalUrl={`https://hashindia.com/product/${safeProduct._id}`}
        image={safeProduct.images?.[0]?.url || safeProduct.images?.[0] || 'https://hashindia.com/hash-logo-text.jpg'}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": safeProduct.name,
          "description": safeProduct.description,
          "image": safeProduct.images?.map(img => img.url || img) || ['https://hashindia.com/hash-logo-text.jpg'],
          "brand": {
            "@type": "Brand",
            "name": "HASH India"
          },
          "category": safeProduct.category,
          "offers": {
            "@type": "Offer",
            "price": safeProduct.price,
            "priceCurrency": "INR",
            "availability": safeProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "HASH India"
            }
          },
          "aggregateRating": safeProduct.reviewStats?.totalReviews > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": safeProduct.reviewStats.averageRating || 5,
            "reviewCount": safeProduct.reviewStats.totalReviews || 1
          } : undefined
        }}
      />
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
              className="relative overflow-hidden rounded-2xl border border-border shadow-xl"
            >
              {/* Blurred background version of the image */}
              <div 
                className="absolute inset-0 opacity-20 blur-xl scale-110"
                style={{
                  backgroundImage: `url(${safeProduct.images[activeImage]?.url || '/placeholder-image.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* Gradient overlay for better contrast */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.6) 50%, rgba(226,232,240,0.8) 100%)'
                }}
              />
              
              {/* Main product image */}
              <img
                src={safeProduct.images[activeImage]?.url || '/placeholder-image.jpg'}
                alt={safeProduct.name}
                className="relative w-full h-96 lg:h-[500px] object-contain z-10"
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))'
                }}
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
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-hash-purple' : 'border-border'
                    }`}
                  >
                    {/* Blurred background for thumbnail */}
                    <div 
                      className="absolute inset-0 opacity-30 blur-sm scale-110"
                      style={{
                        backgroundImage: `url(${image.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(248,250,252,0.7) 0%, rgba(241,245,249,0.5) 100%)'
                      }}
                    />
                    
                    {/* Thumbnail image */}
                    <img
                      src={image.url}
                      alt={`${safeProduct.name} ${index + 1}`}
                      className="relative w-full h-full object-contain z-10"
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
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(safeProduct.reviewStats.averageRating) 
                          ? 'fill-current' 
                          : 'fill-none'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {safeProduct.reviewStats.averageRating > 0 
                    ? `${safeProduct.reviewStats.averageRating}/5 (${safeProduct.reviewStats.totalReviews} reviews)`
                    : 'No reviews yet'
                  }
                </span>
              </div>

              {/* Description */}
              <p className="text-foreground leading-relaxed mb-6">
                {safeProduct.description}
              </p>
            </motion.div>

            {/* Size Selection */}
            {safeProduct.variants && safeProduct.variants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Size</h3>
                  {safeProduct.sizeChart?.hasChart && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSizeChart(true)}
                      className="text-hash-purple hover:text-hash-purple/80"
                    >
                      <Ruler className="w-4 h-4 mr-1" />
                      Size Chart
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {getAvailableSizes().map((size) => {
                    const availableColors = getColorsForSize(size);
                    const isAvailable = availableColors.length > 0;
                    const isSelected = selectedSize === size;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSize(size);
                            // Reset color selection if current color is not available for this size
                            if (selectedColor && !availableColors.find(c => c.hex === selectedColor)) {
                              setSelectedColor('');
                            }
                          }
                        }}
                        disabled={!isAvailable}
                        className={`
                          px-3 py-2 border-2 rounded-lg transition-all text-sm font-medium
                          ${isSelected
                            ? 'border-hash-purple bg-hash-purple text-white'
                            : isAvailable
                            ? 'border-border hover:border-hash-purple/50 text-foreground'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <div>{size}</div>
                        <div className="text-xs opacity-75">
                          {isAvailable ? `${availableColors.length} color${availableColors.length > 1 ? 's' : ''}` : 'Out'}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedSize && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected size: {selectedSize}
                  </div>
                )}
              </div>
            )}

            {/* Color Selection */}
            {safeProduct.variants && safeProduct.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {(selectedSize ? getColorsForSize(selectedSize) : getAvailableColors()).map((color) => {
                    const isSelected = selectedColor === color.hex;
                    const isAvailable = selectedSize ? 
                      getSizesForColor(color.hex).includes(selectedSize) : 
                      getSizesForColor(color.hex).length > 0;
                    
                    return (
                      <button
                        key={color.hex}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedColor(color.hex);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`
                          flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all
                          ${isSelected
                            ? 'border-hash-purple bg-hash-purple text-white'
                            : isAvailable
                            ? 'border-border hover:border-hash-purple/50 text-foreground'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                        {selectedSize && (
                          <span className="text-xs opacity-75">
                            ({getVariantStock(selectedSize, color.hex)} available)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedColor && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected color: {getAvailableColors().find(c => c.hex === selectedColor)?.name || 'Color'}
                    {selectedSize && selectedColor && (
                      <span> - {getVariantStock(selectedSize, selectedColor)} available</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {safeProduct.variants && safeProduct.variants.length > 0 ? (
                selectedSize && selectedColor ? (
                  (() => {
                    const stock = getVariantStock(selectedSize, selectedColor);
                    return (
                      <>
                        <div className={`w-3 h-3 rounded-full ${stock > 0 ? 'bg-hash-green' : 'bg-destructive'}`}></div>
                        <span className={`text-sm font-medium ${stock > 0 ? 'text-hash-green' : 'text-destructive'}`}>
                          {stock > 0 ? `${stock} items in stock` : 'Selected combination out of stock'}
                        </span>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {!selectedSize ? 'Select a size and color to check availability' : 'Select a color to check availability'}
                    </span>
                  </>
                )
              ) : (
                <>
                  <div className={`w-3 h-3 rounded-full ${safeProduct.stock > 0 ? 'bg-hash-green' : 'bg-destructive'}`}></div>
                  <span className={`text-sm font-medium ${safeProduct.stock > 0 ? 'text-hash-green' : 'text-destructive'}`}>
                    {safeProduct.stock > 0 ? `${safeProduct.stock} items in stock` : 'Out of stock'}
                  </span>
                </>
              )}
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
                className="flex-1 bg-hash-purple hover:bg-hash-purple/90 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Truck className="h-5 w-5 text-hash-purple" />
                <span className="text-sm text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-hash-purple" />
                <span className="text-sm text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-hash-purple" />
                <span className="text-sm text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-foreground font-space">
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ReviewsList 
                productId={id} 
                onReviewsLoaded={setTotalReviews}
              />
            </CardContent>
          </Card>
        </div>

        {/* Size Chart Modal */}
        <SizeChart
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          product={safeProduct}
        />
      </div>
    </div>
  );
}