import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, Loader2, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface DestinationReviewsProps {
  placeId: string;
}

const DestinationReviews = ({ placeId }: DestinationReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id
        `)
        .eq('place_id', placeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately to avoid RLS issues
      const userIds = [...new Set(data?.map(r => r.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const reviewsWithProfiles = (data || []).map(review => ({
        ...review,
        profile: profiles?.find(p => p.id === review.user_id) || null
      }));

      setReviews(reviewsWithProfiles);

      // Check if user already has a review
      if (user) {
        const existingReview = reviewsWithProfiles.find(r => r.user_id === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setRating(existingReview.rating);
          setComment(existingReview.comment || '');
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!comment.trim()) {
      toast({ variant: 'destructive', title: 'Please write a comment' });
      return;
    }

    setSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({ rating, comment: comment.trim() })
          .eq('id', userReview.id);

        if (error) throw error;
        toast({ title: 'Review updated!' });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            place_id: placeId,
            user_id: user.id,
            rating,
            comment: comment.trim()
          });

        if (error) throw error;
        toast({ title: 'Review submitted!' });
      }

      fetchReviews();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', userReview.id);

      if (error) throw error;

      setUserReview(null);
      setRating(5);
      setComment('');
      fetchReviews();
      toast({ title: 'Review deleted' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-section text-foreground mb-2">Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Number(averageRating)
                      ? 'fill-nepal-gold text-nepal-gold'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{averageRating}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-card rounded-xl p-6 border border-border">
        {user ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-nepal-gold text-nepal-gold'
                          : 'text-muted-foreground hover:text-nepal-gold/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              maxLength={500}
              className="resize-none"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {userReview ? 'Update Review' : 'Submit Review'}
              </Button>
              {userReview && (
                <Button variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
                  Delete Review
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Sign in to write a review</p>
            <Link to="/auth">
              <Button className="btn-primary">Sign In</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {review.profile?.avatar_url ? (
                      <img
                        src={review.profile.avatar_url}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {review.profile?.full_name || 'Anonymous'}
                          {review.user_id === user?.id && (
                            <span className="ml-2 text-xs text-accent">(You)</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-nepal-gold text-nepal-gold'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DestinationReviews;
