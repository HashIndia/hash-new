import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import { useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === id) || {
    id: id,
    name: 'Premium Cotton T-Shirt',
    price: 1299,
    originalPrice: 1699,
    images: [
      'https://placehold.co/500x600/64748b/fff?text=Product+1',
      'https://placehold.co/500x600/71717a/fff?text=Product+2',
      'https://placehold.co/500x600/52525b/fff?text=Product+3',
      'https://placehold.co/500x600/3f3f46/fff?text=Product+4'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'navy', 'gray'],
    description: 'Experience ultimate comfort with our premium cotton t-shirt. Crafted from 100% organic cotton, this versatile piece combines style and sustainability. Perfect for casual outings or layering, featuring a modern fit that flatters every body type.',
    features: [
      '100% Organic Cotton',
      'Pre-shrunk Fabric',
      'Reinforced Seams',
      'Machine Washable',
      'Eco-friendly Dyes'
    ],
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, comment: 'Amazing quality! The fabric is so soft and the fit is perfect.', date: '2024-01-15' },
      { id: 2, user: 'John D.', rating: 4, comment: 'Great product, fast delivery. Highly recommend!', date: '2024-01-10' },
      { id: 3, user: 'Emma K.', rating: 5, comment: 'Love the material and the color is exactly as shown.', date: '2024-01-08' }
    ],
    stock: 25,
    sku: 'HSH-CT-001'
  };

  // Ensure all required properties exist with defaults
  const safeProduct = {
    ...product,
    images: product.images || ['https://placehold.co/500x600/64748b/fff?text=Product'],
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || ['black', 'white'],
    features: product.features || ['Premium Quality', 'Comfortable Fit'],
    reviews: product.reviews || [],
    originalPrice: product.originalPrice || product.price,
    stock: product.stock || 0
  };

  const discount = Math.round(((safeProduct.originalPrice - safeProduct.price) / safeProduct.originalPrice) * 100);
  const avgRating = safeProduct.reviews.length > 0 ? safeProduct.reviews.reduce((sum, r) => sum + r.rating, 0) / safeProduct.reviews.length : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart({ ...safeProduct, selectedSize, selectedColor, qty: quantity });
    alert('Added to cart!');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReview({ rating: 5, comment: '' });
    alert('Review submitted!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: safeProduct.name,
        text: safeProduct.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <div className="container mx-auto py-8 px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-600 mb-6">
          <a href="/" className="hover:text-slate-800">Home</a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-slate-800">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{safeProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
              <img
                src={safeProduct.images[activeImage]}
                alt={safeProduct.name}
                className="w-full h-96 lg:h-[600px] object-cover transition-transform duration-300 hover:scale-105 cursor-zoom-in"
              />
              {safeProduct.originalPrice > safeProduct.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </div>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'
                }`}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {safeProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 flex-shrink-0 ${
                    activeImage === idx ? 'ring-4 ring-slate-400 scale-105' : 'hover:scale-105'
                  }`}
                >
                  <img src={img} alt={`${safeProduct.name} ${idx + 1}`} className="w-20 h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400 text-sm">
                  {'★'.repeat(Math.floor(avgRating))}{'☆'.repeat(5 - Math.floor(avgRating))}
                </div>
                <span className="text-sm text-slate-600">({safeProduct.reviews.length} reviews)</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{safeProduct.name}</h1>
              <div className="text-sm text-slate-600 mb-4">SKU: {safeProduct.sku}</div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl font-bold text-slate-900">₹{safeProduct.price}</div>
                {safeProduct.originalPrice > safeProduct.price && (
                  <div className="text-xl text-slate-500 line-through">₹{safeProduct.originalPrice}</div>
                )}
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">{safeProduct.description}</p>
              
              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {safeProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Size</h3>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-3">
                {safeProduct.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeGuide && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
                  <div className="font-semibold mb-2">Size Guide</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="font-medium">Size</div>
                    <div className="font-medium">Chest</div>
                    <div className="font-medium">Length</div>
                    <div className="font-medium">Shoulder</div>
                    <div>S</div><div>36"</div><div>27"</div><div>16"</div>
                    <div>M</div><div>38"</div><div>28"</div><div>17"</div>
                    <div>L</div><div>40"</div><div>29"</div><div>18"</div>
                    <div>XL</div><div>42"</div><div>30"</div><div>19"</div>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {safeProduct.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                      selectedColor === color ? 'border-slate-800 scale-110' : 'border-slate-200 hover:border-slate-400'
                    }`}
                    style={{ 
                      backgroundColor: color === 'white' ? '#f8f9fa' : 
                                     color === 'navy' ? '#1e3a8a' : 
                                     color === 'gray' ? '#6b7280' : color 
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-slate-600">
                  {safeProduct.stock} items left in stock
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 text-lg font-semibold bg-slate-800 hover:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={safeProduct.stock === 0}
              >
                {safeProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="py-3 border-slate-200 hover:bg-slate-50">
                  Buy Now
                </Button>
                <Button variant="outline" onClick={handleShare} className="py-3 border-slate-200 hover:bg-slate-50">
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl mb-1">🚚</div>
                <div className="text-xs text-slate-600">Free Shipping</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">↩️</div>
                <div className="text-xs text-slate-600">Easy Returns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs text-slate-600">Secure Payment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">
                Customer Reviews ({safeProduct.reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {safeProduct.reviews.map(review => (
                  <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{review.user}</div>
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">{review.date}</div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))}
                
                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900">Write a Review</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                    <select
                      value={review.rating}
                      onChange={e => setReview({...review, rating: Number(e.target.value)})}
                      className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    >
                      {[5,4,3,2,1].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={review.comment}
                      onChange={e => setReview({...review, comment: e.target.value})}
                      className="w-full min-h-[100px] p-3 border border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="border-slate-200 hover:bg-slate-50">
                    Submit Review
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 