import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { reviewsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function ReviewModal({ isOpen, onClose, product, orderId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setTitle("");
      setComment("");
      setHoveredStar(0);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (title.trim().length < 3) {
      toast.error("Please enter a title for your review (at least 3 characters)");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: product._id || product.id,
        orderId: orderId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      };

      await reviewsAPI.createReview(reviewData);
      toast.success("Review submitted successfully!");
      
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      
      // Close modal and trigger callback
      onClose();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setHoveredStar(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold">Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
            <img
              src={product?.images?.[0]?.url || product?.images?.[0] || product?.image || `https://placehold.co/60x60/64748b/fff?text=Product`}
              alt={product?.name || "Product"}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
              onError={(e) => {
                e.target.src = `https://placehold.co/60x60/64748b/fff?text=Product`;
              }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{product?.name || "Product"}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Rate your experience</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    <Star
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                  {rating > 0 && (
                    <>
                      {rating} star{rating !== 1 ? "s" : ""} - {
                        rating === 5 ? "Excellent" :
                        rating === 4 ? "Very Good" :
                        rating === 3 ? "Good" :
                        rating === 2 ? "Fair" : "Poor"
                      }
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Review Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review..."
                maxLength={100}
                className="text-sm sm:text-base"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {title.length}/100 characters
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Review *
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product... (minimum 10 characters)"
                rows={3}
                className="resize-none text-sm sm:text-base"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0 || title.trim().length < 3 || comment.trim().length < 10}
                className="flex-1 h-10 sm:h-11 text-sm sm:text-base bg-hash-purple hover:bg-hash-purple/90 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
