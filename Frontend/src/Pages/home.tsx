import React, { useState } from 'react';
import { 
  Car, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CreditCard, 
  HeartHandshake, 
  ArrowRight 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Quote } from "lucide-react";

const cars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Sedan",
    pricePerDay: 45,
    image: "/placeholder.svg",
    features: ["4 Seats", "Automatic", "Fuel Efficient"]
  },
  {
    id: 2,
    name: "Ford Explorer",
    category: "SUV",
    pricePerDay: 65,
    image: "/placeholder.svg",
    features: ["7 Seats", "4WD", "Spacious"]
  },
  {
    id: 3,
    name: "BMW 3 Series",
    category: "Luxury",
    pricePerDay: 85,
    image: "/placeholder.svg",
    features: ["Leather Seats", "Premium Sound", "GPS"]
  }
];

// Temporary testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    text: "Amazing service and great car selection! Made my road trip super comfortable.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    text: "Smooth booking process and friendly staff. Will definitely rent again!",
    rating: 4
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    text: "Perfect for my business travel. Clean cars and reliable performance.",
    rating: 5
  }
];

// Destination data
const destinations = [
  {
    id: 1,
    name: "Miami",
    description: "Scenic coastal drives and vibrant city exploration",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Las Vegas",
    description: "Ultimate road trip destination with endless adventures",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "San Francisco",
    description: "Iconic routes and breathtaking landscapes",
    image: "/placeholder.svg"
  }
];

const CarRentalHomePage = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = () => {
    alert(`Searching for cars in ${pickupLocation} from ${pickupDate} to ${returnDate}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-primary to-primary-foreground text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6">Explore the World, One Rental at a Time</h1>
          <p className="text-xl mb-10 max-w-2xl">Discover freedom with our wide range of vehicles. Perfect for every journey, every moment.</p>
          
          <Card className="w-full max-w-4xl bg-white text-black shadow-2xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Location</label>
                  <Input 
                    placeholder="City or Airport"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Pickup Date</label>
                  <Input 
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Return Date</label>
                  <Input 
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleSearch}
                  >
                    Search Cars
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose RoadMaster Rentals</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <ShieldCheck className="w-12 h-12 text-primary" />, 
              title: "100% Transparent Pricing", 
              description: "No hidden fees. What you see is what you pay." 
            },
            { 
              icon: <CheckCircle className="w-12 h-12 text-primary" />, 
              title: "Wide Vehicle Selection", 
              description: "From economic to luxury, we have it all." 
            },
            { 
              icon: <HeartHandshake className="w-12 h-12 text-primary" />, 
              title: "24/7 Customer Support", 
              description: "We're here whenever you need assistance." 
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Car Categories */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Vehicle Categories</h2>
          <Tabs defaultValue="economy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="suv">SUV</TabsTrigger>
              <TabsTrigger value="luxury">Luxury</TabsTrigger>
              <TabsTrigger value="van">Van</TabsTrigger>
            </TabsList>
            <TabsContent value="economy">
              <div className="grid md:grid-cols-3 gap-6">
                {cars.filter(car => car.category === "Sedan").map(car => (
                  <Card key={car.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-xl font-semibold">{car.name}</h3>
                      <p className="text-muted-foreground mb-2">{car.category}</p>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {/* Other tab contents would be similar */}
          </Tabs>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Popular Rental Destinations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-xl transition-all">
              <CardContent className="p-0">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-muted-foreground mb-4">{destination.description}</p>
                  <Button variant="outline">Explore Routes <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Travelers Say</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
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