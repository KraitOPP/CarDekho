import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Plus,
  Save,
  X,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useGetVehicleModelsQuery } from '@/slices/vehicleModelApiSlice';
import {
  useGetVehiclesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation
} from '@/slices/vehicleApiSlice';
import { Link } from 'react-router';

interface VehicleForm {
  modelId: string;
  registrationNumber: string;
  licensePlate: string;
  color: string;
  mileage: string;
  purchaseDate: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  insuranceDetails: string;
  isAvailable: boolean;
  images: File[];
  previewUrls: string[];
}

const VehicleManagement: React.FC = () => {
  const { data: modelData, isLoading: loadingModels } = useGetVehicleModelsQuery();
  const { data: vehicleData, refetch: refetchVehicles, isLoading: loadingVehicles } = useGetVehiclesQuery();
  const [addVehicle, { isLoading: adding }] = useAddVehicleMutation();
  const [updateVehicle, { isLoading: updating }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: deleting }] = useDeleteVehicleMutation();

  const vehicleModels = modelData || [];
  const vehicles = Array.isArray(vehicleData) ? vehicleData : [];

  const [mode, setMode] = useState<'list' | 'add' | 'edit' | 'view'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'insurance' | 'details'>('basic');
  const [form, setForm] = useState<VehicleForm>({
    modelId: '',
    registrationNumber: '',
    licensePlate: '',
    color: '',
    mileage: '',
    purchaseDate: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
    insuranceDetails: '',
    isAvailable: true,
    images: [],
    previewUrls: []
  });

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && selectedId !== null) {
      const vehicle = vehicles.find(v => v.id === selectedId);
      if (vehicle) {
        setForm({
          modelId: String(vehicle.model_id),
          registrationNumber: vehicle.registration_no,
          licensePlate: vehicle.plate_number,
          color: vehicle.color,
          mileage: String(vehicle.current_mileage),
          purchaseDate: vehicle.purchase_date,
          insuranceProvider: vehicle.insurance_provider,
          insurancePolicyNumber: vehicle.insurance_policy_number,
          insuranceExpiryDate: vehicle.insurance_expiry_date,
          insuranceDetails: vehicle.insurance_detail || '',
          isAvailable: vehicle.availability_status === 'available',
          images: [],
          previewUrls: vehicle.images || []
        });
      }
    }
  }, [mode, selectedId, vehicles]);

  const updateField = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateInsuranceField = <K extends keyof Pick<VehicleForm,
    'insuranceProvider' | 'insurancePolicyNumber' | 'insuranceExpiryDate' | 'insuranceDetails'>>(
      key: K,
      value: VehicleForm[K]
    ) => updateField(key, value);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    updateField('images', [...form.images, ...files]);
    updateField('previewUrls', [...form.previewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const imgs = [...form.images];
    const previews = [...form.previewUrls];
    imgs.splice(index, 1);
    previews.splice(index, 1);
    updateField('images', imgs);
    updateField('previewUrls', previews);
  };

  const resetForm = () => {
    setForm({
      modelId: '',
      registrationNumber: '',
      licensePlate: '',
      color: '',
      mileage: '',
      purchaseDate: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceExpiryDate: '',
      insuranceDetails: '',
      isAvailable: true,
      images: [],
      previewUrls: []
    });
    setActiveTab('basic');
  };

  const onSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append('model_id', form.modelId);
      payload.append('registration_no', form.registrationNumber);
      payload.append('plate_number', form.licensePlate);
      payload.append('color', form.color);
      payload.append('current_mileage', form.mileage);
      payload.append('purchase_date', form.purchaseDate);
      payload.append('availability_status', form.isAvailable ? 'available' : 'unavailable');
      payload.append('insurance_provider', form.insuranceProvider);
      payload.append('insurance_policy_number', form.insurancePolicyNumber);
      payload.append('insurance_expiry_date', form.insuranceExpiryDate);
      payload.append('insurance_detail', form.insuranceDetails);

      form.images.forEach(img => payload.append('images', img));

      if (mode === 'add') {
        await addVehicle(payload).unwrap();
        toast.success('Vehicle added successfully');
        resetForm();
      } else if (mode === 'edit' && selectedId !== null) {
        await updateVehicle({ id: selectedId, payload }).unwrap();
        toast.success('Vehicle updated successfully');
      }

      refetchVehicles();
      setMode('list');
      setSelectedId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.error || 'Operation failed');
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteVehicle({ id }).unwrap();
      toast.success('Vehicle deleted successfully');
      refetchVehicles();
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  return (
    <div className="container mx-auto py-6">
      {mode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Vehicles</h1>
              <p className="text-gray-500 mt-1">Manage your fleet</p>
            </div>
            <div className='flex items-center space-x-2'>
              <Link to={'/dashboard/vehicle/brands'}>
              <Button>
                <Plus className="mr-2" /> Add Vehicle Brand
              </Button>
              </Link>
              <Link to={'/dashboard/vehicle-model'}>
              <Button>
                <Plus className="mr-2" /> Add Vehicle Model
              </Button>
              </Link>
              <Button onClick={() => { resetForm(); setMode('add'); }}>
                <Plus className="mr-2" /> Add Vehicle
              </Button>
            </div>
          </div>

          {loadingVehicles ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(v => (
                <Card key={v.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{v.registration_no}</CardTitle>
                        <CardDescription>
                          {/* Use the correct model properties */}
                          {vehicleModels.find(m => m.id === v.model_id)?.model_name}
                        </CardDescription>
                      </div>
                      <Badge variant={v.availability_status === 'available' ? 'success' : 'destructive'}>
                        {v.availability_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Plate: {v.plate_number}</p>
                    <p className="text-sm text-gray-500">Color: {v.color}</p>
                    <p className="text-sm text-gray-500">Mileage: {v.current_mileage}</p>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedId(v.id); setMode('view'); }}>
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedId(v.id); setMode('edit'); }}>
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => onDelete(v.id)} disabled={deleting}>
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loadingVehicles && vehicles.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 mb-4">No vehicles found</p>
              <Button onClick={() => { resetForm(); setMode('add'); }}>Add Your First Vehicle</Button>
            </Card>
          )}
        </>
      )}

      {mode !== 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => { setMode('list'); setSelectedId(null); }} className="mr-4">
                  <ArrowLeft />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">
                    {mode === 'add' && 'Add Vehicle'}
                    {mode === 'edit' && 'Edit Vehicle'}
                    {mode === 'view' && 'Vehicle Details'}
                  </h1>
                  {mode === 'view' && selectedId !== null && (
                    <p className="text-gray-500 mt-1">{form.registrationNumber}</p>
                  )}
                </div>
              </div>
              {mode === 'view' && (
                <Button onClick={() => setMode('edit')} variant="outline">
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
                <TabsTrigger value="details">Details & Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Vehicle Model</Label>
                    <Select value={form.modelId} onValueChange={v => updateField('modelId', v)} disabled={mode === 'view'}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={loadingModels ? 'Loading...' : 'Select model'} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Updated to match the backend response structure */}
                        {vehicleModels.map(m => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.model_name} ({m.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Registration No</Label>
                    <Input value={form.registrationNumber} onChange={e => updateField('registrationNumber', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Plate Number</Label>
                    <Input value={form.licensePlate} onChange={e => updateField('licensePlate', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input value={form.color} onChange={e => updateField('color', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Mileage</Label>
                    <Input type="number" value={form.mileage} onChange={e => updateField('mileage', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Purchase Date</Label>
                    <Input type="date" value={form.purchaseDate} onChange={e => updateField('purchaseDate', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={form.isAvailable} onCheckedChange={c => updateField('isAvailable', c)} disabled={mode === 'view'} />
                    <Label>Available</Label>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => mode === 'add' ? (setMode('list'), setSelectedId(null)) : setActiveTab('details')}>
                    {mode === 'add' ? 'Cancel' : 'Back'}
                  </Button>
                  {mode !== 'view' && <Button onClick={() => setActiveTab('insurance')}>Continue</Button>}
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Provider</Label>
                    <Input value={form.insuranceProvider} onChange={e => updateInsuranceField('insuranceProvider', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Policy Number</Label>
                    <Input value={form.insurancePolicyNumber} onChange={e => updateInsuranceField('insurancePolicyNumber', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input type="date" value={form.insuranceExpiryDate} onChange={e => updateInsuranceField('insuranceExpiryDate', e.target.value)} disabled={mode === 'view'} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Details</Label>
                    <Textarea value={form.insuranceDetails} onChange={e => updateInsuranceField('insuranceDetails', e.target.value)} disabled={mode === 'view'} className="mt-1" rows={4} />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('basic')}>Back</Button>
                  {mode !== 'view' && <Button onClick={() => setActiveTab('details')}>Continue</Button>}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div>
                  <Label>Images</Label>
                  <div className="mt-2 mb-4">
                    {mode !== 'view' && (
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-500 mb-2" />
                          <span className="text-sm text-gray-500">Upload images</span>
                          <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    )}

                    {form.previewUrls.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {form.previewUrls.map((url, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden h-32">
                            <img src={url} alt={`Vehicle ${i + 1}`} className="w-full h-full object-cover" />
                            {mode !== 'view' && (
                              <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                onClick={() => removeImage(i)}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No images uploaded</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Selected Vehicle:</Label>
                      <p>
                        {/* Updated to match the backend model structure */}
                        {vehicleModels.find(m => m.id === parseInt(form.modelId))?.model_name || ''} {' '}
                        ({vehicleModels.find(m => m.id === parseInt(form.modelId))?.category || ''})
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Registration No:</Label>
                        <p>{form.registrationNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">License Plate:</Label>
                        <p>{form.licensePlate}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Color:</Label>
                        <p>{form.color}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Current Mileage:</Label>
                        <p>{form.mileage}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Status:</Label>
                        <Badge variant={form.isAvailable ? 'success' : 'destructive'}>
                          {form.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('insurance')}>Back</Button>
                  {mode !== 'view' && (
                    <Button onClick={onSubmit} disabled={adding || updating}>
                      <Save size={16} className="mr-2" />
                      {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
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

export default VehicleManagement;