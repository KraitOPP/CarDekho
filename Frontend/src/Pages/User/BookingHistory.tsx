import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Car, Image, Loader2, MessageSquare, Star, XCircle } from 'lucide-react';
import { useGetUserBookingsQuery, useCancelBookingMutation, useRateBookingMutation } from '@/slices/bookingApiSlice';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Booking = {
  booking_id: number;
  vehicle_id: number;
  model_id: number; 
  brand_id: number;
  rating: number | null;
  review: string | null;
  booking_date: string; 
  return_date: string;
  booking_status: string;
  total_amount: number; 
  payment_status: string;
  created_at: string;
  vehicle_images: string[];
  model_images: string[];
  model_name: string;
  brand_name: string;
  plate_number: string;
  color: string;
  availability_status: string;
  delivery_status?: string; 
};

const BookingHistoryPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  
  const { data, isLoading, isError, refetch } = useGetUserBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [rateBooking, { isLoading: isRating }] = useRateBookingMutation();

  const bookings: Booking[] = data?.bookings || [];

  const handleCancelBooking = async () => {
    if (selectedBookingId) {
      try {
        await cancelBooking(selectedBookingId).unwrap();
        
        toast.success("Booking Cancelled", {
          description: "Your booking has been successfully cancelled",
        });
        
        refetch();
      } catch (error) {
        toast.error("Error", {
          description: "Failed to cancel booking. Please try again.",
        });
      }
      
      setIsDialogOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleRateBooking = async () => {
    if (selectedBookingId && rating > 0) {
      try {
        await rateBooking({
          id: selectedBookingId,
          payload: { rating, review }
        }).unwrap();
        
        toast.success("Thank you for your feedback!", {
          description: "Your rating has been submitted successfully.",
        });
        
        refetch();
      } catch (error) {
        toast.error("Error", {
          description: "Failed to submit rating. Please try again.",
        });
      }
      
      setIsRatingDialogOpen(false);
      setSelectedBookingId(null);
      setRating(0);
      setReview('');
    }
  };

  const openCancelDialog = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsDialogOpen(true);
  };

  const openRatingDialog = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsRatingDialogOpen(true);
  };

  const openImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch(status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Completed</Badge>;
      case 'upcoming':
      case 'active':
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">{status}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Delivered</Badge>;
      case 'in transit':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600">In Transit</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Preparing</Badge>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Payment Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-600">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderBookingItem = (booking: Booking) => {
    const status = booking.booking_status || 'unknown';
    const isActive = status.toLowerCase() === 'active' || status.toLowerCase() === 'upcoming' || status.toLowerCase() === 'pending';
    const isCompleted = status.toLowerCase() === 'completed';
    const isDelivered = booking.delivery_status?.toLowerCase() === 'delivered';
    const hasRated = booking.rating !== null;
    
    // Determine which images to use, prioritizing vehicle images if available
    const images = booking.vehicle_images && booking.vehicle_images.length > 0 
      ? booking.vehicle_images 
      : booking.model_images && booking.model_images.length > 0 
        ? booking.model_images 
        : [];
    
    return (
      <div key={booking.booking_id} className="border-b py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <div className="flex items-center mb-2 md:mb-0">
            {images.length > 0 ? (
              <div 
                className="w-16 h-16 bg-gray-100 rounded mr-4 cursor-pointer overflow-hidden"
                onClick={() => openImageDialog(images[0])}
              >
                <img 
                  src={images[0]} 
                  alt={booking.model_name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder-car.png';
                  }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                <Car className="text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{booking.brand_name} {booking.model_name}</h3>
              <p className="text-sm text-gray-500">
                {booking.plate_number && <span>Plate: {booking.plate_number} • </span>}
                {booking.color && <span>Color: {booking.color}</span>}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {booking.booking_date && booking.return_date ? 
                  `${new Date(booking.booking_date).toLocaleDateString()} - ${new Date(booking.return_date).toLocaleDateString()}` : 
                  'Dates not available'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="font-medium mb-1">₹{booking.total_amount || 0}</span>
            <div className="flex space-x-2">
              {getStatusBadge(booking.booking_status)}
              {getPaymentStatusBadge(booking.payment_status)}
              {getDeliveryStatusBadge(booking.delivery_status)}
            </div>
          </div>
        </div>
        
        {booking.rating ? (
          <div className="flex items-center mt-2 text-yellow-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4" fill={i < booking.rating! ? "currentColor" : "none"} />
              ))}
            </div>
            {booking.review && (
              <span className="ml-2 text-gray-600 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                "{booking.review}"
              </span>
            )}
          </div>
        ) : null}
        
        <div className="mt-3 flex space-x-2">
          {isActive && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => openCancelDialog(booking.booking_id)}
              disabled={isCancelling}
            >
              Cancel Booking
            </Button>
          )}
          
          {/* Allow rating when delivery is completed or booking is completed */}
          {(isCompleted || isDelivered) && !hasRated && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => openRatingDialog(booking.booking_id)}
            >
              Rate Experience
            </Button>
          )}
          
          {images.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openImageDialog(images[0])}
            >
              <Image className="w-4 h-4 mr-1" />
              View Image
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2">Loading bookings...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="flex justify-center items-center py-8 text-red-500">
            <XCircle className="mr-2" />
            <span>Failed to load bookings. Please try again later.</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filterBookings = (status: string[] | null) => {
    if (!status) return bookings;
    return bookings.filter(b => {
      // Safe check for undefined status
      if (!b.booking_status) return false;
      return status.includes(b.booking_status.toLowerCase());
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="mr-2" /> My Rental History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {bookings.length > 0 ? (
                bookings.map(renderBookingItem)
              ) : (
                <div className="py-4 text-center text-gray-500">No bookings found</div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {filterBookings(['active', 'upcoming', 'pending']).length > 0 ? (
                filterBookings(['active', 'upcoming', 'pending']).map(renderBookingItem)
              ) : (
                <div className="py-4 text-center text-gray-500">No active bookings</div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filterBookings(['completed']).length > 0 ? (
                filterBookings(['completed']).map(renderBookingItem)
              ) : (
                <div className="py-4 text-center text-gray-500">No completed bookings</div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {filterBookings(['cancelled']).length > 0 ? (
                filterBookings(['cancelled']).map(renderBookingItem)
              ) : (
                <div className="py-4 text-center text-gray-500">No cancelled bookings</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cancel Booking Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, cancel booking'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl p-1 focus:outline-none"
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className="w-8 h-8" 
                    fill={star <= rating ? "#FFD700" : "none"} 
                    stroke={star <= rating ? "#FFD700" : "currentColor"}
                  />
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Share your experience with this rental and delivery (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="mb-4"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleRateBooking} 
              disabled={rating === 0 || isRating}
            >
              {isRating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vehicle Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-2">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Vehicle" 
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder-car.png'; // Fallback image
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImageDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingHistoryPage;