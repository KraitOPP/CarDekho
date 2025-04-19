import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Mail, Linkedin, Twitter, Facebook } from "lucide-react";
import { useAddContactQueryMutation } from "@/slices/contactApiSlice";
import { toast } from "sonner";

// Define interfaces for configuration
interface Location {
  id: string;
  address: string;
  phone: string;
  email: string;
}

interface WorkingHour {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface ContactUsConfig {
  companyName: string;
  mainEmail: string;
  mainPhone: string;
  supportEmail: string;
  locations: Location[];
  workingHours: WorkingHour[];
  socialMedia: SocialMedia[];
  additionalInfo: string;
}

const ContactForm: React.FC = () => {
  const [config] = useState<ContactUsConfig>({
    companyName: 'Car Dekho Corporation',
    mainEmail: 'contact@cardekho.com',
    mainPhone: '+1 (555) 123-4567',
    supportEmail: 'support@cardekho.com',
    locations: [
      {
        id: '1',
        address: '123 Business Street, Suite 100, Cityville, State 12345',
        phone: '+1 (555) 987-6543',
        email: 'headquarters@cardekho.com'
      }
    ],
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

  // Add the toast hook for notifications
  
  // Add the mutation hook
  const [addContactQuery, { isLoading }] = useAddContactQueryMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "", // Added for the backend schema
    subject: "",
    message: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Call the mutation with the form data
      const response = await addContactQuery(formData).unwrap();
      
      // Show success message
      toast.success("Message Sent!",{
        description: response.message || "Your query has been submitted successfully.",
        duration: 5000,
      });
      
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      // Show error message
      toast.error("Error",{
        description: error.data?.error || "Failed to submit your query. Please try again.",
        duration: 5000,
      });
    }
  };

  const socialIcons = {
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />
  };

  return (
    <section className="space-y-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
          Contact {config.companyName}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {config.additionalInfo}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Details Card */}
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              Contact Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Locations */}
            {config.locations.map(location => (
              <div key={location.id} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {location.address}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {location.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-gray-500" />
                  <a 
                    href={`mailto:${location.email}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {location.email}
                  </a>
                </div>
              </div>
            ))}

            {/* Additional Contact Information */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Business Hours
                </span>
              </div>
              {config.workingHours.map(hours => (
                <div 
                  key={hours.id} 
                  className="flex justify-between text-sm text-gray-500"
                >
                  <span>{hours.day}</span>
                  <span>
                    {hours.isOpen 
                      ? `${hours.openTime} - ${hours.closeTime}` 
                      : 'Closed'}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              {config.socialMedia.map(social => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black dark:hover:text-white"
                >
                  {socialIcons[social.platform as keyof typeof socialIcons]}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Form Card */}
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              Leave a Message
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  className="mt-1 block w-full"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="mt-1 block w-full"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <Input 
                  id="phone_number" 
                  placeholder="Enter your phone number" 
                  className="mt-1 block w-full"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </Label>
                <Input 
                  id="subject" 
                  placeholder="Title" 
                  className="mt-1 block w-full"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </Label>
                <Textarea 
                  id="message" 
                  placeholder="Enter your message" 
                  className="mt-1 block w-full min-h-[120px]"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactForm;