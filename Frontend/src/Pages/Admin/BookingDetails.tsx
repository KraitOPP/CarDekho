import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetBookingByIdQuery, useUpdateBookingStatusMutation, useUpdatePaymentStatusMutation } from '@/slices/bookingApiSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, XCircle, Car, Calendar, MapPin, CreditCard, Star, MessageSquare, UserCircle, FileText, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const { data: bookingData, isLoading, isError, refetch } = useGetBookingByIdQuery(bookingId, { skip: isNaN(bookingId) });
  const data = bookingData?.booking;
  console.log(data)
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateBookingStatusMutation();
  const [updatePayment, { isLoading: isUpdatingPayment }] = useUpdatePaymentStatusMutation();
  const [newStatus, setNewStatus] = useState<string>('');
  const [newPayment, setNewPayment] = useState<string>('');
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageType, setImageType] = useState<'vehicle' | 'model'>('vehicle');
  const [documentView, setDocumentView] = useState<'license' | 'aadhaar' | null>(null);

  useEffect(() => {
    if (data) {
      setNewStatus(data.booking_status || 'pending');
      setNewPayment(data.payment_status || 'pending');
    }
  }, [data]);

  const handleStatusChange = async () => {
    if (!data) return;
    try {
      await updateStatus({ id: data.id, payload: { status: newStatus } }).unwrap();
      toast.success('Status updated');
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePaymentChange = async () => {
    if (!data) return;
    try {
      await updatePayment({ id: data.id, payload: { payment_status: newPayment } }).unwrap();
      toast.success('Payment status updated');
      refetch();
    } catch {
      toast.error('Failed to update payment');
    }
  };

  const handleViewDocument = (type: 'license' | 'aadhaar') => {
    setDocumentView(documentView === type ? null : type);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
  
  if (isError || !data) return (
    <div className="text-center text-red-500 p-8">
      <XCircle className="mx-auto mb-2 h-12 w-12" />
      <p className="text-lg mb-4">Could not load booking details.</p>
      <Button onClick={() => refetch()} variant="outline">Retry</Button>
    </div>
  );

  const vehicleImages = data.vehicle_images ? data.vehicle_images.split(',') : [];
  const modelImages = data.vehicle_model_images ? data.vehicle_model_images.split(',') : [];
  
  const displayImages = imageType === 'vehicle' ? vehicleImages : modelImages;
  const currentImage = displayImages.length > 0 ? displayImages[activeImageIndex] : null;

  const bookingDate = new Date(data.booking_date).toLocaleString();
  const returnDate = new Date(data.return_date).toLocaleString();
  
  const formatAmount = (amount: any) => {
    if (amount === null || amount === undefined) return '0.00';
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0.00';
    
    return typeof numAmount === 'number' ? numAmount.toFixed(2) : '0.00';
  };

  const closeDocumentView = () => {
    setDocumentView(null);
  };

  return (
    <div className="container mx-auto p-6">
      {documentView && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">{documentView === 'license' ? 'Driver License' : 'Aadhaar Card'}</h3>
              <Button variant="ghost" size="sm" onClick={closeDocumentView}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh]">
              {documentView === 'license' && data.licence_image ? (
                <img 
                  src={data.licence_image} 
                  alt="Driver License" 
                  className="w-full object-contain max-h-[70vh]"
                />
              ) : documentView === 'aadhaar' && data.aadhaar_image ? (
                <img 
                  src={data.aadhaar_image} 
                  alt="Aadhaar Card" 
                  className="w-full object-contain max-h-[70vh]"
                />
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Image className="mx-auto h-16 w-16 mb-2 text-gray-400" />
                  <p>Document image not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Badge variant={data.booking_status === 'completed' ? 'success' : 
               data.booking_status === 'cancelled' ? 'destructive' : 'default'}>
          {data.booking_status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Vehicle Images & Customer Details */}
        <Card className="shadow lg:col-span-2">
          <Tabs defaultValue="vehicle">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Booking Details</CardTitle>
                <TabsList>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent>
              <TabsContent value="vehicle" className="pt-2">
                <div className="flex justify-end mb-3">
                  <div className="flex gap-2">
                    <Button 
                      variant={imageType === 'vehicle' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => {
                        setImageType('vehicle');
                        setActiveImageIndex(0);
                      }}
                      disabled={vehicleImages.length === 0}
                    >
                      Actual Vehicle
                    </Button>
                    <Button 
                      variant={imageType === 'model' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => {
                        setImageType('model');
                        setActiveImageIndex(0);
                      }}
                      disabled={modelImages.length === 0}
                    >
                      Model Photos
                    </Button>
                  </div>
                </div>

                {currentImage ? (
                  <div className="space-y-4">
                    <div className="relative h-64 md:h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={currentImage} 
                        alt={`${data.vehicle_brand} ${data.vehicle_model}`} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    {displayImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {displayImages.map((img, idx) => (
                          <div 
                            key={idx}
                            className={`h-16 w-16 rounded cursor-pointer flex-shrink-0 border-2 ${
                              activeImageIndex === idx ? 'border-primary' : 'border-transparent'
                            }`}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover rounded" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-semibold">{data.vehicle_brand} {data.vehicle_model}</p>
                          <p className="text-sm text-gray-500">{data.color}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Registration:</strong> {data.registration_no}</p>
                        <p className="text-sm"><strong>Plate Number:</strong> {data.plate_number}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="customer" className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="pb-3 border-b">
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <UserCircle className="h-4 w-4" /> Customer Information
                      </h3>
                      <p className="text-sm"><strong>Name:</strong> {data.user_name}</p>
                      <p className="text-sm"><strong>Email:</strong> {data.email}</p>
                      <p className="text-sm"><strong>Phone:</strong> {data.phone_number}</p>
                    </div>

                    <div className="pb-3 border-b">
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" /> ID Information
                      </h3>
                      <p className="text-sm"><strong>License Number:</strong> {data.license_number || 'Not available'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Image className="h-4 w-4" /> Verification Documents
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="overflow-hidden">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Driver License</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {data.licence_image ? (
                            <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={data.licence_image} 
                                alt="Driver License" 
                                className="object-cover h-full w-full"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                <Button 
                                  onClick={() => handleViewDocument('license')} 
                                  size="sm" 
                                  variant="secondary"
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                              <p className="text-xs text-gray-500">Not available</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Aadhaar Card</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {data.aadhaar_image ? (
                            <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={data.aadhaar_image} 
                                alt="Aadhaar Card" 
                                className="object-cover h-full w-full"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                <Button 
                                  onClick={() => handleViewDocument('aadhaar')} 
                                  size="sm" 
                                  variant="secondary"
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                              <p className="text-xs text-gray-500">Not available</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {(data.rating || data.review) && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-3">Customer Feedback</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.rating && (
                        <div className="pb-3">
                          <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm">
                            <Star className="h-4 w-4" /> Rating
                          </h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-2">{data.rating}/5</span>
                          </div>
                        </div>
                      )}
                      
                      {data.review && (
                        <div className="pb-3">
                          <h4 className="font-semibold flex items-center gap-2 mb-1 text-sm">
                            <MessageSquare className="h-4 w-4" /> Review
                          </h4>
                          <p className="text-sm italic">"{data.review}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Right column - Booking Details & Status Controls */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Booking #{data.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pb-3 border-b">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" /> Rental Period
                </h3>
                <p className="text-sm"><strong>Pickup:</strong> {bookingDate}</p>
                <p className="text-sm"><strong>Return:</strong> {returnDate}</p>
              </div>
              
              <div className="pb-3 border-b">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" /> Location
                </h3>
                <p className="text-sm">{data.current_address}</p>
              </div>
              
              <div className="pb-3 border-b">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4" /> Payment
                </h3>
                <p className="text-sm"><strong>Total:</strong> ₹{formatAmount(data.total_amount)}</p>
                <Badge className="mt-1" variant={
                  data.payment_status === 'completed' ? 'success' : 
                  data.payment_status === 'pending' ? 'destructive' : 'default'
                }>
                  {data.payment_status}
                </Badge>
              </div>
              
              <div className="space-y-3 pt-2">
                <h3 className="font-semibold">Update Status</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm mb-1">Booking Status</p>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleStatusChange} 
                      disabled={isUpdatingStatus || newStatus === data.booking_status} 
                      className="mt-2 w-full"
                    >
                      {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm mb-1">Payment Status</p>
                    <Select value={newPayment} onValueChange={setNewPayment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handlePaymentChange} 
                      disabled={isUpdatingPayment || newPayment === data.payment_status} 
                      className="mt-2 w-full"
                    >
                      {isUpdatingPayment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {isUpdatingPayment ? 'Updating...' : 'Update Payment'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingDetailsPage;