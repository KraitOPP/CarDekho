import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  CheckCircle,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

// RTK Query Hooks
import { useGetVehiclesQuery } from '@/slices/vehicleApiSlice';
import { useGetVehicleModelsQuery } from '@/slices/vehicleModelApiSlice';

const testimonials = [
  { id: 1, name: 'Sarah Johnson', text: 'Amazing service and great car selection! Made my road trip super comfortable.', rating: 5 },
  { id: 2, name: 'Michael Chen', text: 'Smooth booking process and friendly staff. Will definitely rent again!', rating: 4 },
  { id: 3, name: 'Emily Rodriguez', text: 'Perfect for my business travel. Clean cars and reliable performance.', rating: 5 }
];

const CarRentalHomePage = () => {
  const navigate = useNavigate();

  // Fetch vehicles and vehicle models
  const {
    data: vehicles = [],
    isLoading: loadingVehicles,
    error: errorVehicles
  } = useGetVehiclesQuery();

  const {
    data: models = [],
    isLoading: loadingModels,
    error: errorModels
  } = useGetVehicleModelsQuery();

  // Search form state
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Selected model tab
  const [selectedModelId, setSelectedModelId] = useState('');

  useEffect(() => {
    if (models.length && !selectedModelId) {
      setSelectedModelId(models[0].id.toString());
    }
  }, [models, selectedModelId]);

  const handleSearch = () => {
    // Could push search params
    alert(`Searching for cars in ${pickupLocation} from ${pickupDate} to ${returnDate}`);
  };

  if (loadingVehicles || loadingModels) return <div className="text-center py-20">Loading...</div>;
  if (errorVehicles || errorModels) return <div className="text-center py-20 text-red-600">Error loading data.</div>;

  return (
    <div className="bg-white">
      {/* Hero & Search */}
      <div className="relative bg-gradient-to-br from-primary to-primary-foreground text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6">Explore the World, One Rental at a Time</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Discover freedom with our wide range of vehicles. Perfect for every journey, every moment.
          </p>
          <Card className="w-full max-w-4xl mx-auto bg-white text-black shadow-2xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Location</label>
                  <Input placeholder="City or Airport" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Date</label>
                  <Input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Return Date</label>
                  <Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button className="w-full" size="lg" onClick={handleSearch}>Search Cars</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Models Tabs */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Browse by Model</h2>
        <Tabs value={selectedModelId} onValueChange={setSelectedModelId} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            {models.map(model => (
              <TabsTrigger key={model.id} value={model.id.toString()}>
                {model.model_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {models.map(model => (
            <TabsContent key={model.id} value={model.id.toString()}>
              <div className="grid md:grid-cols-3 gap-6">
                {vehicles
                  .filter(v => v.model_id === model.id)
                  .map(v => (
                    <Card key={v.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <img
                          src={v.images?.[0] || '/placeholder.svg'}
                          alt={v.registration_no}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{v.registration_no}</h3>
                        <p className="text-muted-foreground mb-4">{model.model_name}</p>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/vehicle/${v.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Testimonials Carousel */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Travelers Say</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map(testimonial => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="flex flex-col justify-between h-full p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Quote className="text-primary w-12 h-12 opacity-20" />
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-500 text-xl">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 flex-grow">{testimonial.text}</p>
                      <div className="font-semibold text-primary">- {testimonial.name}</div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary to-primary-foreground text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8">Find your perfect ride and start your adventure today!</p>
          <Button size="lg" variant="secondary">Book Now</Button>
        </div>
      </section>
    </div>
  );
};

export default CarRentalHomePage;
