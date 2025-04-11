import React, { useState, ChangeEvent } from 'react';
import {
    Plus,
    Save,
    X,
    ImagePlus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router';

interface VehicleModel {
    brand: string;
    model: string;
    year: string;
    category: string;
    pricePerDay: string;
    description: string;
    features: string[];
    images: File[];
    previewUrls: string[];
    fuelType: string;
    transmission: string;
    doors: string;
    seats: string;
    color: string;
}

const VehicleModelManagement: React.FC = () => {
    const [vehicleModel, setVehicleModel] = useState<VehicleModel>({
        brand: '',
        model: '',
        year: '',
        category: '',
        pricePerDay: '',
        description: '',
        features: [],
        images: [],
        previewUrls: [],
        fuelType: '',
        transmission: '',
        doors: '',
        seats: '',
        color: ''
    });

    const brands: string[] = [
        'Toyota', 'Ford', 'BMW', 'Mercedes', 'Honda', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Nissan'
    ];

    const fuelTypes: string[] = [
        'Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG'
    ];

    const transmissions: string[] = [
        'Manual', 'Automatic', 'Semi-Automatic', 'CVT'
    ];

    const [newFeature, setNewFeature] = useState<string>('');

    const handleAddFeature = () => {
        if (newFeature.trim() && !vehicleModel.features.includes(newFeature.trim())) {
            setVehicleModel({
                ...vehicleModel,
                features: [...vehicleModel.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (featureToRemove: string) => {
        setVehicleModel({
            ...vehicleModel,
            features: vehicleModel.features.filter(feature => feature !== featureToRemove)
        });
    };

    const handleSubmit = () => {
        console.log('Vehicle Model Data:', vehicleModel);
        alert('Vehicle model submitted/updated!');
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = [...vehicleModel.images];
        const newPreviewUrls = [...vehicleModel.previewUrls];

        Array.from(files).forEach(file => {
            newImages.push(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviewUrls.push(reader.result as string);
                setVehicleModel({
                    ...vehicleModel,
                    images: newImages,
                    previewUrls: newPreviewUrls
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = [...vehicleModel.images];
        const newPreviewUrls = [...vehicleModel.previewUrls];
        
        newImages.splice(index, 1);
        newPreviewUrls.splice(index, 1);
        
        setVehicleModel({
            ...vehicleModel,
            images: newImages,
            previewUrls: newPreviewUrls
        });
    };

    const updateVehicleModelField = <K extends keyof VehicleModel>(
        field: K,
        value: VehicleModel[K]
    ) => {
        setVehicleModel(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Add/Edit Vehicle Model</h1>
                <div className="flex gap-3">
                    <Link to={'/dashboard'}>
                        <Button variant="outline">
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link to={'/dashboard/vehicle'}>
                        <Button>
                            Add Individual Vehicle
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Brand</Label>
                                <Select
                                    value={vehicleModel.brand}
                                    onValueChange={(value) => updateVehicleModelField('brand', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map(brand => (
                                            <SelectItem key={brand} value={brand}>
                                                {brand}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Model</Label>
                                <Input
                                    placeholder="Vehicle Model"
                                    value={vehicleModel.model}
                                    onChange={(e) => updateVehicleModelField('model', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Category</Label>
                                <Select
                                    value={vehicleModel.category}
                                    onValueChange={(value) => updateVehicleModelField('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Economy', 'Sedan', 'SUV', 'Luxury', 'Van', 'Truck', 'Convertible', 'Sports', 'Minivan'].map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Price per Day</Label>
                                <Input
                                    type="number"
                                    placeholder="Rental Price"
                                    value={vehicleModel.pricePerDay}
                                    onChange={(e) => updateVehicleModelField('pricePerDay', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Fuel Type</Label>
                                <Select
                                    value={vehicleModel.fuelType}
                                    onValueChange={(value) => updateVehicleModelField('fuelType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Fuel Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fuelTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Transmission</Label>
                                <Select
                                    value={vehicleModel.transmission}
                                    onValueChange={(value) => updateVehicleModelField('transmission', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Transmission" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transmissions.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Number of Doors</Label>
                                <Select
                                    value={vehicleModel.doors}
                                    onValueChange={(value) => updateVehicleModelField('doors', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Doors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['2', '3', '4', '5'].map(doors => (
                                            <SelectItem key={doors} value={doors}>
                                                {doors}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Number of Seats</Label>
                                <Select
                                    value={vehicleModel.seats}
                                    onValueChange={(value) => updateVehicleModelField('seats', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Seats" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['2', '4', '5', '7', '8', '9+'].map(seats => (
                                            <SelectItem key={seats} value={seats}>
                                                {seats}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Features & Description</h2>
                        <div className="mb-4">
                            <Label className="mb-2">Description</Label>
                            <Textarea
                                placeholder="Vehicle Description"
                                value={vehicleModel.description}
                                onChange={(e) => updateVehicleModelField('description', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">Features</Label>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    placeholder="Add a feature"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                />
                                <Button onClick={handleAddFeature}>
                                    <Plus className="mr-2" /> Add
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {vehicleModel.features.map(feature => (
                                    <Badge
                                        key={feature}
                                        variant="secondary"
                                        className="flex items-center"
                                    >
                                        {feature}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-2 w-4 h-4"
                                            onClick={() => handleRemoveFeature(feature)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Vehicle Images</h2>
                        <div>
                            <Label className="mb-2">Upload Images</Label>
                            <div className="flex space-x-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="imageUpload"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                    className="w-full"
                                >
                                    <ImagePlus className="mr-2" /> Upload Images
                                </Button>
                            </div>
                            
                            {vehicleModel.previewUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {vehicleModel.previewUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Vehicle ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 w-6 h-6"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!vehicleModel.brand || !vehicleModel.model}
                        >
                            <Save className="mr-2" /> Save Vehicle Model
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VehicleModelManagement;