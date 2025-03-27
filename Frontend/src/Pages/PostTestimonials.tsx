import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, CarFrontIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";

interface RentalTestimonial {
  name: string;
  email: string;
  carRented: string;
  rentalPeriod: string;
  pickupLocation: string;
  rating: number;
  message: string;
  wouldRentAgain: boolean;
}

export default function CarRentalTestimonialPage() {
  const [testimonial, setTestimonial] = useState<RentalTestimonial>({
    name: '',
    email: '',
    carRented: '',
    rentalPeriod: '',
    pickupLocation: '',
    rating: 0,
    message: '',
    wouldRentAgain: true
  });

  const [errors, setErrors] = useState<Partial<RentalTestimonial>>({});

  const pickupLocations = [
    'Airport Terminal',
    'Downtown Office',
    'Hotel Pickup',
    'Train Station',
    'Home Delivery',
    'Other'
  ];

  const carModels = [
    'Luxury SUV',
    'Compact Car',
    'Sedan',
    'Sports Car',
    'Convertible',
    'Electric Vehicle',
    'Minivan',
    'Truck'
  ];

  const validateForm = () => {
    const newErrors: Partial<RentalTestimonial> = {};
    
    if (!testimonial.name.trim()) newErrors.name = 'Name is required';
    if (!testimonial.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(testimonial.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!testimonial.carRented) newErrors.carRented = 'Please select the car you rented';
    if (!testimonial.pickupLocation) newErrors.pickupLocation = 'Please select pickup location';
    if (!testimonial.rentalPeriod) newErrors.rentalPeriod = 'Rental period is required';
    if (!testimonial.message.trim()) newErrors.message = 'Testimonial message is required';
    if (testimonial.rating === 0) newErrors.rating = 'Please select a rating';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement actual submission logic (e.g., API call)
      console.log('Car Rental Testimonial Submitted:', testimonial);
      alert('Thank you for sharing your experience!');
      
      // Reset form
      setTestimonial({
        name: '',
        email: '',
        carRented: '',
        rentalPeriod: '',
        pickupLocation: '',
        rating: 0,
        message: '',
        wouldRentAgain: true
      });
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-7 w-7 cursor-pointer ${
              testimonial.rating >= star 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            onClick={() => setTestimonial(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
            <CarFrontIcon className="w-10 h-10 text-primary" />
            Share Your Rental Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <span>Full Name</span>
                </Label>
                <Input 
                  value={testimonial.name}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Full Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <span>Email Address</span>
                </Label>
                <Input 
                  type="email"
                  value={testimonial.email}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <CarFrontIcon className="w-4 h-4" />
                  Car Rented
                </Label>
                <Select 
                  value={testimonial.carRented}
                  onValueChange={(value) => setTestimonial(prev => ({ ...prev, carRented: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Car Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.carRented && <p className="text-red-500 text-sm mt-1">{errors.carRented}</p>}
              </div>
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Pickup Location
                </Label>
                <Select 
                  value={testimonial.pickupLocation}
                  onValueChange={(value) => setTestimonial(prev => ({ ...prev, pickupLocation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Pickup Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
              </div>
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" />
                Rental Period
              </Label>
              <Input 
                type="text"
                value={testimonial.rentalPeriod}
                onChange={(e) => setTestimonial(prev => ({ ...prev, rentalPeriod: e.target.value }))}
                placeholder="E.g. 3 days, Weekend, etc."
              />
              {errors.rentalPeriod && <p className="text-red-500 text-sm mt-1">{errors.rentalPeriod}</p>}
            </div>

            <div>
              <Label className="mb-2">Your Rating</Label>
              <div className="flex items-center space-x-4">
                {renderStarRating()}
                {testimonial.rating > 0 && (
                  <span className="text-sm text-gray-500">
                    {testimonial.rating} out of 5
                  </span>
                )}
              </div>
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div>
              <Label className="mb-2">Your Experience</Label>
              <Textarea 
                value={testimonial.message}
                onChange={(e) => setTestimonial(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about your rental experience..."
                className="min-h-[120px]"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="would-rent-again"
                checked={testimonial.wouldRentAgain}
                onChange={(e) => setTestimonial(prev => ({ ...prev, wouldRentAgain: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="would-rent-again" className="cursor-pointer">
                I would rent from this company again
              </Label>
            </div>

            <div className="flex justify-center">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Testimonial
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}