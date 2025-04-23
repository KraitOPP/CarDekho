// components/BookingManagement.tsx
import React, { useState, useMemo } from 'react';
import { Calendar, Search, XCircle, Filter, Car, User, Clock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useGetAllBookingsQuery, useCancelBookingMutation } from '@/slices/bookingApiSlice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Booking = {
  booking_id: number;
  id?: number; 
  user_id?: number;
  vehicle_id?: number;
  vehicle_model_id?: number;
  pickup_date?: string;
  return_date?: string;
  total_cost?: number;
  total_amount?: number | string;
  status?: string;
  booking_status?: string;
  payment_status?: string;
  customer_name?: string;
  user_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  color?: string;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const formatAmount = (amount: any): string => {
  if (amount === null || amount === undefined) return '0.00';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0.00';
  return typeof numAmount === 'number' ? numAmount.toFixed(2) : '0.00';
};

export const BookingManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  
  const { data, isLoading, isError, refetch } = useGetAllBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const bookings: Booking[] = useMemo(() => {
    if (!data?.bookings && !data) return [];
    
    const bookingsData = data.bookings || data;
    
    return bookingsData.map((booking: any) => ({
      booking_id: booking.booking_id || booking.id,
      user_id: booking.user_id,
      vehicle_id: booking.vehicle_id,
      pickup_date: booking.pickup_date || booking.booking_date,
      return_date: booking.return_date,
      total_cost: booking.total_cost || booking.total_amount,
      status: booking.status || booking.booking_status,
      payment_status: booking.payment_status,
      customer_name: booking.customer_name || booking.user_name,
      vehicle_brand: booking.vehicle_brand,
      vehicle_model: booking.vehicle_model,
      color: booking.color
    }));
  }, [data]);

  const statusColorMap: Record<string, string> = {
    pending: 'secondary',
    confirmed: 'default',
    'in-progress': 'default',
    completed: 'success',
    cancelled: 'destructive',
  };

  const paymentColorMap: Record<string, string> = {
    pending: 'secondary',
    completed: 'success',
  };

  const filtered = useMemo(() =>
    bookings.filter(booking => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || booking.payment_status === paymentFilter;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        String(booking.booking_id).includes(searchLower) ||
        String(booking.vehicle_id).includes(searchLower) ||
        (booking.vehicle_brand && booking.vehicle_brand.toLowerCase().includes(searchLower)) ||
        (booking.vehicle_model && booking.vehicle_model.toLowerCase().includes(searchLower));
      
      return matchesStatus && matchesPayment && matchesSearch;
    }),
    [bookings, statusFilter, paymentFilter, searchQuery]
  );

  const handleCancelClick = (id: number) => {
    setBookingToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking({ 
        id: bookingToCancel, 
        payload: { status: 'cancelled' } 
      }).unwrap();
      toast.success('Booking has been cancelled');
      refetch();
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setSearchQuery('');
  };

  if (isLoading) return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-40" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="container mx-auto p-6 text-center">
      <div className="max-w-md mx-auto bg-red-50 p-8 rounded-lg">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Bookings</h3>
        <p className="text-gray-600 mb-4">Unable to load bookings data. Please try again later.</p>
        <Button onClick={() => refetch()} variant="outline">
          <Loader2 className="mr-2 h-4 w-4" /> Retry Loading
        </Button>
      </div>
    </div>
  );

  // Find the booking being cancelled for the dialog
  const bookingDetails = bookingToCancel 
    ? bookings.find(b => b.booking_id === bookingToCancel) 
    : null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, ID..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            {(statusFilter !== 'all' || paymentFilter !== 'all' || searchQuery) && (
              <Button variant="outline" size="icon" onClick={resetFilters} title="Clear filters">
                <XCircle className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" onClick={() => refetch()}>
              <Calendar className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
          <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} of {bookings.length} bookings</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(booking => (
              <Card key={booking.booking_id} className="shadow-sm hover:shadow transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-1">
                        <Car className="h-4 w-4" /> 
                        {booking.vehicle_brand && booking.vehicle_model 
                          ? `${booking.vehicle_brand} ${booking.vehicle_model}`
                          : `Vehicle #${booking.vehicle_id}`}
                      </CardTitle>
                      {booking.color && (
                        <p className="text-sm text-gray-500">{booking.color}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge variant={statusColorMap[booking.status || 'pending'] as any}>
                        {booking.status}
                      </Badge>
                      {booking.payment_status && (
                        <Badge variant={paymentColorMap[booking.payment_status] as any} className="text-xs">
                          {booking.payment_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{booking.customer_name || 'Unknown Customer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center text-sm">
                        <span>{formatDate(booking.pickup_date)}</span>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>{formatDate(booking.return_date)}</span>
                      </div>
                    </div>
                    <div className="mt-2 font-medium">
                    ₹{formatAmount(booking.total_cost)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex gap-2">
                  <Link to={`/dashboard/booking/${booking.booking_id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleCancelClick(booking.booking_id)} 
                      disabled={isCancelling}
                      className="flex-1"
                    >
                      {isCancelling && bookingToCancel === booking.booking_id ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              {bookingDetails ? (
                <div className="text-left pt-2">
                  <p className="mb-2">Are you sure you want to cancel this booking?</p>
                  <div className="bg-gray-50 p-3 rounded-md mt-2 space-y-1 text-sm">
                    <p><strong>Booking ID:</strong> #{bookingDetails.booking_id}</p>
                    <p><strong>Customer:</strong> {bookingDetails.customer_name}</p>
                    <p><strong>Vehicle:</strong> {bookingDetails.vehicle_brand && bookingDetails.vehicle_model 
                      ? `${bookingDetails.vehicle_brand} ${bookingDetails.vehicle_model}`
                      : `Vehicle #${bookingDetails.vehicle_id}`}</p>
                    <p><strong>Amount:</strong> ₹{formatAmount(bookingDetails.total_cost)}</p>
                  </div>
                  <p className="mt-4 text-sm text-yellow-600">
                    This action cannot be undone and may affect customer billing.
                  </p>
                </div>
              ) : (
                <p>Are you sure you want to cancel this booking?</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Keep Booking
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleCancelConfirm}
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;