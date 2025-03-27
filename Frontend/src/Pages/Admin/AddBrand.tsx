import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router';

interface Brand {
    id: number;
    name: string;
    logoUrl: string;
}

const VehicleBrandManagement: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([
        { id: 1, name: 'Toyota', logoUrl: '/placeholder.svg' },
        { id: 2, name: 'Ford', logoUrl: '/placeholder.svg' },
        { id: 3, name: 'BMW', logoUrl: '/placeholder.svg' }
    ]);

    const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({
        name: '',
        logoUrl: ''
    });

    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const handleAddBrand = () => {
        if (newBrand.name.trim()) {
            const brandToAdd: Brand = {
                ...newBrand,
                id: brands.length + 1,
                logoUrl: newBrand.logoUrl || '/placeholder.svg'
            };
            setBrands([...brands, brandToAdd]);
            setNewBrand({ name: '', logoUrl: '' });
        }
    };

    const handleEditBrand = (brand: Brand) => {
        setEditingBrand({ ...brand });
    };

    const handleUpdateBrand = () => {
        if (editingBrand && editingBrand.name.trim()) {
            setBrands(brands.map(b =>
                b.id === editingBrand.id ? editingBrand : b
            ));
            setEditingBrand(null);
        }
    };

    const handleDeleteBrand = (id: number) => {
        setBrands(brands.filter(brand => brand.id !== id));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vehicle Brand Management</h1>
                <Link to={'/dashboard'}>
                    <Button variant="outline">
                        Back to Dashboard
                    </Button>

                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add New Brand</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        <div className="flex-grow">
                            <Label className="mb-2">Brand Name</Label>
                            <Input
                                placeholder="Enter brand name"
                                value={newBrand.name}
                                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                            />
                        </div>
                        <div className="flex-grow">
                            <Label className="mb-2">Logo URL</Label>
                            <Input
                                placeholder="Optional logo URL"
                                value={newBrand.logoUrl}
                                onChange={(e) => setNewBrand({ ...newBrand, logoUrl: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleAddBrand} className="mt-6">
                                <Plus className="mr-2" /> Add Brand
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
                {brands.map((brand) => (
                    <Card key={brand.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={brand.logoUrl}
                                    alt={`${brand.name} logo`}
                                    className="w-16 h-16 object-contain"
                                />
                                <span className="font-semibold">{brand.name}</span>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditBrand(brand)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteBrand(brand.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Brand Dialog */}
            <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Brand</DialogTitle>
                    </DialogHeader>
                    {editingBrand && (
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-2">Brand Name</Label>
                                <Input
                                    value={editingBrand.name}
                                    onChange={(e) => setEditingBrand({
                                        ...editingBrand,
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <Label className="mb-2">Logo URL</Label>
                                <Input
                                    value={editingBrand.logoUrl}
                                    onChange={(e) => setEditingBrand({
                                        ...editingBrand,
                                        logoUrl: e.target.value
                                    })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingBrand(null)}
                                >
                                    <X className="mr-2" /> Cancel
                                </Button>
                                <Button onClick={handleUpdateBrand}>
                                    <Save className="mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VehicleBrandManagement;