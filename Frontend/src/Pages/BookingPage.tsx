import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useAddBookingMutation } from '@/slices/bookingApiSlice';
import { useGetVehicleModelQuery } from '@/slices/vehicleModelApiSlice';
import { useGetProfileInfoQuery } from '@/slices/authApiSlice';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, FileImage } from 'lucide-react';

export default function CarRentalPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vehicleData, isLoading: isLoadingVehicle, error: vehicleError } = useGetVehicleModelQuery(id);
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileInfoQuery();
  const [addBooking, { isLoading: isBooking }] = useAddBookingMutation();

  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [existingLicenseImage, setExistingLicenseImage] = useState<string | null>(null);
  const [existingAadhaarImage, setExistingAadhaarImage] = useState<string | null>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData?.userInfo) {
      const { address, licenseNumber: userLicenseNumber, licenseImageUrl, aadhaarImageUrl } = profileData.userInfo;
      
      if (address) {
        setHouseNumber(address.houseNumber || '');
        setStreet(address.street || '');
        setArea(address.area || '');
        setCity(address.city || '');
        setStateField(address.state || '');
        setCountry(address.country || '');
        setZipCode(address.zipCode || '');
      }
      
      if (userLicenseNumber) {
        setLicenseNumber(userLicenseNumber);
      }
      
      if (licenseImageUrl) {
        setExistingLicenseImage(licenseImageUrl);
      }
      
      if (aadhaarImageUrl) {
        setExistingAadhaarImage(aadhaarImageUrl);
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (vehicleError) {
      toast.error('Failed to load vehicle details');
    }
  }, [vehicleError]);

  const onLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLicenseFile(file);
    if (file) {
      toast('License selected', { description: file.name });
      setExistingLicenseImage(null); 
    }
  };

  const onAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAadhaarFile(file);
    if (file) {
      toast('Aadhaar selected', { description: file.name });
      setExistingAadhaarImage(null); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !pickupLocation ||
      !pickupDate ||
      !returnDate ||
      !licenseNumber ||
      (!licenseFile && !existingLicenseImage) ||
      (!aadhaarFile && !existingAadhaarImage)
    ) {
      toast.error('Please fill in all required fields and ensure documents are available');
      return;
    }

    const formData = new FormData();
    formData.append('model_id', id as string);
    formData.append('booking_date', pickupDate);
    formData.append('return_date', returnDate);
    formData.append('current_address', pickupLocation);
    formData.append('house_number', houseNumber);
    formData.append('street', street);
    formData.append('area', area);
    formData.append('city', city);
    formData.append('state', stateField);
    formData.append('country', country);
    formData.append('zip_code', zipCode);
    formData.append('license_number', licenseNumber);
    
    if (licenseFile) {
      formData.append('license_image', licenseFile);
    } else if (existingLicenseImage) {
      formData.append('existing_license_image', existingLicenseImage);
    }
    
    if (aadhaarFile) {
      formData.append('aadhaar_image', aadhaarFile);
    } else if (existingAadhaarImage) {
      formData.append('existing_aadhaar_image', existingAadhaarImage);
    }

    try {
      await addBooking(formData).unwrap();
      toast.success('Booking created successfully');
      navigate('/u/booking-history');
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to create booking');
    }
  };

  if (isLoadingVehicle || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading details...</span>
      </div>
    );
  }

  if (!vehicleData && !isLoadingVehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
        <p className="mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/vehicles')}>View All Vehicles</Button>
      </div>
    );
  }

  const features = vehicleData?.model?.features ? 
    (typeof vehicleData.model.features === 'string' ? 
      JSON.parse(vehicleData.model.features) : 
      vehicleData.model.features) : 
    [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Carousel & Features */}
        <div className="space-y-6">
          <div className="relative w-full max-w-lg mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {vehicleData?.images && vehicleData.images.length > 0 ? (
                  vehicleData.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        alt={`${vehicleData.model.model_name} view ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <img
                      src="/placeholder.svg"
                      alt="Vehicle placeholder"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          {/* Vehicle Features */}
          <div>
            <h2 className="text-xl font-bold mb-2">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features && features.length > 0 ? (
                features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    ✓ <span className="truncate">{feat}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No features listed</p>
              )}
            </div>
          </div>
          
          {/* Vehicle Specifications */}
          <div>
            <h2 className="text-xl font-bold mb-2">Specifications</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">
                <span className="font-semibold">Fuel Type:</span> {vehicleData?.model?.fuel_type}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Transmission:</span> {vehicleData?.model?.transmission}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Doors:</span> {vehicleData?.model?.number_of_doors}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Seats:</span> {vehicleData?.model?.number_of_seats}
              </div>
              <div className="text-sm col-span-2">
                <span className="font-semibold">Category:</span> {vehicleData?.model?.category}
              </div>
            </div>
          </div>
          
          {/* Ratings and Reviews */}
          {vehicleData?.avg_rating && (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">★ {vehicleData.avg_rating}</span>
                <span className="text-sm text-gray-600">({vehicleData.total_reviews} reviews)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {vehicleData?.model?.model_name}
            </h1>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            ₹{vehicleData?.model?.price_per_day}
              <span className="text-sm text-gray-500 ml-2">per day</span>
            </div>
            <div className="text-sm text-gray-600">{vehicleData?.model?.description}</div>
          </div>

          {/* Pickup Location & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pickup Location</Label>
              <Select onValueChange={(v) => setPickupLocation(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="hotel">Hotel Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pickup Date</Label>
              <Input
                type="date"
                className="w-full"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Return Date</Label>
              <Input
                type="date"
                className="w-full"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>

          {/* Driver Address */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Driver Address</h2>
              {profileData?.userInfo?.address && (
                <Badge className="ml-2" variant="outline">Auto-filled</Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="House Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
              <Input
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <Input
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input
                placeholder="State"
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
              />
              <Input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <Input
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          {/* License & Aadhaar */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Driver Details</h2>
              {profileData?.userInfo?.licenseNumber && (
                <Badge className="ml-2" variant="outline">Auto-filled</Badge>
              )}
            </div>
            <Input
              placeholder="License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            
            <div>
              <Label>License Image</Label>
              {existingLicenseImage ? (
                <div className="mb-2">
                  <div className="flex items-center p-2 border rounded mt-1">
                    <FileImage className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-sm flex-1 truncate">Existing license image</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setExistingLicenseImage(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onLicenseChange}
                  ref={licenseInputRef}
                />
              )}
            </div>
            
            <div>
              <Label>Aadhaar Image</Label>
              {existingAadhaarImage ? (
                <div className="mb-2">
                  <div className="flex items-center p-2 border rounded mt-1">
                    <FileImage className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-sm flex-1 truncate">Existing Aadhaar image</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setExistingAadhaarImage(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onAadhaarChange}
                  ref={aadhaarInputRef}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Button type="submit" size="lg" disabled={isBooking} className="w-full">
              {isBooking ? 'Booking...' : 'Book Now'}
            </Button>
            <Button 
              type="button" 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const days = returnDate && pickupDate ? 
                  Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                if (days <= 0) {
                  toast.error('Please select valid pickup and return dates');
                  return;
                }
                
                const total = days * vehicleData?.model?.price_per_day;
                toast.info(`Estimated Total: ₹${total}`, { 
                  description: `${days} day${days > 1 ? 's' : ''} × ₹${vehicleData?.model?.price_per_day}/day` 
                });
              }}
            >
              Calculate Total
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}