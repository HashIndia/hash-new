import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { reviewsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ReviewsList = ({ productId, onReviewsLoaded, userHasReviewed = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-createdAt');

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, currentPage, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getProductReviews(productId, {
        page: currentPage,
        limit: 5,
        sort: sortBy
      });

      setReviews(response.data.reviews || []);
      setTotalPages(response.totalPages || 1);
      
      if (onReviewsLoaded) {
        onReviewsLoaded(response.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, size = 'sm' }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0 && !userHasReviewed) {
    return (
      <Card className="p-8 text-center">
        <div className="text-black">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-sm">Be the first to review this product!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-semibold text-black">
          Customer Reviews ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-black rounded-md bg-white text-black text-sm w-full sm:w-auto"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-rating">Highest Rating</option>
          <option value="rating">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id} className="p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* User Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-hash-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-hash-purple" />
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-black text-sm sm:text-base">
                        {review.user?.name || 'Anonymous'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-xs sm:text-sm text-black">
                          {review.rating}/5
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-black">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Review Title */}
                <h5 className="font-medium text-black mb-2 text-sm sm:text-base mt-3 sm:mt-2">
                  {review.title}
                </h5>

                {/* Review Comment */}
                <p className="text-black text-sm leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.alt || 'Review image'}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-black"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-xs sm:text-sm text-black hover:text-black transition-colors">
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Helpful</span>
                    {review.helpfulCount > 0 && (
                      <span>({review.helpfulCount})</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1 overflow-x-auto max-w-full">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm flex-shrink-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}
      
      {/* Review Submission Info */}
      <div className="mt-6 p-6 bg-white rounded-2xl border border-neutral-200 shadow-md">
        <h4 className="font-semibold text-black mb-3 text-lg">Want to write a review?</h4>
        <p className="text-sm text-neutral-600 mb-4">
          To maintain review authenticity, you can only review products you've purchased. 
          Complete your order and you'll be able to share your experience!
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-black">Rate this product:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6 text-neutral-300 hover:text-yellow-400 cursor-pointer transition-all duration-200 transform hover:scale-110"
                onClick={() => {
                  toast.error('Please purchase this product first to leave a review', {
                    duration: 3000,
                    style: {
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5'
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 text-center">
            💡 Purchase this product to unlock the ability to write detailed reviews and help other customers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
