import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ThumbsUp, Filter, Search, User, Calendar, CheckCircle, MessageSquare } from 'lucide-react';
import { getAllReviews, getAllBookings } from '../../lib/seedData';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [user] = useState(getCurrentUser());
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    booking_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    service_type: 'Home Relocation',
    rating: 5,
    service_rating: 5,
    driver_rating: 5,
    delivery_rating: 5,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    if (user && user.role === 'customer') {
      loadUserBookings();
    }
  }, [user]);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, filterRating]);

  const loadReviews = async () => {
    try {
      // Fetch approved reviews from Supabase
      const { data: supabaseReviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews from Supabase:', error);
        // Fall back to localStorage reviews
        const localReviews = getAllReviews();
        setReviews(localReviews);
        return;
      }

      // Combine Supabase reviews with localStorage reviews
      const localReviews = getAllReviews();
      const allReviews = [...(supabaseReviews || []), ...localReviews];

      // Remove duplicates based on id
      const uniqueReviews = allReviews.filter((review, index, self) =>
        index === self.findIndex((r) => r.id === review.id)
      );

      setReviews(uniqueReviews);
    } catch (error) {
      console.error('Unexpected error loading reviews:', error);
      // Fall back to localStorage
      const localReviews = getAllReviews();
      setReviews(localReviews);
    }
  };

  const loadUserBookings = () => {
    const allBookings = getAllBookings();
    const completed = allBookings.filter((b: any) =>
      b.customer_id === `customer_${user?.email.split('@')[0]?.split('.')[0]}` &&
      b.status === 'delivered'
    );
    setUserBookings(completed);
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(r => r.rating === rating);
    }

    setFilteredReviews(filtered);
  };

  const handleSubmitReview = async () => {
    // Validation for non-logged-in users
    if (!user) {
      if (!reviewData.customer_name || !reviewData.customer_email) {
        toast.error('Please provide your name and email');
        return;
      }
      if (!reviewData.service_type) {
        toast.error('Please select the service you used');
        return;
      }
    }

    // Validation for logged-in users
    if (user && !reviewData.booking_id) {
      toast.error('Please select a booking');
      return;
    }

    if (!reviewData.title || !reviewData.comment) {
      toast.error('Please fill in title and comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = {
        customer_id: user?.id || null,
        customer_name: user?.full_name || reviewData.customer_name,
        customer_email: user?.email || reviewData.customer_email,
        customer_phone: user?.phone || reviewData.customer_phone,
        booking_id: reviewData.booking_id || null,
        service_type: reviewData.service_type,
        rating: reviewData.rating,
        service_rating: reviewData.service_rating,
        driver_rating: reviewData.driver_rating,
        delivery_rating: reviewData.delivery_rating,
        title: reviewData.title,
        comment: reviewData.comment,
        review_type: 'overall',
        status: 'pending',
        is_featured: false
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select()
        .single();

      if (error) {
        console.error('Error saving review:', error);
        toast.error('Failed to submit review. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Also add to local state for immediate display
      const updatedReviews = [...reviews, { ...newReview, created_at: new Date().toISOString() }];
      setReviews(updatedReviews);
      localStorage.setItem('seed_reviews', JSON.stringify(updatedReviews));

      toast.success('Thank you! Your review has been submitted and will be published after approval.');
      setShowReviewForm(false);
      setReviewData({
        booking_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        service_type: 'Home Relocation',
        rating: 5,
        service_rating: 5,
        driver_rating: 5,
        delivery_rating: 5,
        title: '',
        comment: ''
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingSelector = (value: number, onChange: (val: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Customer Reviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 mb-6"
          >
            See what our customers say about their experience with ASZE Relocation
          </motion.p>

          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Share Your Experience</DialogTitle>
                  <DialogDescription>
                    {user
                      ? 'Help others by sharing your experience with our service'
                      : 'Tell us about your experience with ASZE Relocation'
                    }
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Customer Information (for non-logged-in users) */}
                  {!user && (
                    <>
                      <div>
                        <Label htmlFor="customer_name">Your Name *</Label>
                        <Input
                          id="customer_name"
                          placeholder="Enter your full name"
                          value={reviewData.customer_name}
                          onChange={(e) => setReviewData({ ...reviewData, customer_name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="customer_email">Email Address *</Label>
                        <Input
                          id="customer_email"
                          type="email"
                          placeholder="your@email.com"
                          value={reviewData.customer_email}
                          onChange={(e) => setReviewData({ ...reviewData, customer_email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="customer_phone">Phone Number (Optional)</Label>
                        <Input
                          id="customer_phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={reviewData.customer_phone}
                          onChange={(e) => setReviewData({ ...reviewData, customer_phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="service_type">Service Used *</Label>
                        <Select value={reviewData.service_type} onValueChange={(val) => setReviewData({ ...reviewData, service_type: val })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home Relocation">Home Relocation</SelectItem>
                            <SelectItem value="Office Relocation">Office Relocation</SelectItem>
                            <SelectItem value="Fine Art Logistics">Fine Art Logistics</SelectItem>
                            <SelectItem value="Car Relocation">Car Relocation</SelectItem>
                            <SelectItem value="Warehouse Facility">Warehouse Facility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Booking Selection (for logged-in customers with completed bookings) */}
                  {user && user.role === 'customer' && userBookings.length > 0 && (
                    <div>
                      <Label htmlFor="booking">Select Booking</Label>
                      <Select value={reviewData.booking_id} onValueChange={(val) => setReviewData({ ...reviewData, booking_id: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a completed booking" />
                        </SelectTrigger>
                        <SelectContent>
                          {userBookings.map((booking) => (
                            <SelectItem key={booking.booking_number} value={booking.booking_number}>
                              {booking.booking_number} - {booking.service_type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Service type for logged-in users without bookings */}
                  {user && (!userBookings || userBookings.length === 0) && (
                    <div>
                      <Label htmlFor="service_type">Service Used *</Label>
                      <Select value={reviewData.service_type} onValueChange={(val) => setReviewData({ ...reviewData, service_type: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home Relocation">Home Relocation</SelectItem>
                          <SelectItem value="Office Relocation">Office Relocation</SelectItem>
                          <SelectItem value="Fine Art Logistics">Fine Art Logistics</SelectItem>
                          <SelectItem value="Car Relocation">Car Relocation</SelectItem>
                          <SelectItem value="Warehouse Facility">Warehouse Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Overall Rating</Label>
                    {renderRatingSelector(reviewData.rating, (val) => setReviewData({ ...reviewData, rating: val }))}
                  </div>

                  <div>
                    <Label>Service Quality</Label>
                    {renderRatingSelector(reviewData.service_rating, (val) => setReviewData({ ...reviewData, service_rating: val }))}
                  </div>

                  <div>
                    <Label>Driver Performance</Label>
                    {renderRatingSelector(reviewData.driver_rating, (val) => setReviewData({ ...reviewData, driver_rating: val }))}
                  </div>

                  <div>
                    <Label>Delivery Experience</Label>
                    {renderRatingSelector(reviewData.delivery_rating, (val) => setReviewData({ ...reviewData, delivery_rating: val }))}
                  </div>

                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      placeholder="Summarize your experience"
                      value={reviewData.title}
                      onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share details about your experience..."
                      rows={5}
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{reviews.length}</div>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2 flex items-center justify-center gap-2">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {reviews.filter(r => r.rating === 5).length}
              </div>
              <p className="text-sm text-gray-600">5-Star Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {reviews.filter(r => r.is_featured).length}
              </div>
              <p className="text-sm text-gray-600">Featured Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reviews..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={review.is_featured ? 'border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.is_featured && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Service Quality:</span>
                      {renderStars(review.service_rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Driver:</span>
                      {renderStars(review.driver_rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Delivery:</span>
                      {renderStars(review.delivery_rating)}
                    </div>
                  </div>

                  {review.status === 'approved' && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified Review</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredReviews.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviews found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
