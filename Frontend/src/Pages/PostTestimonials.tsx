import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, CarFrontIcon } from "lucide-react";

interface RentalTestimonial {
  rating: number;
  message: string;
}

export default function CarRentalTestimonialPage() {
  const [testimonial, setTestimonial] = useState<RentalTestimonial>({
    rating: 0,
    message: ''
  });

  const [errors, setErrors] = useState<Partial<RentalTestimonial>>({});

  const validateForm = () => {
    const newErrors: Partial<RentalTestimonial> = {};
    
    if (!testimonial.message.trim()) newErrors.message = 'Testimonial message is required';
    if (testimonial.rating === 0) newErrors.rating = 'Please select a rating';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Submit the testimonial
      console.log('Car Rental Testimonial Submitted:', testimonial);
      alert('Thank you for sharing your experience!');
      
      // Reset form
      setTestimonial({
        rating: 0,
        message: ''
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
            Rate Our Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-center">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}