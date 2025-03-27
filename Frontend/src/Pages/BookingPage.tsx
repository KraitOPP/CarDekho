import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface CarDetails {
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  features: string[];
}

interface Extra {
  key: keyof SelectedExtras;
  label: string;
  price: number;
}

interface SelectedExtras {
  gps: boolean;
  childSeat: boolean;
  insuranceUpgrade: boolean;
}

export default function CarRentalPage(): React.JSX.Element {
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>({
    gps: false,
    childSeat: false,
    insuranceUpgrade: false,
  });

  const toggleExtra = (extra: keyof SelectedExtras): void => {
    setSelectedExtras((prev) => ({
      ...prev,
      [extra]: !prev[extra],
    }));
  };

  const carDetails: CarDetails = {
    name: "Luxury Performance SUV",
    brand: "PremiumDrive",
    model: "Explorer Elite",
    pricePerDay: 129,
    features: [
      "3.5L V6 Turbo Engine",
      "All-Wheel Drive",
      "Premium Leather Interior",
      "Advanced Safety Systems",
      "Touchscreen Navigation",
    ],
  };

  const carImages: string[] = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  const extraServices: Extra[] = [
    { key: "gps", label: "GPS Navigation", price: 15 },
    { key: "childSeat", label: "Child Seat", price: 20 },
    { key: "insuranceUpgrade", label: "Insurance Upgrade", price: 30 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Carousel & Features */}
        <div className="w-full space-y-6">
          {/* Carousel with improved responsiveness */}
          <div className="relative w-full max-w-lg mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {carImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Card className="rounded-xl">
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <img
                          src={image}
                          alt={`Car view ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Features with improved text handling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {carDetails.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 overflow-hidden"
              >
                <CheckIcon className="flex-shrink-0 w-4 h-4 text-green-500" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="w-full">
          <div className="space-y-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {carDetails.brand} {carDetails.name}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
                <StarIcon className="w-5 h-5 fill-current text-gray-400" />
              </div>
              <Badge variant="outline">4.0 Rating</Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              ${carDetails.pricePerDay}
              <span className="text-sm text-gray-500 ml-2">per day</span>
            </div>
          </div>

          <form className="space-y-6">
            {/* Location and Age Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label className="mb-1 block">Pickup Location</Label>
                <Select>
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
              <div className="w-full">
                <Label className="mb-1 block">Driver's Age</Label>
                <RadioGroup defaultValue="25-plus" className="flex gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under-25" id="under-25" />
                    <Label htmlFor="under-25">Under 25</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-plus" id="25-plus" />
                    <Label htmlFor="25-plus">25 and Over</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label className="mb-1 block">Pickup Date</Label>
                <Input type="date" className="w-full" />
              </div>
              <div className="w-full">
                <Label className="mb-1 block">Return Date</Label>
                <Input type="date" className="w-full" />
              </div>
            </div>

            {/* Driver Details Section */}
            <div className="space-y-4 border-t pt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Driver Details
              </h2>
              <div className="w-full">
                <Label className="mb-1 block">Address</Label>
                <Input
                  type="text"
                  placeholder="Enter your address"
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <Label className="mb-1 block">License Number</Label>
                <Input
                  type="text"
                  placeholder="Enter your license number"
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <Label className="mb-1 block">Upload License Image</Label>
                <Input type="file" className="w-full" />
              </div>

              {/* ID Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <Label className="mb-1 block">ID Type</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers_license">
                        Driver's License
                      </SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="id_card">ID Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Label className="mb-1 block">Upload ID Document</Label>
                  <Input type="file" className="w-full" />
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="w-full">
              <Label className="mb-1 block">Additional Services</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {extraServices.map((extra) => (
                  <div
                    key={extra.key}
                    className={`border rounded-md p-2 flex items-center justify-between cursor-pointer overflow-hidden ${
                      selectedExtras[extra.key]
                        ? "bg-gray-700 border-gray-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => toggleExtra(extra.key)}
                  >
                    <div className="flex items-center overflow-hidden">
                      <input
                        type="checkbox"
                        checked={selectedExtras[extra.key]}
                        onChange={() => toggleExtra(extra.key)}
                        className="mr-2 flex-shrink-0"
                      />
                      <span className="truncate">{extra.label}</span>
                    </div>
                    <span className="text-sm ml-2 flex-shrink-0">
                      ${extra.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Button size="lg" className="w-full">
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Calculate Total
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function StarIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}