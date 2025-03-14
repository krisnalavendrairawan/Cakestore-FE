import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { reviewService } from '@/services/api';
import { getImageProductUrl } from '@/utils/fileUpload';

interface OrderProduct {
  id: number;
  name: string;
  image: string;
}

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderProducts: OrderProduct[];
  onReviewSubmitted?: (productIds: number[]) => void;
}

const CreateReviewModal = ({ 
  isOpen, 
  onClose, 
  orderProducts,
  onReviewSubmitted 
}: CreateReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a rating before submitting"
      });
      return;
    }

    if (review.length < 5) {
      toast({
        variant: "destructive",
        title: "Review Too Short",
        description: "Please write at least 5 characters"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit review for each product
      await Promise.all(orderProducts.map(product => 
        reviewService.createReview({
          product_id: product.id,
          rating,
          review_text: review
        })
      ));

      toast({
        title: "Reviews Submitted",
        description: "Thank you for your reviews!",
        variant: "default"
      });

      setRating(0);
      setReview('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted(orderProducts.map(p => p.id));
      }
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error?.response?.data?.message || "Failed to submit your reviews. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    onClose();
  };

  if (!orderProducts?.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write Reviews for Order Items</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-6">
            <h3 className="font-medium mb-3">Products in this order:</h3>
            <div className="space-y-3">
              {orderProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={getImageProductUrl(product.image) || "/api/placeholder/100/100"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm">{product.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating for all products</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-yellow-400 hover:scale-110 transition-transform"
                  >
                    {star <= rating ? (
                      <Star className="w-8 h-8 fill-current" />
                    ) : (
                      <StarOff className="w-8 h-8" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with these products..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                This review will be applied to all products in this order
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-pink-600 text-white hover:bg-pink-700"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  </>
                ) : (
                  'Submit Reviews'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReviewModal;