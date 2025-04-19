import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, CarFrontIcon } from "lucide-react";
import {
  useAddTestimonialMutation,
  useGetActiveTestimonialsQuery,
} from "@/slices/testimonialApiSlice";
import { toast } from "sonner";

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

  const {
    data: activeData,
    isLoading: isTestimonialsLoading,
    isError: isTestimonialsError,
  } = useGetActiveTestimonialsQuery();

  const [
    addTestimonial,
    { isLoading: isAdding, isSuccess: addSuccess, isError: addError, error: addErrorData }
  ] = useAddTestimonialMutation();

  const validateForm = () => {
    const newErrors: Partial<RentalTestimonial> = {};
    if (!testimonial.message.trim()) newErrors.message = 'Testimonial message is required';
    if (testimonial.rating === 0) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addTestimonial({ content: testimonial.message, rating: testimonial.rating }).unwrap();
      toast.success('Thank you for sharing your experience!', {
        duration: 3000,
        position: 'top-center',
      });
      setTestimonial({ rating: 0, message: '' });
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to submit testimonial';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const renderStarRating = () => (
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Submission Card */}
      <Card className="mb-8 w-full">
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
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isAdding}>
                {isAdding ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Testimonials List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">What Our Customers Say</h2>
        {isTestimonialsLoading && <p>Loading testimonials...</p>}
        {isTestimonialsError && (
          <p className="text-red-500">
            Failed to load testimonials.{" "}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                toast.error("Could not fetch testimonials. Please try again later.");
              }}
            >
              View Error
            </Button>
          </p>
        )}
        {activeData?.testimonials?.length === 0 && <p>No testimonials available yet.</p>}
        <div className="space-y-4">
          {activeData?.testimonials?.map((t: any) => (
            <Card key={t.id} className="w-full">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">by {t.name}</span>
                </div>
                <p className="text-gray-700">{t.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}