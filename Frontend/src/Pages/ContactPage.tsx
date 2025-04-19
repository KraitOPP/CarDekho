import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useAddContactQueryMutation, useGetContactInfoQuery } from "@/slices/contactApiSlice";
import { toast } from "sonner";

interface WorkingDay {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface ContactInfo {
  id: number;
  company_name: string;
  main_email: string;
  support_email: string;
  main_phone: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  working_days: WorkingDay[] | string; 
  updated_by: string | number;
  updated_at: string;
}

const ContactForm: React.FC = () => {
  const { data: contactData, isLoading: isLoadingContact, error: contactError } = useGetContactInfoQuery();
  
  const [addContactQuery, { isLoading }] = useAddContactQueryMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: ""
  });

  const processContactInfo = () => {
    if (!contactData || !contactData.contact_info) {
      return {
        companyName: 'Loading...',
        mainEmail: '',
        supportEmail: '',
        mainPhone: '',
        officeAddress: '',
        workingDays: [],
        socialMedia: []
      };
    }

    const info = contactData.contact_info;
    
    let workingDays = [];
    if (info.working_days) {
      if (typeof info.working_days === 'string') {
        try {
          workingDays = JSON.parse(info.working_days);
        } catch (e) {
          console.error("Error parsing working days:", e);
          workingDays = [];
        }
      } else if (Array.isArray(info.working_days)) {
        workingDays = info.working_days;
      }
    }

    const socialMedia = [];
    if (info.facebook_url) {
      socialMedia.push({ id: '1', platform: 'Facebook', url: info.facebook_url });
    }
    if (info.instagram_url) {
      socialMedia.push({ id: '2', platform: 'Instagram', url: info.instagram_url });
    }
    if (info.linkedin_url) {
      socialMedia.push({ id: '3', platform: 'LinkedIn', url: info.linkedin_url });
    }

    return {
      companyName: info.company_name || 'Company Name',
      mainEmail: info.main_email || '',
      supportEmail: info.support_email || '',
      mainPhone: info.main_phone || '',
      officeAddress: info.office_address || '',
      workingDays: workingDays,
      socialMedia: socialMedia
    };
  };

  const contactInfo = processContactInfo();

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
      const response = await addContactQuery(formData).unwrap();
      
      toast.success("Message Sent!", {
        description: response.message || "Your query has been submitted successfully.",
        duration: 5000,
      });
      
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Error", {
        description: error.data?.error || "Failed to submit your query. Please try again.",
        duration: 5000,
      });
    }
  };

  const socialIcons = {
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />,
    Instagram: <Instagram className="w-5 h-5" />
  };

  if (isLoadingContact) {
    return <div className="flex items-center justify-center p-8">Loading contact information...</div>;
  }

  if (contactError) {
    return (
      <div className="p-8 text-red-500">
        Error loading contact information. Please try again later.
      </div>
    );
  }

  return (
    <section className="space-y-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
          Contact {contactInfo.companyName}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We are committed to providing excellent customer service.
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
          <CardContent className="space-y-6">
            {/* Main Contact Info */}
            <div className="space-y-3">
              {contactInfo.officeAddress && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {contactInfo.officeAddress}
                  </span>
                </div>
              )}
              
              {contactInfo.mainPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {contactInfo.mainPhone}
                  </span>
                </div>
              )}
              
              {contactInfo.mainEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.mainEmail}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {contactInfo.mainEmail}
                  </a>
                </div>
              )}
              
              {contactInfo.supportEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.supportEmail}`} 
                    className="text-blue-600 hover:underline"
                  >
                    <span className="text-gray-600 dark:text-gray-300">Support:</span> {contactInfo.supportEmail}
                  </a>
                </div>
              )}
            </div>

            {/* Working Hours */}
            {contactInfo.workingDays && contactInfo.workingDays.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Business Hours
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {contactInfo.workingDays.map(hours => (
                    <div 
                      key={hours.id} 
                      className="flex justify-between text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span className="font-medium">{hours.day}</span>
                      <span>
                        {hours.isOpen 
                          ? `${hours.openTime} - ${hours.closeTime}` 
                          : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {contactInfo.socialMedia && contactInfo.socialMedia.length > 0 && (
              <div className="flex space-x-4 pt-4 border-t">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Follow us:</span>
                {contactInfo.socialMedia.map(social => (
                  <a 
                    key={social.id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black dark:hover:text-white"
                    title={social.platform}
                  >
                    {socialIcons[social.platform as keyof typeof socialIcons]}
                  </a>
                ))}
              </div>
            )}
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