import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  CheckCircle,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Quote,
  Calendar,
  MapPin,
  Star,
  ChevronDown
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// RTK Query Hooks
import { useGetVehiclesQuery } from '@/slices/vehicleApiSlice';
import { useGetVehicleModelsQuery } from '@/slices/vehicleModelApiSlice';
import { useGetActiveTestimonialsQuery } from '@/slices/testimonialApiSlice';

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

  // Fetch active testimonials
  const {
    data: testimonialData,
    isLoading: loadingTestimonials,
    error: errorTestimonials
  } = useGetActiveTestimonialsQuery();

  const testimonials = testimonialData?.testimonials || [];

  // Search form state
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Selected model tab
  const [selectedModelId, setSelectedModelId] = useState('');

  useEffect(() => {
    if (models.length && !selectedModelId) {
      setSelectedModelId(models[0]?.id?.toString() || '');
    }
  }, [models, selectedModelId]);

  const handleSearch = () => {
    navigate(`/search?location=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  // Features section data
  const features = [
    {
      icon: <ShieldCheck className="size-12 text-primary" />,
      title: "Safety First",
      description: "All vehicles undergo rigorous safety inspections before each rental."
    },
    {
      icon: <CheckCircle className="size-12 text-primary" />,
      title: "Quality Guaranteed",
      description: "Top-notch vehicles from trusted brands for a smooth driving experience."
    },
    {
      icon: <HeartHandshake className="size-12 text-primary" />,
      title: "Customer Support",
      description: "Available 24/7 to assist with any issues during your rental period."
    }
  ];

  if (loadingVehicles || loadingModels || loadingTestimonials) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorVehicles || errorModels || errorTestimonials) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p>We're sorry, but there was an error loading the data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero & Search */}
      <div className="relative bg-gradient-to-br from-primary to-primary-foreground text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url('/pattern.svg')", backgroundSize: "cover" }}></div>
        </div>
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/25 backdrop-blur-sm">
            Premium Car Rental Service
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Drive Your <span className="text-yellow-300">Dreams</span></h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Discover the freedom of the open road with our premium fleet of vehicles, perfect for every journey.
          </p>
          <Card className="w-full max-w-4xl mx-auto bg-white/95 text-black shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 size-4 text-gray-400" />
                    <Input 
                      className="pl-10" 
                      placeholder="City or Airport" 
                      value={pickupLocation} 
                      onChange={e => setPickupLocation(e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 size-4 text-gray-400" />
                    <Input 
                      className="pl-10" 
                      type="date" 
                      value={pickupDate} 
                      onChange={e => setPickupDate(e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 size-4 text-gray-400" />
                    <Input 
                      className="pl-10" 
                      type="date" 
                      value={returnDate} 
                      onChange={e => setReturnDate(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white" 
                    size="lg" 
                    onClick={handleSearch}
                  >
                    Search Cars
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="link" className="text-white flex items-center">
              <ChevronDown className="mr-1 size-4" />
              Scroll to explore
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-center">The CarDekho Advantage</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 bg-primary/10 rounded-full p-4 inline-flex">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Models Tabs */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-3">Our Fleet</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Find Your Perfect Ride</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Browse through our extensive collection of vehicles to find the one that suits your needs.
          </p>
        </div>
        
        {models.length > 0 ? (
          <Tabs value={selectedModelId} onValueChange={setSelectedModelId} className="w-full">
            <TabsList className="mb-8 w-full overflow-x-auto flex flex-nowrap justify-start md:justify-center p-1 bg-gray-100 rounded-full">
              {models.map(model => (
                <TabsTrigger 
                  key={model.id} 
                  value={model.id.toString()}
                  className="px-6 py-2 rounded-full"
                >
                  {model.model_name}
                </TabsTrigger>
              ))}
            </TabsList>

            {models.map(model => {
              const filteredVehicles = vehicles.filter(v => v.model_id === model.id);
              
              return (
                <TabsContent key={model.id} value={model.id.toString()}>
                  {filteredVehicles.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {filteredVehicles.map(vehicle => (
                        <Card 
                          key={vehicle.id} 
                          className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                          onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={vehicle.images?.[0] || '/api/placeholder/500/300'}
                              alt={vehicle.registration_no}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
                              <Badge className="bg-primary text-white">{model.model_name}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-xl font-semibold">{vehicle.make} {model.model_name}</h3>
                              <Badge variant="outline">{vehicle.type}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Car className="mr-1 size-4" />
                              <span>{vehicle.registration_no}</span>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-primary text-lg">
                                {vehicle.price_per_day ? `$${vehicle.price_per_day}/day` : 'Contact for pricing'}
                              </div>
                              <Button
                                variant="outline"
                                className="group-hover:bg-primary group-hover:text-white"
                              >
                                View Details <ArrowRight className="ml-1 size-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No vehicles available in this category.
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No vehicle models available at the moment.
          </div>
        )}
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from our satisfied customers about their experiences.
            </p>
          </div>
          
          {testimonials.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {testimonials.map(testimonial => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                    <Card className="h-full border-none shadow-lg">
                      <CardContent className="flex flex-col justify-between h-full p-6">
                        <div>
                          <Quote className="text-primary size-8 opacity-50 mb-4" />
                          <p className="text-gray-700 italic mb-6">{testimonial.content}</p>
                        </div>
                        <div>
                          <div className="flex mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(5 - testimonial.rating)].map((_, i) => (
                              <Star key={i + testimonial.rating} className="size-4 text-gray-300" />
                            ))}
                          </div>
                          <div className="flex items-center">
                            <Avatar className="mr-3">
                              <AvatarFallback className="bg-primary text-white">
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{testimonial.name}</div>
                              <div className="text-sm text-muted-foreground">Verified Customer</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-0 bg-white" />
              <CarouselNext className="hidden md:flex right-0 bg-white" />
            </Carousel>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary to-primary-foreground text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book your perfect ride today and experience the freedom of the open road.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/search')}
              className="text-primary"
            >
              Browse Cars <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button 
              size="lg" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/contact-us')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRentalHomePage;