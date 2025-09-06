import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Edit, Calendar, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import ReviewModal from '../components/ReviewModal';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('reviewable');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewableResponse, reviewsResponse] = await Promise.all([
        fetch('/api/reviews/reviewable', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }),
        fetch('/api/reviews/my-reviews', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
      ]);

      if (reviewableResponse.ok) {
        const reviewableData = await reviewableResponse.json();
        setReviewableProducts(reviewableData.data.products || []);
      }

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setMyReviews(reviewsData.data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
      toast.error('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    // Move product from reviewable to reviewed
    setReviewableProducts(prev => 
      prev.filter(item => item.product._id !== newReview.product)
    );
    setMyReviews(prev => [newReview, ...prev]);
    toast.success('Review submitted successfully!');
  };

  const handleWriteReview = (product, orderId) => {
    setSelectedProduct(product);
    setSelectedOrderId(orderId);
    setShowReviewModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-foreground mb-8">My Reviews</h1>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setActiveTab('reviewable')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'reviewable'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Products to Review ({reviewableProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'reviewed'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Reviews ({myReviews.length})
            </button>
          </div>

          {/* Reviewable Products Tab */}
          {activeTab === 'reviewable' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Products You Can Review
              </h2>
              
              {reviewableProducts.length === 0 ? (
                <Card className="p-8 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Products to Review
                  </h3>
                  <p className="text-muted-foreground">
                    You'll see products here after you receive your orders.
                  </p>
                </Card>
              ) : (
                reviewableProducts.map((item) => (
                  <Card key={`${item.product._id}-${item.orderId}`} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Purchased on {formatDate(item.purchaseDate)}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Order delivered</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleWriteReview(item.product, item.orderId)}
                        className="bg-hash-purple hover:bg-hash-purple/90"
                      >
                        Write Review
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* My Reviews Tab */}
          {activeTab === 'reviewed' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Reviews
              </h2>
              
              {myReviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Your product reviews will appear here.
                  </p>
                </Card>
              ) : (
                myReviews.map((review) => (
                  <Card key={review._id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={review.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                          alt={review.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">
                            {review.product?.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                          {review.title}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                          {review.comment}
                        </p>
                        {review.isVerifiedPurchase && (
                          <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </motion.div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          product={selectedProduct}
          orderId={selectedOrderId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
};

export default MyReviews;
