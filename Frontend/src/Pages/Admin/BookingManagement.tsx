import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Calendar, 
  Filter, 
  X, 
  MoreVertical, 
  Check, 
  XCircle,
  Eye,
  Search,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

interface Booking {
  id: number;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  customerEmail: string;
  pickupLocation: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      customerName: 'John Doe',
      vehicleName: 'Toyota Camry',
      startDate: '2024-04-15',
      endDate: '2024-04-20',
      totalPrice: 350.00,
      status: 'pending',
      customerEmail: 'john.doe@example.com',
      pickupLocation: 'Downtown Office'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      vehicleName: 'Tesla Model 3',
      startDate: '2024-04-22',
      endDate: '2024-04-25',
      totalPrice: 450.00,
      status: 'confirmed',
      customerEmail: 'jane.smith@example.com',
      pickupLocation: 'Airport Branch'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      vehicleName: 'Ford F-150',
      startDate: '2024-04-10',
      endDate: '2024-04-14',
      totalPrice: 400.00,
      status: 'completed',
      customerEmail: 'mike.johnson@example.com',
      pickupLocation: 'City Center'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({});

  const statusColorMap = {
    'pending': 'secondary',
    'confirmed': 'default',
    'in-progress': 'outline',
    'completed': 'success',
    'cancelled': 'destructive'
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => 
      (statusFilter === 'all' || booking.status === statusFilter) &&
      (searchQuery === '' || 
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [bookings, statusFilter, searchQuery]);

  const updateBookingStatus = (id: number, newStatus: BookingStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  const handleCancelBooking = () => {
    if (cancelBookingId) {
      updateBookingStatus(cancelBookingId, 'cancelled');
      setCancelBookingId(null);
    }
  };

  const handleAddBooking = () => {
    if (newBooking.customerName && newBooking.vehicleName) {
      const bookingToAdd: Booking = {
        ...newBooking as Booking,
        id: bookings.length + 1,
        status: 'pending',
        totalPrice: newBooking.totalPrice || 0
      };
      setBookings([...bookings, bookingToAdd]);
      setIsAddBookingOpen(false);
      setNewBooking({});
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        
        {/* Filters and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search bookings..." 
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status">
                {statusFilter === 'all' ? 'All Bookings' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Bookings`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Add New Booking Button */}
          <Button onClick={() => setIsAddBookingOpen(true)}>
            <Plus className="mr-2 w-4 h-4" /> Add Booking
          </Button>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{booking.vehicleName}</CardTitle>
                  <Badge variant={statusColorMap[booking.status]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Customer:</strong> {booking.customerName}</p>
                  <p><strong>Dates:</strong> {booking.startDate} to {booking.endDate}</p>
                  <p><strong>Total:</strong> ${booking.totalPrice.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onSelect={() => {
                          setSelectedBooking(booking);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 w-4 h-4" /> View Details
                      </DropdownMenuItem>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <>
                          <DropdownMenuItem 
                            onSelect={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                          >
                            <Check className="mr-2 w-4 h-4" /> Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onSelect={() => setCancelBookingId(booking.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="mr-2 w-4 h-4" /> Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No bookings found matching your search or filter criteria.
        </div>
      )}

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Detailed information about the booking
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Vehicle:</p>
                <p className="col-span-3">{selectedBooking.vehicleName}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Customer:</p>
                <p className="col-span-3">{selectedBooking.customerName}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Email:</p>
                <p className="col-span-3">{selectedBooking.customerEmail}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Pickup:</p>
                <p className="col-span-3">{selectedBooking.pickupLocation}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Dates:</p>
                <p className="col-span-3">
                  {selectedBooking.startDate} to {selectedBooking.endDate}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Total Price:</p>
                <p className="col-span-3">${selectedBooking.totalPrice.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Status:</p>
                <Badge variant={statusColorMap[selectedBooking.status]} className="col-span-3">
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Booking Dialog */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
            <DialogDescription>
              Create a new vehicle booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customerName" className="text-right">Customer Name</label>
              <Input 
                id="customerName" 
                className="col-span-3"
                value={newBooking.customerName || ''}
                onChange={(e) => setNewBooking({...newBooking, customerName: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="vehicleName" className="text-right">Vehicle</label>
              <Input 
                id="vehicleName" 
                className="col-span-3"
                value={newBooking.vehicleName || ''}
                onChange={(e) => setNewBooking({...newBooking, vehicleName: e.target.value})}
                placeholder="Enter vehicle name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right">Start Date</label>
              <Input 
                id="startDate" 
                type="date"
                className="col-span-3"
                value={newBooking.startDate || ''}
                onChange={(e) => setNewBooking({...newBooking, startDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right">End Date</label>
              <Input 
                id="endDate" 
                type="date"
                className="col-span-3"
                value={newBooking.endDate || ''}
                onChange={(e) => setNewBooking({...newBooking, endDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="totalPrice" className="text-right">Total Price</label>
              <Input 
                id="totalPrice" 
                type="number"
                className="col-span-3"
                value={newBooking.totalPrice || ''}
                onChange={(e) => setNewBooking({...newBooking, totalPrice: parseFloat(e.target.value)})}
                placeholder="Enter total price"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customerEmail" className="text-right">Customer Email</label>
              <Input 
                id="customerEmail" 
                className="col-span-3"
                value={newBooking.customerEmail || ''}
                onChange={(e) => setNewBooking({...newBooking, customerEmail: e.target.value})}
                placeholder="Enter customer email"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="pickupLocation" className="text-right">Pickup Location</label>
              <Input 
                id="pickupLocation" 
                className="col-span-3"
                value={newBooking.pickupLocation || ''}
                onChange={(e) => setNewBooking({...newBooking, pickupLocation: e.target.value})}
                placeholder="Enter pickup location"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddBooking}
              disabled={!newBooking.customerName || !newBooking.vehicleName}
            >
              Add Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation */}
      <AlertDialog 
        open={cancelBookingId !== null} 
        onOpenChange={() => setCancelBookingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingManagement;