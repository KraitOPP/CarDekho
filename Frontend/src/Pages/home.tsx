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
  ChevronDown,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";

import { useGetVehiclesQuery } from '@/slices/vehicleApiSlice';
import { useGetVehicleModelsQuery } from '@/slices/vehicleModelApiSlice';
import { useGetActiveTestimonialsQuery } from '@/slices/testimonialApiSlice';

const CarRentalHomePage = () => {
  const navigate = useNavigate();

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

  const {
    data: testimonialData,
    isLoading: loadingTestimonials,
    error: errorTestimonials
  } = useGetActiveTestimonialsQuery();

  const testimonials = testimonialData?.testimonials || [];

  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const [selectedModelId, setSelectedModelId] = useState('all');
  const [filteredModels, setFilteredModels] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    fuelTypes: [],
    transmissions: [],
    availability: 'all', 
    minPrice: '',
    maxPrice: '',
  });

  const categoryOptions = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Truck', 'Van', 'Luxury'];
  const fuelTypeOptions = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  const transmissionOptions = ['Manual', 'Automatic'];

  useEffect(() => {
    if (models.length) {
      applyFilters();
    }
  }, [models, filters, selectedModelId]);

  const applyFilters = () => {
    let filtered = [...models];

    if (selectedModelId !== 'all') {
      filtered = filtered.filter(model => model.id.toString() === selectedModelId);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(model => filters.categories.includes(model.category));
    }

    if (filters.fuelTypes.length > 0) {
      filtered = filtered.filter(model => filters.fuelTypes.includes(model.fuel_type));
    }

    if (filters.transmissions.length > 0) {
      filtered = filtered.filter(model => filters.transmissions.includes(model.transmission));
    }

    if (filters.availability === 'available') {
      filtered = filtered.filter(model => model.isAvailable);
    } else if (filters.availability === 'unavailable') {
      filtered = filtered.filter(model => !model.isAvailable);
    }

    if (filters.minPrice !== '') {
      filtered = filtered.filter(model => parseFloat(model.price_per_day) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      filtered = filtered.filter(model => parseFloat(model.price_per_day) <= parseFloat(filters.maxPrice));
    }

    setFilteredModels(filtered);
  };

  const toggleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category) 
        ? prev.categories.filter(c => c !== category) 
        : [...prev.categories, category]
    }));
  };

  const toggleFuelTypeFilter = (fuelType) => {
    setFilters(prev => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType) 
        ? prev.fuelTypes.filter(f => f !== fuelType) 
        : [...prev.fuelTypes, fuelType]
    }));
  };

  const toggleTransmissionFilter = (transmission) => {
    setFilters(prev => ({
      ...prev,
      transmissions: prev.transmissions.includes(transmission) 
        ? prev.transmissions.filter(t => t !== transmission) 
        : [...prev.transmissions, transmission]
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      fuelTypes: [],
      transmissions: [],
      availability: 'all',
      minPrice: '',
      maxPrice: '',
    });
    setSelectedModelId('all');
  };

  const handleSearch = () => {
    navigate(`/search?location=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  const handleModelClick = (modelId) => {
    navigate(`/vehicle/${modelId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };
  

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
          {/* <Card className="w-full max-w-4xl mx-auto bg-white/95 text-black shadow-2xl backdrop-blur-sm">
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
          </Card> */}
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

      {/* Vehicle Models with Filters */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-3">Our Fleet</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Find Your Perfect Ride</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Browse through our extensive collection of vehicles to find the one that suits your needs.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.availability} 
              onValueChange={(value) => setFilters(prev => ({...prev, availability: value}))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="size-4" />
                  Advanced Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Vehicles</SheetTitle>
                  <SheetDescription>
                    Refine your search with our advanced filter options
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4">
                  <h3 className="font-medium mb-3">Vehicle Category</h3>
                  <div className="space-y-2">
                    {categoryOptions.map(category => (
                      <div 
                        key={category} 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleCategoryFilter(category)}
                      >
                        <div className="flex-shrink-0 mr-2">
                          {filters.categories.includes(category) ? (
                            <CheckSquare className="size-5 text-primary" />
                          ) : (
                            <Square className="size-5" />
                          )}
                        </div>
                        <span>{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="py-4">
                  <h3 className="font-medium mb-3">Fuel Type</h3>
                  <div className="space-y-2">
                    {fuelTypeOptions.map(fuel => (
                      <div 
                        key={fuel} 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleFuelTypeFilter(fuel)}
                      >
                        <div className="flex-shrink-0 mr-2">
                          {filters.fuelTypes.includes(fuel) ? (
                            <CheckSquare className="size-5 text-primary" />
                          ) : (
                            <Square className="size-5" />
                          )}
                        </div>
                        <span>{fuel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="py-4">
                  <h3 className="font-medium mb-3">Transmission</h3>
                  <div className="space-y-2">
                    {transmissionOptions.map(trans => (
                      <div 
                        key={trans} 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleTransmissionFilter(trans)}
                      >
                        <div className="flex-shrink-0 mr-2">
                          {filters.transmissions.includes(trans) ? (
                            <CheckSquare className="size-5 text-primary" />
                          ) : (
                            <Square className="size-5" />
                          )}
                        </div>
                        <span>{trans}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="py-4">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Min Price</label>
                      <Input 
                        type="number" 
                        placeholder="Min ₹" 
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Price</label>
                      <Input 
                        type="number" 
                        placeholder="Max ₹" 
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>

                <SheetFooter className="sm:justify-between mt-6">
                  <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                  <SheetTrigger asChild>
                    <Button>Apply Filters</Button>
                  </SheetTrigger>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-sm text-gray-500">
            {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
          </div>
        </div>
        
        {/* Applied Filters */}
        {(filters.categories.length > 0 || 
          filters.fuelTypes.length > 0 || 
          filters.transmissions.length > 0 || 
          filters.availability !== 'all' ||
          filters.minPrice !== '' ||
          filters.maxPrice !== '' ||
          selectedModelId !== 'all') && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {selectedModelId !== 'all' && models.find(m => m.id.toString() === selectedModelId) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Model: {models.find(m => m.id.toString() === selectedModelId).model_name}
                <button 
                  onClick={() => setSelectedModelId('all')}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.categories.map(cat => (
              <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                {cat}
                <button 
                  onClick={() => toggleCategoryFilter(cat)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.fuelTypes.map(fuel => (
              <Badge key={fuel} variant="secondary" className="flex items-center gap-1">
                {fuel}
                <button 
                  onClick={() => toggleFuelTypeFilter(fuel)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.transmissions.map(trans => (
              <Badge key={trans} variant="secondary" className="flex items-center gap-1">
                {trans}
                <button 
                  onClick={() => toggleTransmissionFilter(trans)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.availability !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.availability === 'available' ? 'Available Only' : 'Unavailable Only'}
                <button 
                  onClick={() => setFilters(prev => ({...prev, availability: 'all'}))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {(filters.minPrice !== '' || filters.maxPrice !== '') && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: {filters.minPrice !== '' ? `₹${filters.minPrice}` : '₹0'} - {filters.maxPrice !== '' ? `$${filters.maxPrice}` : 'Any'}
                <button 
                  onClick={() => setFilters(prev => ({...prev, minPrice: '', maxPrice: ''}))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              className="text-sm h-8 text-gray-500"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Model Grid */}
        {filteredModels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map(model => (
              <Card 
                key={model.id} 
                className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer ${!model.isAvailable ? 'opacity-75' : ''}`}
                onClick={() => handleModelClick(model.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={model.images?.[0] || '/api/placeholder/500/300'}
                    alt={model.model_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Badge className={model.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                      {model.isAvailable ? `${model.available_vehicle_count} Available` : 'Not Available'}
                    </Badge>
                    {model.avg_rating && (
                      <Badge className="bg-yellow-400 text-yellow-900 flex items-center">
                        <Star className="size-3 mr-1 fill-current" />
                        {model.avg_rating}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{model.model_name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{model.category}</Badge>
                    <Badge variant="outline">{model.fuel_type}</Badge>
                    <Badge variant="outline">{model.transmission}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{model.description || 'No description available'}</p>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center mt-3">
                    <div className="font-medium text-primary text-lg">₹{model.price_per_day}/day</div>
                    <Button size="sm" className="bg-primary text-white">
                      View Details <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No vehicles match your filters</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more options</p>
            <Button onClick={resetFilters}>Reset All Filters</Button>
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
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-15">
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
                            <Avatar className="mr-2">
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
              onClick={scrollToTop}
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