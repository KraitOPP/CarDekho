import React, { useState } from 'react';
import { 
  Save, 
  Edit, 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"

interface WorkingHour {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

interface ContactUsConfig {
  companyName: string;
  mainEmail: string;
  mainPhone: string;
  supportEmail: string;
  address: string;
  locationPhone: string;
  locationEmail: string;
  workingHours: WorkingHour[];
  socialMedia: SocialMediaLink[];
  additionalInfo?: string;
}

const ContactUsManagement: React.FC = () => {
  const [config, setConfig] = useState<ContactUsConfig>({
    companyName: 'Acme Corporation',
    mainEmail: 'contact@acmecorp.com',
    mainPhone: '+1 (555) 123-4567',
    supportEmail: 'support@acmecorp.com',
    address: '123 Business Street, Suite 100, Cityville, State 12345',
    locationPhone: '+1 (555) 987-6543',
    locationEmail: 'headquarters@acmecorp.com',
    workingHours: [
      { id: '1', day: 'Monday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { id: '2', day: 'Tuesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { id: '3', day: 'Wednesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { id: '4', day: 'Thursday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { id: '5', day: 'Friday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { id: '6', day: 'Saturday', openTime: '10:00', closeTime: '14:00', isOpen: true },
      { id: '7', day: 'Sunday', openTime: '00:00', closeTime: '00:00', isOpen: false }
    ],
    socialMedia: [
      { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/company/acmecorp' },
      { id: '2', platform: 'Twitter', url: 'https://twitter.com/acmecorp' },
      { id: '3', platform: 'Facebook', url: 'https://facebook.com/acmecorp' }
    ],
    additionalInfo: 'We are committed to providing excellent customer service.'
  });

  const [isWorkingHourModalOpen, setIsWorkingHourModalOpen] = useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
  const [deleteConfirmationType, setDeleteConfirmationType] = useState<'workingHour' | 'socialMedia' | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [tempWorkingHour, setTempWorkingHour] = useState<WorkingHour>({
    id: '', day: '', openTime: '', closeTime: '', isOpen: true
  });
  const [tempSocialMedia, setTempSocialMedia] = useState<SocialMediaLink>({
    id: '', platform: '', url: ''
  });

  const updateConfig = (field: keyof ContactUsConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHourAction = () => {
    const isEditing = tempWorkingHour.id !== '';
    
    if (isEditing) {
      setConfig(prev => ({
        ...prev,
        workingHours: prev.workingHours.map(hour => 
          hour.id === tempWorkingHour.id ? tempWorkingHour : hour
        )
      }));
    } else {
      const newWorkingHour = {
        ...tempWorkingHour,
        id: `${config.workingHours.length + 1}`
      };
      setConfig(prev => ({
        ...prev,
        workingHours: [...prev.workingHours, newWorkingHour]
      }));
    }

    setIsWorkingHourModalOpen(false);
    setTempWorkingHour({ id: '', day: '', openTime: '', closeTime: '', isOpen: true });
  };

  const handleSocialMediaAction = () => {
    const isEditing = tempSocialMedia.id !== '';
    
    if (isEditing) {
      setConfig(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.map(social => 
          social.id === tempSocialMedia.id ? tempSocialMedia : social
        )
      }));
    } else {
      const newSocialMedia = {
        ...tempSocialMedia,
        id: `${config.socialMedia.length + 1}`
      };
      setConfig(prev => ({
        ...prev,
        socialMedia: [...prev.socialMedia, newSocialMedia]
      }));
    }

    setIsSocialMediaModalOpen(false);
    setTempSocialMedia({ id: '', platform: '', url: '' });
  };

  const handleDeleteItem = () => {
    if (deleteConfirmationType && deleteItemId) {
      switch (deleteConfirmationType) {
        case 'workingHour':
          setConfig(prev => ({
            ...prev,
            workingHours: prev.workingHours.filter(hour => hour.id !== deleteItemId)
          }));
          break;
        case 'socialMedia':
          setConfig(prev => ({
            ...prev,
            socialMedia: prev.socialMedia.filter(social => social.id !== deleteItemId)
          }));
          break;
      }
      setDeleteConfirmationType(null);
      setDeleteItemId(null);
    }
  };

  const handleSaveConfiguration = () => {
    try {
      // Validate configuration
      if (!config.companyName || !config.mainEmail) {
        toast({
          title: "Validation Error",
          description: "Company Name and Main Email are required.",
          variant: "destructive"
        });
        return;
      }

      if (!config.address || !config.locationPhone || !config.locationEmail) {
        toast({
          title: "Validation Error",
          description: "Location address, phone, and email are required.",
          variant: "destructive"
        });
        return;
      }

      console.log('Saving configuration:', config);
      
      toast({
        title: "Configuration Saved",
        description: "Your contact us details have been successfully updated.",
        variant: "default"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const socialMediaIcons = {
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Contact Us Management</h1>
        <Button onClick={handleSaveConfiguration}>
          <Save className="mr-2 w-4 h-4" /> Save Configuration
        </Button>
      </div>

      {/* Main Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="block mb-2">Company Name</Label>
            <Input 
              value={config.companyName}
              onChange={(e) => updateConfig('companyName', e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Main Email</Label>
            <Input 
              value={config.mainEmail}
              onChange={(e) => updateConfig('mainEmail', e.target.value)}
              placeholder="Enter main contact email"
            />
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Main Phone</Label>
            <Input 
              value={config.mainPhone}
              onChange={(e) => updateConfig('mainPhone', e.target.value)}
              placeholder="Enter main phone number"
            />
          </div>
          <div className="space-y-2">
            <Label className="block mb-2">Support Email</Label>
            <Input 
              value={config.supportEmail}
              onChange={(e) => updateConfig('supportEmail', e.target.value)}
              placeholder="Enter support email"
            />
          </div>
        </CardContent>
      </Card>

      {/* Single Location Card */}
      <Card>
        <CardHeader>
          <CardTitle>Office Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center">
              <MapPin className="mr-2 w-4 h-4" /> Address
            </Label>
            <Input 
              value={config.address}
              onChange={(e) => updateConfig('address', e.target.value)}
              placeholder="Enter full address"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <Phone className="mr-2 w-4 h-4" /> Location Phone
            </Label>
            <Input 
              value={config.locationPhone}
              onChange={(e) => updateConfig('locationPhone', e.target.value)}
              placeholder="Enter location phone number"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <Mail className="mr-2 w-4 h-4" /> Location Email
            </Label>
            <Input 
              value={config.locationEmail}
              onChange={(e) => updateConfig('locationEmail', e.target.value)}
              placeholder="Enter location email address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Management */}
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Working Hours</CardTitle>
          <Button 
            onClick={() => {
              setTempWorkingHour({ id: '', day: '', openTime: '', closeTime: '', isOpen: true });
              setIsWorkingHourModalOpen(true);
            }}
          >
            <Plus className="mr-2 w-4 h-4" /> Add Working Hours
          </Button>
        </CardHeader>
        <CardContent>
          {config.workingHours.map((hour) => (
            <div key={hour.id} className="border-b py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{hour.day}</p>
                <p className="text-muted-foreground">
                  {hour.isOpen 
                    ? `${hour.openTime} - ${hour.closeTime}` 
                    : 'Closed'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempWorkingHour(hour);
                    setIsWorkingHourModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setDeleteConfirmationType('workingHour');
                    setDeleteItemId(hour.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Media Management */}
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Social Media Links</CardTitle>
          <Button 
            onClick={() => {
              setTempSocialMedia({ id: '', platform: '', url: '' });
              setIsSocialMediaModalOpen(true);
            }}
          >
            <Plus className="mr-2 w-4 h-4" /> Add Social Media
          </Button>
        </CardHeader>
        <CardContent>
          {config.socialMedia.map((social) => (
            <div key={social.id} className="border-b py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {socialMediaIcons[social.platform as keyof typeof socialMediaIcons]}
                <div>
                  <p className="font-semibold">{social.platform}</p>
                  <p className="text-muted-foreground">{social.url}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempSocialMedia(social);
                    setIsSocialMediaModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setDeleteConfirmationType('socialMedia');
                    setDeleteItemId(social.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="block mb-2">Additional Information</Label>
            <Textarea 
              value={config.additionalInfo}
              onChange={(e) => updateConfig('additionalInfo', e.target.value)}
              placeholder="Optional additional contact information or message"
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Modal */}
      <Dialog open={isWorkingHourModalOpen} onOpenChange={setIsWorkingHourModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tempWorkingHour.id ? 'Edit Working Hours' : 'Add Working Hours'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Day</Label>
              <Input 
                value={tempWorkingHour.day}
                onChange={(e) => setTempWorkingHour(prev => ({...prev, day: e.target.value}))}
                placeholder="Enter day (e.g., Monday)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>Open</Label>
              <Switch 
                checked={tempWorkingHour.isOpen}
                onCheckedChange={(checked) => setTempWorkingHour(prev => ({...prev, isOpen: checked}))}
              />
            </div>
            {tempWorkingHour.isOpen && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Open Time</Label>
                  <Input 
                    type="time"
                    value={tempWorkingHour.openTime}
                    onChange={(e) => setTempWorkingHour(prev => ({...prev, openTime: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Close Time</Label>
                  <Input 
                    type="time"
                    value={tempWorkingHour.closeTime}
                    onChange={(e) => setTempWorkingHour(prev => ({...prev, closeTime: e.target.value}))}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleWorkingHourAction}
              disabled={!tempWorkingHour.day || (tempWorkingHour.isOpen && (!tempWorkingHour.openTime || !tempWorkingHour.closeTime))}
            >
              <Save className="mr-2 w-4 h-4" /> Save Working Hours
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social Media Modal */}
      <Dialog open={isSocialMediaModalOpen} onOpenChange={setIsSocialMediaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tempSocialMedia.id ? 'Edit Social Media' : 'Add Social Media'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <select 
                value={tempSocialMedia.platform}
                onChange={(e) => setTempSocialMedia(prev => ({...prev, platform: e.target.value}))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Platform</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                value={tempSocialMedia.url}
                onChange={(e) => setTempSocialMedia(prev => ({...prev, url: e.target.value}))}
                placeholder="Enter full social media profile URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSocialMediaAction}
              disabled={!tempSocialMedia.platform || !tempSocialMedia.url}
            >
              <Save className="mr-2 w-4 h-4" /> Save Social Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmationType !== null} 
        onOpenChange={() => setDeleteConfirmationType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast component for notifications */}
      <Toaster />
    </div>
  );
};

export default ContactUsManagement;