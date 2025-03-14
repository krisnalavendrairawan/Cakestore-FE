import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, StarOff, MessageCircle } from 'lucide-react';
import { productService, reviewService } from '@/services/api';
import { format } from 'date-fns';
import { getImageProductUrl } from '@/utils/fileUpload';
import CustomerNavbar from '../components/CustomerNavbar';

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
  };
  rating: number;
  review_text: string;
  created_at: string;
  reply?: string;
  replied_at?: string;
  replied_by?: number;
}

const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchReviewsAndProducts = async () => {
      try {
        const response = await reviewService.getUserProductReviews();
        setReviews(response.data);

        const products = await productService.getProduct();
        
        const imageMap = products.reduce((acc, product) => ({
          ...acc,
          [product.id]: product.image
        }), {});
        
        setProductImages(imageMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviewsAndProducts();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
          ) : (
            <StarOff key={star} className="w-5 h-5 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const renderReply = (review: Review) => {
    if (!review.reply) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Seller Response</span>
        </div>
        <div className="mt-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              {review.replied_at && format(new Date(review.replied_at), 'MMM dd, yyyy')}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{review.reply}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CustomerNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <CustomerNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
        
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 text-lg">You haven't written any reviews yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageProductUrl(productImages[review.product_id])}
                      alt={review.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/100/100";
                      }}
                    />
                    <div>
                      <CardTitle className="text-lg">{review.product.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderStars(review.rating)}
                  <p className="mt-4 text-gray-700">{review.review_text}</p>
                  {renderReply(review)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviewsPage;