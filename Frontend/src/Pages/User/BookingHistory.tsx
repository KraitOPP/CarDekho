import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, CheckCircle2, XCircle } from 'lucide-react';

// Define the type for a booking
type Booking = {
  id: number;
  carModel: string;
  pickupDate: string;
  returnDate: string;
  totalCost: number;
  status: 'completed' | 'upcoming' | 'cancelled';
};

const BookingHistoryPage: React.FC = () => {
  // Sample booking data (in a real app, this would come from an API)
  const bookings: Booking[] = [
    {
      id: 1,
      carModel: 'Toyota Camry',
      pickupDate: '2024-03-15',
      returnDate: '2024-03-20',
      totalCost: 350,
      status: 'completed'
    },
    {
      id: 2,
      carModel: 'Tesla Model 3',
      pickupDate: '2024-04-05',
      returnDate: '2024-04-10',
      totalCost: 500,
      status: 'upcoming'
    },
    {
      id: 3,
      carModel: 'Ford Mustang',
      pickupDate: '2024-02-10',
      returnDate: '2024-02-12',
      totalCost: 250,
      status: 'cancelled'
    }
  ];

  // Type-safe function to get status icon
  const getStatusIcon = (status: Booking['status']) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500 mr-2" />;
      case 'upcoming':
        return <Calendar className="text-blue-500 mr-2" />;
      case 'cancelled':
        return <XCircle className="text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  // Type-safe function to get status badge
  const getStatusBadge = (status: Booking['status']) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Upcoming</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Render booking item component
  const renderBookingItem = (booking: Booking) => (
    <div key={booking.id} className="border-b py-4 flex items-center justify-between">
      <div className="flex items-center">
        {getStatusIcon(booking.status)}
        <div>
          <h3 className="font-semibold">{booking.carModel}</h3>
          <p className="text-sm text-gray-500">
            {booking.pickupDate} - {booking.returnDate}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium">${booking.totalCost}</span>
        {getStatusBadge(booking.status)}
      </div>
    </div>
  );

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {bookings.map(renderBookingItem)}
            </TabsContent>
            
            <TabsContent value="upcoming">
              {bookings.filter(b => b.status === 'upcoming').map(renderBookingItem)}
            </TabsContent>
            
            <TabsContent value="completed">
              {bookings.filter(b => b.status === 'completed').map(renderBookingItem)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistoryPage;