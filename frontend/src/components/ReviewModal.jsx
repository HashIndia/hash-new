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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
            <img
              src={product?.images?.[0]?.url || product?.images?.[0] || product?.image || `https://placehold.co/60x60/64748b/fff?text=Product`}
              alt={product?.name || "Product"}
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = `https://placehold.co/60x60/64748b/fff?text=Product`;
              }}
            />
            <div>
              <h4 className="font-medium text-foreground">{product?.name || "Product"}</h4>
              <p className="text-sm text-muted-foreground">Rate your experience</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
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
                placeholder="Summarize your review in a few words..."
                maxLength={100}
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
                rows={4}
                className="resize-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0 || title.trim().length < 3 || comment.trim().length < 10}
                className="flex-1 bg-gradient-to-r from-hash-purple to-hash-blue hover:from-hash-blue hover:to-hash-purple"
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
