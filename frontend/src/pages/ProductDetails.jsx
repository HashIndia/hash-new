import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, Share, Truck, ShieldCheck, RotateCcw, Ruler, ChevronDown, Plus, Minus, MapPin, Clock, Award, Users } from 'lucide-react';
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
import useUserStore from '../utils/useUserStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import PoloVarsityForm from '@/components/PoloVarsityForm';

export default function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { user } = useUserStore();
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
  const [showPoloVarsityForm, setShowPoloVarsityForm] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [remainingOfferUnits, setRemainingOfferUnits] = useState(0);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  
  // Available sizes in order
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Oversized'];

  // Load product when component mounts or ID changes
  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id, loadProduct]);

  // Update remaining offer units when product changes
  useEffect(() => {
    if (currentProduct?.limitedOffer?.isActive) {
      const remaining = (currentProduct.limitedOffer?.maxUnits || 0) - (currentProduct.limitedOffer?.unitsSold || 0);
      setRemainingOfferUnits(Math.max(0, remaining));
    } else {
      setRemainingOfferUnits(0);
    }
  }, [currentProduct]);

  // Helper functions for limited offer

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && currentProduct && currentProduct._id) {
      setIsWishlisted(wishlist.some(item => item._id === currentProduct._id));
    }
  }, [wishlist, currentProduct?._id]);

  // Helper functions for variant system
  // Helper function to get stock status and warning
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { status: 'out', message: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (stock < 5) {
      return { status: 'critical', message: `Only ${stock} left in stock!`, color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (stock < 10) {
      return { status: 'low', message: `Only ${stock} left in stock`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else {
      return { status: 'available', message: `${stock} available`, color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

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
      .map(variant => variant.color)
      .filter(color => color); // Filter out any null/undefined colors
    const uniqueColors = colors.reduce((acc, color) => {
      const exists = acc.find(c => c?.hex === color?.hex);
      if (!exists && color?.hex) acc.push(color);
      return acc;
    }, []);
    return uniqueColors;
  };

  const getSizesForColor = (colorHex) => {
    if (!safeProduct?.variants?.length) return [];
    return safeProduct.variants
      .filter(variant => variant.color?.hex === colorHex && variant.stock > 0)
      .map(variant => variant.size);
  };

  const getColorsForSize = (size) => {
    if (!safeProduct?.variants?.length) return [];
    const colors = safeProduct.variants
      .filter(variant => variant.size === size && variant.stock > 0)
      .map(variant => variant.color)
      .filter(color => color); // Filter out any null/undefined colors
    return colors.reduce((acc, color) => {
      const exists = acc.find(c => c?.hex === color?.hex);
      if (!exists && color?.hex) acc.push(color);
      return acc;
    }, []);
  };

  const getVariantStock = (size, colorHex) => {
    if (!safeProduct?.variants?.length) return 0;
    const variant = safeProduct.variants.find(v => 
      v.size === size && v.color?.hex === colorHex
    );
    return variant ? variant.stock : 0;
  };

  const getSelectedVariant = () => {
    if (!safeProduct?.variants?.length || !selectedSize || !selectedColor) return null;
    return safeProduct.variants.find(v => 
      v.size === selectedSize && v.color?.hex === selectedColor
    );
  };

  // Discount calculation helpers
  const isLimitedOfferActive = () => {
    return safeProduct?.limitedOffer?.isActive && remainingOfferUnits > 0;
  };

  const isSaleActive = () => {
    if (!safeProduct?.saleStartDate || !safeProduct?.saleEndDate) return false;
    const now = new Date();
    const saleStart = new Date(safeProduct.saleStartDate);
    const saleEnd = new Date(safeProduct.saleEndDate);
    return now >= saleStart && now <= saleEnd;
  };

  const getDiscountedPrice = () => {
    if (isLimitedOfferActive()) {
      return safeProduct.limitedOffer?.specialPrice;
    }
    if (isSaleActive() && safeProduct.salePrice < safeProduct.price) {
      return safeProduct.salePrice;
    }
    return safeProduct.price;
  };

  const getDiscountPercentage = () => {
    const discountedPrice = getDiscountedPrice();
    if (discountedPrice < safeProduct.price) {
      return Math.round(((safeProduct.price - discountedPrice) / safeProduct.price) * 100);
    }
    return 0;
  };

  const canAddToCart = () => {
    if (safeProduct?.variants?.length > 0) {
      return selectedSize && selectedColor && getVariantStock(selectedSize, selectedColor) > 0;
    }
    return safeProduct?.stock > 0;
  };

  // Default/safe product structure
  const safeProduct = currentProduct ? {
    _id: currentProduct._id,
    name: currentProduct.name || 'Product Name',
    description: currentProduct.description || 'No description available',
    price: currentProduct.price || 0,
    salePrice: currentProduct.salePrice || currentProduct.price || 0,
    images: Array.isArray(currentProduct.images) ? currentProduct.images : 
             currentProduct.images ? [currentProduct.images] : 
             [{ url: '/placeholder-image.jpg', isPrimary: true }],
    stock: currentProduct.stock || 0,
    category: currentProduct.category || 'General',
    variants: currentProduct.variants || [],
    sizeChart: currentProduct.sizeChart || { hasChart: true },
    brand: currentProduct.brand || 'Unknown Brand',
    reviewStats: currentProduct.reviewStats || { averageRating: 0, totalReviews: 0 },
    features: currentProduct.features || [],
    limitedOffer: currentProduct.limitedOffer || null,
    saleStartDate: currentProduct.saleStartDate || null,
    saleEndDate: currentProduct.saleEndDate || null
  } : null;

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!safeProduct) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Product Not Found</h2>
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

    if (!currentProduct?._id) {
      toast.error('Product not found');
      return;
    }

    try {
      console.log('Wishlist action:', { isWishlisted, productId: currentProduct._id, isAuthenticated });
      
      if (isWishlisted) {
        await authAPI.removeFromWishlist(currentProduct._id);
        setWishlist(wishlist.filter(item => item._id !== currentProduct._id));
        toast.success('Removed from wishlist');
      } else {
        await authAPI.addToWishlist(currentProduct._id);
        setWishlist([...wishlist, currentProduct]);
        toast.success('Added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Wishlist error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const maxStock = selectedSize && selectedColor ? getVariantStock(selectedSize, selectedColor) : safeProduct.stock;
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      setQuantity(maxStock);
    } else if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
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
        toast.error(`Only ${variantStock} items available for this combination. Please reduce quantity.`);
        return;
      }
    } else {
      // For products without variants, check general stock
      if (safeProduct.stock === 0) {
        toast.error('This product is out of stock');
        return;
      }

      if (quantity > safeProduct.stock) {
        toast.error(`Only ${safeProduct.stock} items available. Please reduce quantity.`);
        return;
      }
    }

    // All validations passed, proceed with adding to cart
    if (safeProduct.brand === 'Polo' || safeProduct.brand === 'Varsity') {
      setShowPoloVarsityForm(true);
    } else {
      addToCart(safeProduct, quantity, {
        size: selectedSize,
        color: selectedColor,
        variantId: getSelectedVariant()?._id,
      });
      toast.success('Added to cart successfully!');
    }
  };

  const handlePoloVarsityFormSubmit = (formData) => {
    addToCart(safeProduct, quantity, {
      size: selectedSize,
      color: selectedColor,
      variantId: getSelectedVariant()?._id,
      customFields: formData,
    });
    toast.success('Product added to cart!');
    setShowPoloVarsityForm(false);
  };

  const handlePoloVarsityFormCancel = () => {
    setShowPoloVarsityForm(false);
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

  const currentPrice = getDiscountedPrice();
  const originalPrice = safeProduct.price;
  const discount = getDiscountPercentage();

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${safeProduct.name} - Premium ${safeProduct.category} | HASH India`}
        description={`Buy ${safeProduct.name} online at HASH India. ${safeProduct.description || 'Premium quality fashion item'} ₹${safeProduct.price}. Fast delivery, easy returns, best quality guaranteed.`}
        keywords={`${safeProduct.name}, ${safeProduct.category}, HASH India, buy ${safeProduct.category} online, premium fashion, trendy ${safeProduct.category}, fashion shopping`}
        url={`https://hashindia.com/product/${safeProduct._id}`}
        canonicalUrl={`https://hashindia.com/product/${safeProduct._id}`}
        image={safeProduct.images?.[0]?.url || safeProduct.images?.[0] || 'https://hashindia.com/hash-logo-text.jpg'}
      />
      
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-black hover:bg-gray-100 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          {/* Left - Product Images */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg">
                <img
                  src={safeProduct.images[activeImage]?.url || safeProduct.images[activeImage] || "https://placehold.co/600x600/f8fafc/222?text=HASH+Product"}
                  alt={safeProduct.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Wishlist Button */}
                <motion.button
                  onClick={handleWishlist}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-neutral-200 hover:border-black rounded-lg shadow-lg z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        isWishlisted 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      } transition-all duration-200`}
                    />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {safeProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {safeProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image.url || image}
                      alt={`${safeProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-4">
            {/* Product Title & Rating */}
            <div>
              <Badge variant="secondary" className="mb-2 bg-black/5 text-black border-black/10 text-xs">
                {safeProduct.brand || 'HASH'}
              </Badge>
              <h1 className="text-xl lg:text-2xl font-bold text-black mb-2 leading-tight">
                {safeProduct.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-black font-medium">
                  {safeProduct.reviewStats?.averageRating || 4.2}/5 ({safeProduct.reviewStats?.totalReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 py-3 border-y border-gray-100">
              <span className="text-2xl font-bold text-black">
                ₹{currentPrice.toLocaleString()}
              </span>
              {originalPrice && originalPrice !== currentPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Size Selection with Dropdown */}
            {safeProduct.variants && safeProduct.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-black text-sm">Size</h3>
                  {safeProduct.sizeChart?.hasChart && (
                    <div className="space-y-1">
                    <Button
                      variant="outline"
                      onClick={() => setShowSizeChart(true)}
                      className="border-2 border-black/10 hover:border-black text-black hover:bg-black/5 flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200"
                    >
                      <Ruler className="w-4 h-4" />
                      Size Guide
                    </Button>
                    <div className="text-xs text-gray-500">
                      Sizes: S (36"), M (38"), L (40"), XL (42"), XXL (44")
                    </div>
                  </div>
                  )}
                </div>
                
                {/* Custom Size Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className={`w-full p-3 border-2 rounded-lg flex items-center justify-between bg-white transition-all ${
                      selectedSize ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className={`font-medium text-sm ${selectedSize ? 'text-black' : 'text-gray-500'}`}>
                      {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isSizeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {availableSizes.map((size) => {
                        const totalStockForSize = safeProduct.variants
                          .filter(v => v.size === size)
                          .reduce((total, variant) => total + (variant.stock || 0), 0);
                        const stockStatus = getStockStatus(totalStockForSize);
                        const isAvailable = totalStockForSize > 0;
                        
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedSize(size);
                                setIsSizeDropdownOpen(false);
                                // Reset color if not compatible
                                if (selectedColor && !getColorsForSize(size).find(c => c.hex === selectedColor)) {
                                  setSelectedColor('');
                                }
                              }
                            }}
                            disabled={!isAvailable}
                            className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                            } ${selectedSize === size ? 'bg-black text-white' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg">{size}</span>
                              {stockStatus.status === 'critical' || stockStatus.status === 'low' ? (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedSize === size ? 'bg-white/20 text-white' : stockStatus.bgColor.replace('text-', '').replace('bg-', 'bg-') + ' text-white'
                                }`}>
                                  {stockStatus.message}
                                </span>
                              ) : null}
                            </div>
                            <div className={`text-sm ${selectedSize === size ? 'text-white/80' : 'text-gray-500'}`}>
                              {isAvailable ? `${totalStockForSize} left` : 'Out of Stock'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {safeProduct.variants && safeProduct.variants.length > 0 && selectedSize && (
              <div className="space-y-2">
                <h3 className="font-medium text-black text-sm">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {getColorsForSize(selectedSize).map((color) => {
                    const isSelected = selectedColor === color.hex;
                    const stock = getVariantStock(selectedSize, color.hex);
                    const isAvailable = stock > 0;
                    
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
                          flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all min-w-[100px]
                          ${isSelected
                            ? 'border-black bg-black text-white shadow-lg'
                            : isAvailable
                            ? 'border-gray-300 hover:border-black text-black hover:shadow-md'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                          }
                        `}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-xs">{color.name}</span>
                          <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                            {stock} available
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Warning Alert */}
            {selectedSize && selectedColor && (
              (() => {
                const stock = getVariantStock(selectedSize, selectedColor);
                const stockStatus = getStockStatus(stock);
                
                if (stockStatus.status === 'critical' || stockStatus.status === 'low') {
                  return (
                    <div className={`p-4 rounded-xl border-2 ${stockStatus.bgColor} ${stockStatus.color} border-current`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <span className="font-semibold">{stockStatus.message}</span>
                      </div>
                      <p className="text-sm opacity-80">
                        ⚡ High demand item! Only {stock} units left. Order now to secure yours.
                      </p>
                    </div>
                  );
                }
                return null;
              })()
            )}

            {/* Quantity Selection */}
            <div className="space-y-2">
              <h3 className="font-medium text-black text-sm">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-sm text-black"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 h-8 text-center border-0 bg-transparent text-black font-semibold text-sm focus:ring-0"
                    min="1"
                    max={selectedSize && selectedColor ? getVariantStock(selectedSize, selectedColor) : safeProduct.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-sm text-black"
                    disabled={quantity >= (selectedSize && selectedColor ? getVariantStock(selectedSize, selectedColor) : safeProduct.stock)}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-gray-600">
                  {selectedSize && selectedColor ? getVariantStock(selectedSize, selectedColor) : safeProduct.stock} available
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <h3 className="font-medium text-black text-sm">Description</h3>
              <p className="text-black text-xs leading-relaxed">
                {safeProduct.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-10"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {!canAddToCart() ? 'Select Size & Color' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="px-4 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 h-10"
              >
                <Share className="mr-2 h-3 w-3" />
                Share
              </Button>
            </div>

            {/* Polo Varsity Form */}
            {showPoloVarsityForm && (
              <PoloVarsityForm
                onSubmit={handlePoloVarsityFormSubmit}
                onCancel={handlePoloVarsityFormCancel}
              />
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 max-w-6xl mx-auto">
          <Card className="shadow-sm bg-white border border-gray-100 rounded-xl">
            <CardHeader className="p-4 border-b border-gray-100">
              <CardTitle className="text-lg text-black font-bold">
                Customer Reviews ({safeProduct.reviewStats?.totalReviews || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ReviewsList 
                productId={id} 
                onReviewsLoaded={setTotalReviews}
                userHasReviewed={reviewSubmitted}
              />
              {/* User's review if submitted */}
              {reviewSubmitted && user && (
                <div className="mt-8 p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-black">{user.name || 'You'}</span>
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-black">Your review has been submitted!</span>
                </div>
              )}
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