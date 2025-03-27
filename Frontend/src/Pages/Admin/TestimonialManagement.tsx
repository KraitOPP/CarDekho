import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical
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
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  isActive: boolean;
}

const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'John Doe',
      position: 'CEO',
      company: 'Tech Innovations Inc.',
      content: 'An incredible service that transformed our business operations.',
      isActive: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Marketing Director',
      company: 'Global Solutions',
      content: 'Exceptional support and remarkable results.',
      isActive: false
    }
  ]);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

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


  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial({...testimonial});
    setIsDialogOpen(true);
  };

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return;

    if (editingTestimonial.id && testimonials.some(t => t.id === editingTestimonial.id)) {
      // Editing existing testimonial
      setTestimonials(testimonials.map(t => 
        t.id === editingTestimonial.id ? editingTestimonial : t
      ));
    } else {
      // Adding new testimonial
      setTestimonials([...testimonials, editingTestimonial]);
    }

    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleInputChange = (field: keyof Testimonial, value: string | boolean) => {
    if (editingTestimonial) {
      setEditingTestimonial({
        ...editingTestimonial,
        [field]: value
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <Link to={'/testimonial/add-new'}>
        <Button>
          <Plus className="mr-2" /> Add New Testimonial
        </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{testimonial.name}</CardTitle>
                <Badge 
                  variant={testimonial.isActive ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {testimonial.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {testimonial.position} at {testimonial.company}
              </p>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">{testimonial.content}</p>
              
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
                      onSelect={() => handleEditTestimonial(testimonial)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 w-4 h-4" />
                      Edit
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

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial?.id ? 'Edit' : 'Add'} Testimonial
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                id="name" 
                value={editingTestimonial?.name || ''} 
                className="col-span-3"
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input 
                id="position" 
                value={editingTestimonial?.position || ''} 
                className="col-span-3"
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input 
                id="company" 
                value={editingTestimonial?.company || ''} 
                className="col-span-3"
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea 
                id="content" 
                value={editingTestimonial?.content || ''} 
                className="col-span-3"
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Switch
                id="isActive"
                checked={editingTestimonial?.isActive || false}
                onCheckedChange={(checked) => 
                  handleInputChange('isActive', checked)
                }
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveTestimonial}>
              Save
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
              This will permanently delete the testimonial for {testimonialToDelete?.name} from {testimonialToDelete?.company}.
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