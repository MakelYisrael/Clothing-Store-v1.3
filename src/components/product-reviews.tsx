import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useUser } from '../contexts/user-context';
import { toast } from 'sonner';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
}

export function ProductReviews({ productId, reviews, onAddReview }: ProductReviewsProps) {
  const { user } = useUser();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReview = () => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    onAddReview({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar ?? undefined,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      verified: true
    });

    setNewReview({ rating: 0, comment: '' });
    setIsReviewDialogOpen(false);
    toast.success('Review submitted successfully!');
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }: { 
    rating: number; 
    interactive?: boolean; 
    onRatingChange?: (rating: number) => void;
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex items-start space-x-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-8">{rating}★</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Customer Reviews</h3>
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this product
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="mt-2">
                  <StarRating
                    rating={newReview.rating}
                    interactive
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Tell others about your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>
                    {review.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <StarRating rating={review.rating} />
                  
                  <p className="text-sm">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
