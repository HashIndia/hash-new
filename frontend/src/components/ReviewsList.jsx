import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { reviewsAPI } from '../services/api';

const ReviewsList = ({ productId, onReviewsLoaded }) => {
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

  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Customer Reviews ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
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
          <Card key={review._id} className="p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-hash-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-hash-purple" />
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                {/* Review Title */}
                <h5 className="font-medium text-foreground mb-2">
                  {review.title}
                </h5>

                {/* Review Comment */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.alt || 'Review image'}
                        className="w-16 h-16 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
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
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
