import React, { useState } from 'react';
import { 
  Trash2, 
  MoreVertical,
  Mail,
  User,
  MessageSquare,
  Plus,
  Star,
  StarHalf
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { Link } from 'react-router';

interface Testimonial {
  id: number;
  name: string;
  email: string;
  content: string;
  rating: number; // Rating out of 5
  isActive: boolean;
}

const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      content: 'An incredible service that transformed our business operations.',
      rating: 4.5,
      isActive: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@globalsolutions.com',
      content: 'Exceptional support and remarkable results.',
      rating: 5,
      isActive: false
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@techcorp.com',
      content: 'Good service but could improve response times.',
      rating: 3.5,
      isActive: true
    }
  ]);

  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [viewTestimonial, setViewTestimonial] = useState<Testimonial | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleToggleStatus = (id: number) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === id 
        ? { ...testimonial, isActive: !testimonial.isActive }
        : testimonial
    ));
  };

  const handleDeleteTestimonial = () => {
    if (testimonialToDelete) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialToDelete.id));
      setTestimonialToDelete(null);
    }
  };

  const handleViewDetails = (testimonial: Testimonial) => {
    setViewTestimonial({...testimonial});
    setIsViewDialogOpen(true);
  };

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`star-${i}`} 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half-star" 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-star-${i}`} 
          className="w-4 h-4 text-gray-300" 
        />
      );
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <Link to="/testimonial/add-new">
          <Button>
            <Plus className="mr-2" /> Add New Testimonial
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <Badge 
                  variant={testimonial.isActive ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {testimonial.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="mr-1 w-4 h-4" /> {testimonial.email}
              </p>
              <div className="mt-1">
                {renderStarRating(testimonial.rating)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm line-clamp-3">{testimonial.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Status</span>
                  <Switch
                    checked={testimonial.isActive}
                    onCheckedChange={() => handleToggleStatus(testimonial.id)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onSelect={() => handleViewDetails(testimonial)}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="mr-2 w-4 h-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => setTestimonialToDelete(testimonial)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{viewTestimonial?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{viewTestimonial?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rating</p>
                {viewTestimonial && renderStarRating(viewTestimonial.rating)}
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Content</p>
                <p className="whitespace-pre-wrap">{viewTestimonial?.content}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={viewTestimonial?.isActive ? 'default' : 'secondary'}>
                {viewTestimonial?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!testimonialToDelete} 
        onOpenChange={() => setTestimonialToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the testimonial from {testimonialToDelete?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTestimonial}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialManagement;