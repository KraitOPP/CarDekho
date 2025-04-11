import React, { useState, useRef } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Upload
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
    image: string; // Base64 image or URL
}

const VehicleBrandManagement: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([
        { id: 1, name: 'Toyota', image: '/placeholder.svg' },
        { id: 2, name: 'Ford', image: '/placeholder.svg' },
        { id: 3, name: 'BMW', image: '/placeholder.svg' }
    ]);

    const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({
        name: '',
        image: ''
    });

    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result as string;
            if (isEditing && editingBrand) {
                setEditingBrand({ ...editingBrand, image: base64Image });
            } else {
                setNewBrand({ ...newBrand, image: base64Image });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddBrand = () => {
        if (newBrand.name.trim()) {
            const brandToAdd: Brand = {
                ...newBrand,
                id: brands.length + 1,
                image: newBrand.image || '/placeholder.svg'
            };
            setBrands([...brands, brandToAdd]);
            setNewBrand({ name: '', image: '' });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
            if (editFileInputRef.current) {
                editFileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteBrand = (id: number) => {
        setBrands(brands.filter(brand => brand.id !== id));
    };

    const triggerFileInput = (isEditing: boolean = false) => {
        if (isEditing) {
            editFileInputRef.current?.click();
        } else {
            fileInputRef.current?.click();
        }
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
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-grow">
                            <Label className="mb-2">Brand Name</Label>
                            <Input
                                placeholder="Enter brand name"
                                value={newBrand.name}
                                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex-grow">
                            <Label className="mb-2">Brand Logo</Label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
                                />
                                <Button 
                                    variant="outline" 
                                    onClick={() => triggerFileInput()}
                                    className="flex items-center"
                                >
                                    <Upload className="mr-2 w-4 h-4" /> Upload Logo
                                </Button>
                                {newBrand.image && (
                                    <div className="ml-4 w-10 h-10 relative">
                                        <img
                                            src={newBrand.image}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleAddBrand}>
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
                                    src={brand.image}
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
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="mb-2">Brand Logo</Label>
                                <div className="flex items-center mt-1">
                                    <input
                                        type="file"
                                        ref={editFileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, true)}
                                    />
                                    <Button 
                                        variant="outline" 
                                        onClick={() => triggerFileInput(true)}
                                        className="flex items-center"
                                    >
                                        <Upload className="mr-2 w-4 h-4" /> Upload Logo
                                    </Button>
                                    {editingBrand.image && (
                                        <div className="ml-4 w-10 h-10 relative">
                                            <img
                                                src={editingBrand.image}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
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