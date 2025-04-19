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
import { toast } from "sonner";
import {
  useGetTestimonialsQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation
} from '@/slices/testimonialApiSlice';

interface Testimonial {
  id: number;
  name: string;
  email: string;
  content: string;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

const TestimonialManagement: React.FC = () => {
  const {
    data: dataResponse,
    isLoading,
    isError,
    refetch
  } = useGetTestimonialsQuery();

  const testimonials: Testimonial[] = dataResponse?.testimonials || [];
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [viewTestimonial, setViewTestimonial] = useState<Testimonial | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const isActive = (status: string) => status === 'active';

  const handleToggleStatus = async (t: Testimonial) => {
    const newStatus = isActive(t.status) ? 'inactive' : 'active';
    try {
      await updateTestimonial({ id: t.id, payload: { status: newStatus } }).unwrap();
      toast.success(`Testimonial marked as ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    try {
      await deleteTestimonial({ _id: testimonialToDelete.id }).unwrap();
      toast.success('Testimonial deleted successfully');
      setTestimonialToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete testimonial');
    }
  };

  const handleViewDetails = (t: Testimonial) => {
    setViewTestimonial(t);
    setIsViewDialogOpen(true);
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half-star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    for (let i = 0; i < 5 - Math.ceil(rating); i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) return <p>Loading testimonials...</p>;
  if (isError) return <p className="text-red-500">Error loading testimonials.</p>;

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
        {testimonials.map((t) => (
          <Card key={t.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{t.name}</CardTitle>
                <Badge variant={isActive(t.status) ? 'default' : 'secondary'} className="flex items-center">
                  {t.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="mr-1 w-4 h-4" /> {t.email}
              </p>
              <div className="mt-1">{renderStarRating(t.rating)}</div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm line-clamp-3">{t.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Status</span>
                  <Switch
                    checked={isActive(t.status)}
                    onCheckedChange={() => handleToggleStatus(t)}
                    disabled={isUpdating}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleViewDetails(t)} className="cursor-pointer">
                      <MessageSquare className="mr-2 w-4 h-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setTestimonialToDelete(t)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 w-4 h-4" /> Delete
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
              <Badge variant={viewTestimonial?.status === 'active' ? 'default' : 'secondary'}>
                {viewTestimonial?.status}
              </Badge>
            </div>
            {viewTestimonial && (
              <div className="text-sm text-muted-foreground">
                <p>Created: {formatDate(viewTestimonial.created_at)}</p>
                <p>Last updated: {formatDate(viewTestimonial.updated_at)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsViewDialogOpen(false)}>
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
            <AlertDialogAction onClick={handleDeleteTestimonial} disabled={isDeleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialManagement;