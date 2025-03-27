import React, { useState, ChangeEvent } from 'react';
import {
    Plus,
    Trash2,
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

interface Vehicle {
    brand: string;
    model: string;
    year: string;
    category: string;
    pricePerDay: string;
    description: string;
    features: string[];
    imageUrl: string;
}

const VehicleManagement: React.FC = () => {
    const [vehicle, setVehicle] = useState<Vehicle>({
        brand: '',
        model: '',
        year: '',
        category: '',
        pricePerDay: '',
        description: '',
        features: [],
        imageUrl: ''
    });

    const brands: string[] = [
        'Toyota', 'Ford', 'BMW', 'Mercedes', 'Honda'
    ];

    const [newFeature, setNewFeature] = useState<string>('');

    const handleAddFeature = () => {
        if (newFeature.trim() && !vehicle.features.includes(newFeature.trim())) {
            setVehicle({
                ...vehicle,
                features: [...vehicle.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (featureToRemove: string) => {
        setVehicle({
            ...vehicle,
            features: vehicle.features.filter(feature => feature !== featureToRemove)
        });
    };

    const handleSubmit = () => {
        console.log('Vehicle Data:', vehicle);
        alert('Vehicle submitted/updated!');
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVehicle({ ...vehicle, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateVehicleField = <K extends keyof Vehicle>(
        field: K,
        value: Vehicle[K]
    ) => {
        setVehicle(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Add/Edit Vehicle</h1>
                <Link to={'/dashboard'}>
                    <Button variant="outline">
                        Back to Dashboard
                    </Button>

                </Link>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <Label className="mb-2">Brand</Label>
                            <Select
                                value={vehicle.brand}
                                onValueChange={(value) => updateVehicleField('brand', value)}
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
                                value={vehicle.model}
                                onChange={(e) => updateVehicleField('model', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">Year</Label>
                            <Input
                                type="number"
                                placeholder="Manufacturing Year"
                                value={vehicle.year}
                                onChange={(e) => updateVehicleField('year', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">Category</Label>
                            <Select
                                value={vehicle.category}
                                onValueChange={(value) => updateVehicleField('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Economy', 'Sedan', 'SUV', 'Luxury', 'Van'].map(category => (
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
                                value={vehicle.pricePerDay}
                                onChange={(e) => updateVehicleField('pricePerDay', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">Image</Label>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Image URL"
                                    value={vehicle.imageUrl}
                                    onChange={(e) => updateVehicleField('imageUrl', e.target.value)}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="imageUpload"
                                    onChange={handleImageUpload}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                >
                                    <ImagePlus />
                                </Button>
                            </div>
                            {vehicle.imageUrl && (
                                <div className="mt-2">
                                    <img
                                        src={vehicle.imageUrl}
                                        alt="Vehicle"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label className="mb-2">Description</Label>
                        <Textarea
                            placeholder="Vehicle Description"
                            value={vehicle.description}
                            onChange={(e) => updateVehicleField('description', e.target.value)}
                        />
                    </div>

                    <div className="mt-6">
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
                            {vehicle.features.map(feature => (
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

                    <div className="mt-6 flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!vehicle.brand || !vehicle.model}
                        >
                            <Save className="mr-2" /> Save Vehicle
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VehicleManagement;