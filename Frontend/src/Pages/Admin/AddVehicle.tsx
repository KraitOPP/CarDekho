import React, { useState, useEffect } from 'react';
import {
    Save,
    AlertCircle
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
import { Switch } from "@/components/ui/switch";
import { Link } from 'react-router';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VehicleModel {
    id: string;
    brand: string;
    model: string;
    year: string;
}

interface Vehicle {
    id?: string;
    modelId: string;
    registrationNumber: string;
    licensePlate: string;
    vin: string;
    color: string;
    mileage: string;
    purchaseDate: string;
    insurance: {
        provider: string;
        policyNumber: string;
        expiryDate: string;
        details: string;
    };
    isAvailable: boolean;
}

const AddVehicle: React.FC = () => {
    // This would normally be fetched from your API
    const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([
        { id: '1', brand: 'Toyota', model: 'Corolla', year: '2023' },
        { id: '2', brand: 'Honda', model: 'Civic', year: '2022' },
        { id: '3', brand: 'Ford', model: 'Mustang', year: '2024' },
    ]);

    const [vehicle, setVehicle] = useState<Vehicle>({
        modelId: '',
        registrationNumber: '',
        licensePlate: '',
        vin: '',
        color: '',
        mileage: '',
        purchaseDate: '',
        insurance: {
            provider: '',
            policyNumber: '',
            expiryDate: '',
            details: ''
        },
        isAvailable: true
    });

    const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

    useEffect(() => {
        // Update selected model when modelId changes
        if (vehicle.modelId) {
            const model = vehicleModels.find(m => m.id === vehicle.modelId) || null;
            setSelectedModel(model);
        } else {
            setSelectedModel(null);
        }
    }, [vehicle.modelId, vehicleModels]);

    const handleSubmit = () => {
        console.log('Individual Vehicle Data:', vehicle);
        alert('Vehicle submitted/updated!');
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

    const updateInsuranceField = <K extends keyof Vehicle['insurance']>(
        field: K,
        value: Vehicle['insurance'][K]
    ) => {
        setVehicle(prev => ({
            ...prev,
            insurance: {
                ...prev.insurance,
                [field]: value
            }
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Add Individual Vehicle</h1>
                <div className="flex gap-3">
                    <Link to={'/dashboard'}>
                        <Button variant="outline">
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link to={'/vehicle-models/add'}>
                        <Button>
                            Add Vehicle Model
                        </Button>
                    </Link>
                </div>
            </div>

            {vehicleModels.length === 0 && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No vehicle models found</AlertTitle>
                    <AlertDescription>
                        You need to create a vehicle model before adding individual vehicles.
                        <div className="mt-2">
                            <Link to={'/vehicle-models/add'}>
                                <Button variant="outline" size="sm">
                                    Add Vehicle Model
                                </Button>
                            </Link>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Vehicle Model Selection</h2>
                        <div>
                            <Label className="mb-2">Select Vehicle Model</Label>
                            <Select
                                value={vehicle.modelId}
                                onValueChange={(value) => updateVehicleField('modelId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Vehicle Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleModels.map(model => (
                                        <SelectItem key={model.id} value={model.id}>
                                            {model.brand} {model.model} ({model.year})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedModel && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-md">
                                <p className="font-medium">Selected Model: {selectedModel.brand} {selectedModel.model}</p>
                                <p className="text-sm text-slate-500">Year: {selectedModel.year}</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Registration Number*</Label>
                                <Input
                                    placeholder="Registration Number"
                                    value={vehicle.registrationNumber}
                                    onChange={(e) => updateVehicleField('registrationNumber', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2">License Plate*</Label>
                                <Input
                                    placeholder="License Plate"
                                    value={vehicle.licensePlate}
                                    onChange={(e) => updateVehicleField('licensePlate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2">VIN Number</Label>
                                <Input
                                    placeholder="Vehicle Identification Number"
                                    value={vehicle.vin}
                                    onChange={(e) => updateVehicleField('vin', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Color</Label>
                                <Input
                                    placeholder="Vehicle Color"
                                    value={vehicle.color}
                                    onChange={(e) => updateVehicleField('color', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Current Mileage</Label>
                                <Input
                                    type="number"
                                    placeholder="Mileage in km/miles"
                                    value={vehicle.mileage}
                                    onChange={(e) => updateVehicleField('mileage', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Purchase Date</Label>
                                <Input
                                    type="date"
                                    value={vehicle.purchaseDate}
                                    onChange={(e) => updateVehicleField('purchaseDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Insurance Provider</Label>
                                <Input
                                    placeholder="Insurance Company"
                                    value={vehicle.insurance.provider}
                                    onChange={(e) => updateInsuranceField('provider', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Policy Number</Label>
                                <Input
                                    placeholder="Insurance Policy Number"
                                    value={vehicle.insurance.policyNumber}
                                    onChange={(e) => updateInsuranceField('policyNumber', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Expiry Date</Label>
                                <Input
                                    type="date"
                                    value={vehicle.insurance.expiryDate}
                                    onChange={(e) => updateInsuranceField('expiryDate', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label className="mb-2">Insurance Details</Label>
                                <Textarea
                                    placeholder="Coverage details, special notes, etc."
                                    value={vehicle.insurance.details}
                                    onChange={(e) => updateInsuranceField('details', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Availability Status</h2>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={vehicle.isAvailable}
                                onCheckedChange={(checked) => updateVehicleField('isAvailable', checked)}
                            />
                            <Label>Available for booking</Label>
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
                            disabled={!vehicle.modelId || !vehicle.registrationNumber || !vehicle.licensePlate}
                        >
                            <Save className="mr-2" /> Save Vehicle
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddVehicle;