import { useState, useEffect } from 'react';
import { 
  Save, 
  Edit, 
  Plus, 
  Trash2, 
  MapPin, 
  Facebook,
  Instagram,
  Linkedin,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGetContactQueriesQuery, useUpdateContactInfoMutation } from "@/slices/contactApiSlice";
import { useSelector } from 'react-redux';
import { selectUser } from '@/slices/authSlice';

interface WorkingDay {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

const ContactUsManagement = () => {
  const userInfo = useSelector(selectUser);
  const { data: contactInfoData, isLoading, refetch } = useGetContactQueriesQuery();
  const [updateContactInfo, { isLoading: isUpdating }] = useUpdateContactInfoMutation();
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [config, setConfig] = useState({
    company_name: '',
    main_email: '',
    main_phone: '',
    support_email: '',
    office_address: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    working_days: [] as WorkingDay[],
    updated_by: userInfo.id 
  });

  const [originalConfig, setOriginalConfig] = useState({...config});
  const [isWorkingDayModalOpen, setIsWorkingDayModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [tempWorkingDay, setTempWorkingDay] = useState<WorkingDay>({
    id: '', day: '', openTime: '', closeTime: '', isOpen: true
  });

  useEffect(() => {
    if (contactInfoData?.contact_info) {
      const info = contactInfoData.contact_info;
      let workingDays = [];
      
      try {
        workingDays = typeof info.working_days === 'string' 
          ? JSON.parse(info.working_days)
          : info.working_days || [];
      } catch (error) {
        console.error("Error parsing working days:", error);
        workingDays = [];
      }

      const newConfig = {
        company_name: info.company_name || '',
        main_email: info.main_email || '',
        main_phone: info.main_phone || '',
        support_email: info.support_email || '',
        office_address: info.office_address || '',
        facebook_url: info.facebook_url || '',
        instagram_url: info.instagram_url || '',
        linkedin_url: info.linkedin_url || '',
        working_days: workingDays,
        updated_by: userInfo.id
      };

      setConfig(newConfig);
      setOriginalConfig({...newConfig});
    }
  }, [contactInfoData]);

  const updateConfigField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingDayAction = () => {
    const isEditing = tempWorkingDay.id !== '';
    
    if (isEditing) {
      setConfig(prev => ({
        ...prev,
        working_days: prev.working_days.map(day => 
          day.id === tempWorkingDay.id ? tempWorkingDay : day
        )
      }));
    } else {
      const newWorkingDay = {
        ...tempWorkingDay,
        id: `${Date.now()}`
      };
      setConfig(prev => ({
        ...prev,
        working_days: [...prev.working_days, newWorkingDay]
      }));
    }

    setIsWorkingDayModalOpen(false);
    setTempWorkingDay({ id: '', day: '', openTime: '', closeTime: '', isOpen: true });
  };

  const handleDeleteWorkingDay = () => {
    if (deleteItemId) {
      setConfig(prev => ({
        ...prev,
        working_days: prev.working_days.filter(day => day.id !== deleteItemId)
      }));
      setDeleteConfirmation(false);
      setDeleteItemId(null);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      // Validate configuration
      if (!config.company_name || !config.main_email) {
        toast.error("Company Name and Main Email are required.");
        return;
      }

      await updateContactInfo(config).unwrap();
      
      toast.success("Your contact information has been successfully updated.");
      setIsEditMode(false);
      setOriginalConfig({...config});
      
      refetch();

    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setConfig({...originalConfig});
    setIsEditMode(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading contact information...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Contact Us Management</h1>
        <div className="space-x-2">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                <X className="mr-2 w-4 h-4" /> Cancel
              </Button>
              <Button onClick={handleSaveConfiguration} disabled={isUpdating}>
                <Save className="mr-2 w-4 h-4" /> {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>
              <Edit className="mr-2 w-4 h-4" /> Edit Information
            </Button>
          )}
        </div>
      </div>

      {/* Main Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="block mb-2">Company Name</Label>
            {isEditMode ? (
              <Input 
                value={config.company_name}
                onChange={(e) => updateConfigField('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.company_name || 'Not set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Main Email</Label>
            {isEditMode ? (
              <Input 
                value={config.main_email}
                onChange={(e) => updateConfigField('main_email', e.target.value)}
                placeholder="Enter main contact email"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.main_email || 'Not set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Main Phone</Label>
            {isEditMode ? (
              <Input 
                value={config.main_phone}
                onChange={(e) => updateConfigField('main_phone', e.target.value)}
                placeholder="Enter main phone number"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.main_phone || 'Not set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Support Email</Label>
            {isEditMode ? (
              <Input 
                value={config.support_email}
                onChange={(e) => updateConfigField('support_email', e.target.value)}
                placeholder="Enter support email"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.support_email || 'Not set'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Office Location Card */}
      <Card>
        <CardHeader>
          <CardTitle>Office Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center">
              <MapPin className="mr-2 w-4 h-4" /> Address
            </Label>
            {isEditMode ? (
              <Input 
                value={config.office_address}
                onChange={(e) => updateConfigField('office_address', e.target.value)}
                placeholder="Enter full address"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.office_address || 'Not set'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Management */}
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Working Hours</CardTitle>
          {isEditMode && (
            <Button 
              onClick={() => {
                setTempWorkingDay({ id: '', day: '', openTime: '', closeTime: '', isOpen: true });
                setIsWorkingDayModalOpen(true);
              }}
            >
              <Plus className="mr-2 w-4 h-4" /> Add Working Hours
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {config.working_days.length === 0 ? (
            <p className="text-muted-foreground py-4">No working hours defined.</p>
          ) : (
            config.working_days.map((day) => (
              <div key={day.id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{day.day}</p>
                  <p className="text-muted-foreground">
                    {day.isOpen 
                      ? `${day.openTime} - ${day.closeTime}` 
                      : 'Closed'}
                  </p>
                </div>
                {isEditMode && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setTempWorkingDay(day);
                        setIsWorkingDayModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setDeleteItemId(day.id);
                        setDeleteConfirmation(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Social Media Management */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center">
              <Facebook className="mr-2 w-4 h-4" /> Facebook URL
            </Label>
            {isEditMode ? (
              <Input 
                value={config.facebook_url}
                onChange={(e) => updateConfigField('facebook_url', e.target.value)}
                placeholder="Enter Facebook page URL"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.facebook_url || 'Not set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <Instagram className="mr-2 w-4 h-4" /> Instagram URL
            </Label>
            {isEditMode ? (
              <Input 
                value={config.instagram_url}
                onChange={(e) => updateConfigField('instagram_url', e.target.value)}
                placeholder="Enter Instagram profile URL"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.instagram_url || 'Not set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <Linkedin className="mr-2 w-4 h-4" /> LinkedIn URL
            </Label>
            {isEditMode ? (
              <Input 
                value={config.linkedin_url}
                onChange={(e) => updateConfigField('linkedin_url', e.target.value)}
                placeholder="Enter LinkedIn page URL"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50">{config.linkedin_url || 'Not set'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Working Day Modal */}
      <Dialog open={isWorkingDayModalOpen} onOpenChange={setIsWorkingDayModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tempWorkingDay.id ? 'Edit Working Hours' : 'Add Working Hours'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Day</Label>
              <Input 
                value={tempWorkingDay.day}
                onChange={(e) => setTempWorkingDay(prev => ({...prev, day: e.target.value}))}
                placeholder="Enter day (e.g., Monday)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>Open</Label>
              <Switch 
                checked={tempWorkingDay.isOpen}
                onCheckedChange={(checked) => setTempWorkingDay(prev => ({...prev, isOpen: checked}))}
              />
            </div>
            {tempWorkingDay.isOpen && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Open Time</Label>
                  <Input 
                    type="time"
                    value={tempWorkingDay.openTime}
                    onChange={(e) => setTempWorkingDay(prev => ({...prev, openTime: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Close Time</Label>
                  <Input 
                    type="time"
                    value={tempWorkingDay.closeTime}
                    onChange={(e) => setTempWorkingDay(prev => ({...prev, closeTime: e.target.value}))}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleWorkingDayAction}
              disabled={!tempWorkingDay.day || (tempWorkingDay.isOpen && (!tempWorkingDay.openTime || !tempWorkingDay.closeTime))}
            >
              <Save className="mr-2 w-4 h-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmation} 
        onOpenChange={setDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this working day? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkingDay}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactUsManagement;