import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ContactFormProps {}

const ContactForm: React.FC<ContactFormProps> = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="space-y-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Get in Touch</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We would love to hear from you! Whether you have a question, suggestion, or just want to say hello, feel free to reach out.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Contact Details</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar prompt="postal address" className="w-6 h-6" />
              <span className="text-gray-600 dark:text-gray-300">1234 Street, City, State, 56789</span>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar prompt="phone number" className="w-6 h-6" />
              <span className="text-gray-600 dark:text-gray-300">(123) 456-7890</span>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar prompt="email address" className="w-6 h-6" />
              <Link to="/contact" className="text-black-600 hover:underline">
                info@example.com
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Leave a Message</h3>
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
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactForm;