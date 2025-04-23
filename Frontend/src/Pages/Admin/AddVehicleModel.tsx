import React, { useState, ChangeEvent, useEffect } from 'react';
import { Plus, Save, X, Edit, Trash2, Eye, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useGetBrandsQuery } from '@/slices/brandApiSlice';
import {
  useGetVehicleModelsQuery,
  useAddVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation
} from '@/slices/vehicleModelApiSlice';

interface VehicleModelForm {
  brand_id: string;
  model_name: string;
  category: string;
  price_per_day: string;
  description: string;
  features: string[];
  images: File[];
  previewUrls: string[];
  fuel_type: string;
  transmission: string;
  number_of_doors: string;
  number_of_seats: string;
}

const VehicleModelManagement: React.FC = () => {
  const { data: brandData, isLoading: loadingBrands } = useGetBrandsQuery();
  const { data: modelData, refetch: refetchModels, isLoading: loadingModels } = useGetVehicleModelsQuery();
  const [addModel, { isLoading: adding }] = useAddVehicleModelMutation();
  const [updateModel, { isLoading: updating }] = useUpdateVehicleModelMutation();
  const [deleteModel, { isLoading: deleting }] = useDeleteVehicleModelMutation();

  const brands = brandData?.brands || [];
  const models = Array.isArray(modelData) ? modelData : [];

  const [mode, setMode] = useState<'list' | 'add' | 'edit' | 'view'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [newFeature, setNewFeature] = useState('');
  const [form, setForm] = useState<VehicleModelForm>({
    brand_id: '',
    model_name: '',
    category: '',
    price_per_day: '',
    description: '',
    features: [],
    images: [],
    previewUrls: [],
    fuel_type: '',
    transmission: '',
    number_of_doors: '',
    number_of_seats: ''
  });

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && selectedId !== null) {
      const model = models.find(m => m.id === selectedId);
      if (model) {
        setForm({
          brand_id: String(model.brand_id),
          model_name: model.model_name,
          category: model.category,
          price_per_day: String(model.price_per_day),
          description: model.description,
          features: Array.isArray(model.features) ? model.features : [],
          images: [],
          previewUrls: model.images || [],
          fuel_type: model.fuel_type,
          transmission: model.transmission,
          number_of_doors: String(model.number_of_doors),
          number_of_seats: String(model.number_of_seats)
        });
      }
    }
  }, [mode, selectedId, models]);

  const updateField = <K extends keyof VehicleModelForm>(key: K, value: VehicleModelForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddFeature = () => {
    const feature = newFeature.trim();
    if (feature && !form.features.includes(feature)) {
      updateField('features', [...form.features, feature]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    updateField('features', form.features.filter(f => f !== feature));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    Array.from(e.target.files).forEach(file => {
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });
    
    updateField('images', [...form.images, ...newFiles]);
    updateField('previewUrls', [...form.previewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const images = [...form.images];
    const previews = [...form.previewUrls];
    
    images.splice(index, 1);
    previews.splice(index, 1);
    
    updateField('images', images);
    updateField('previewUrls', previews);
  };

  const resetForm = () => {
    setForm({
      brand_id: '',
      model_name: '',
      category: '',
      price_per_day: '',
      description: '',
      features: [],
      images: [],
      previewUrls: [],
      fuel_type: '',
      transmission: '',
      number_of_doors: '',
      number_of_seats: ''
    });
    setActiveTab("basic");
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('brand_id', form.brand_id);
      formData.append('model_name', form.model_name);
      formData.append('category', form.category);
      formData.append('price_per_day', form.price_per_day);
      formData.append('description', form.description);
      formData.append('features', JSON.stringify(form.features));
      formData.append('fuel_type', form.fuel_type);
      formData.append('transmission', form.transmission);
      formData.append('number_of_doors', form.number_of_doors);
      formData.append('number_of_seats', form.number_of_seats);
      
      form.images.forEach(img => formData.append('images', img));

      if (mode === 'add') {
        await addModel(formData).unwrap();
        toast.success('Vehicle model added successfully');
        resetForm();
      } else if (mode === 'edit' && selectedId !== null) {
        await updateModel({ id: selectedId, payload: formData }).unwrap();
        toast.success('Vehicle model updated successfully');
      }
      
      refetchModels();
      setMode('list');
      setSelectedId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.error || 'Operation failed');
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle model?')) return;
    
    try {
      await deleteModel({ id }).unwrap();
      toast.success('Vehicle model deleted successfully');
      refetchModels();
    } catch (err) {
      toast.error('Failed to delete vehicle model');
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* List view */}
      {mode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Vehicle Models</h1>
              <p className="text-gray-500 mt-1">Manage your available vehicle models</p>
            </div>
            <Button onClick={() => { resetForm(); setMode('add'); }}>
              <Plus className="mr-2" /> Add New Model
            </Button>
          </div>

          {loadingModels ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map(model => (
                <Card key={model.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{model.model_name}</CardTitle>
                        <CardDescription>
                          {brands.find(b => b.id === model.brand_id)?.brand_name}
                        </CardDescription>
                      </div>
                      <Badge>{model.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-lg font-semibold">₹{model.price_per_day}/day</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{model.fuel_type}</span>
                        <span className="mr-3">{model.transmission}</span>
                        <span>{model.number_of_seats} seats</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => { setSelectedId(model.id); setMode('view'); }}
                      >
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => { setSelectedId(model.id); setMode('edit'); }}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDelete(model.id)} 
                        disabled={deleting}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {models.length === 0 && !loadingModels && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 mb-4">No vehicle models found</p>
              <Button onClick={() => { resetForm(); setMode('add'); }}>Add Your First Model</Button>
            </Card>
          )}
        </>
      )}

      {/* Add/Edit/View Form */}
      {mode !== 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setMode('list'); setSelectedId(null); }}
                  className="mr-4"
                >
                  <ArrowLeft />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">
                    {mode === 'add' && 'Add New Vehicle Model'}
                    {mode === 'edit' && 'Edit Vehicle Model'}
                    {mode === 'view' && 'Vehicle Model Details'}
                  </h1>
                  {mode === 'view' && selectedId !== null && (
                    <p className="text-gray-500 mt-1">
                      {models.find(m => m.id === selectedId)?.model_name}
                    </p>
                  )}
                </div>
              </div>
              {mode === 'view' && (
                <Button 
                  onClick={() => { setMode('edit'); }}
                  variant="outline"
                >
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="details">Details & Images</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={form.brand_id}
                      onValueChange={v => updateField('brand_id', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="brand" className="mt-1">
                        <SelectValue placeholder={loadingBrands ? 'Loading brands...' : 'Select a brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={String(brand.id)}>
                            {brand.brand_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model_name">Model Name</Label>
                    <Input
                      id="model_name"
                      value={form.model_name}
                      onChange={e => updateField('model_name', e.target.value)}
                      disabled={mode === 'view'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={v => updateField('category', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Truck', 'Van', 'Luxury'].map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price_per_day">Price per Day (₹)</Label>
                    <Input
                      id="price_per_day"
                      type="number"
                      value={form.price_per_day}
                      onChange={e => updateField('price_per_day', e.target.value)}
                      disabled={mode === 'view'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => { setMode('list'); setSelectedId(null); }}
                  >
                    Cancel
                  </Button>
                  {mode !== 'view' && (
                    <Button onClick={() => setActiveTab("specs")}>
                      Continue
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fuel_type">Fuel Type</Label>
                    <Select
                      value={form.fuel_type}
                      onValueChange={v => updateField('fuel_type', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="fuel_type" className="mt-1">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'].map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={form.transmission}
                      onValueChange={v => updateField('transmission', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="transmission" className="mt-1">
                        <SelectValue placeholder="Select transmission type" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Automatic', 'Manual', 'Semi-automatic', 'CVT'].map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="number_of_doors">Number of Doors</Label>
                    <Select
                      value={form.number_of_doors}
                      onValueChange={v => updateField('number_of_doors', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="number_of_doors" className="mt-1">
                        <SelectValue placeholder="Select doors" />
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
                    <Label htmlFor="number_of_seats">Number of Seats</Label>
                    <Select
                      value={form.number_of_seats}
                      onValueChange={v => updateField('number_of_seats', v)}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger id="number_of_seats" className="mt-1">
                        <SelectValue placeholder="Select seats" />
                      </SelectTrigger>
                      <SelectContent>
                        {['2', '4', '5', '6', '7', '8', '9'].map(seats => (
                          <SelectItem key={seats} value={seats}>
                            {seats}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("basic")}
                  >
                    Back
                  </Button>
                  {mode !== 'view' && (
                    <Button onClick={() => setActiveTab("details")}>
                      Continue
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Details & Images Tab */}
              <TabsContent value="details" className="mt-0">
                <div className="mb-6">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={e => updateField('description', e.target.value)}
                    disabled={mode === 'view'}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="mb-6">
                  <Label>Features</Label>
                  {mode !== 'view' && (
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newFeature}
                        onChange={e => setNewFeature(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
                        placeholder="Add a feature"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddFeature}
                        variant="secondary"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.features.length === 0 ? (
                      <p className="text-gray-500 text-sm">No features added</p>
                    ) : (
                      form.features.map(feature => (
                        <Badge key={feature} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                          {feature}
                          {mode !== 'view' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveFeature(feature)}
                            >
                              <X size={12} />
                            </Button>
                          )}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <Label>Images</Label>
                  {mode !== 'view' && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="imageUpload"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="mt-1">
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('imageUpload')!.click()}
                          className="w-full py-15 border-dashed flex flex-col items-center"
                        >
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <span>Click to upload images</span>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {form.previewUrls.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {form.previewUrls.map((url, idx) => (
                        <div key={idx} className="relative rounded-md overflow-hidden">
                          <img
                            src={url}
                            alt={`Vehicle preview ${idx + 1}`}
                            className="w-full h-28 object-cover"
                          />
                          {mode !== 'view' && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full"
                              onClick={() => removeImage(idx)}
                            >
                              <X size={14} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mt-2">No images uploaded</p>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("specs")}
                  >
                    Back
                  </Button>
                  {mode !== 'view' && (
                    <Button 
                      onClick={onSubmit} 
                      disabled={adding || updating}
                    >
                      {(adding || updating) ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                          {mode === 'add' ? 'Adding...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2" /> 
                          {mode === 'add' ? 'Add Vehicle Model' : 'Update Vehicle Model'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModelManagement;