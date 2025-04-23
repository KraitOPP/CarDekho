import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useGetAllUsersQuery } from '@/slices/authApiSlice';


interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalBookings: number;
}

const CustomerManagement: React.FC = () => {
  const { data: usersData, isLoading, error } = useGetAllUsersQuery({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const customers: Customer[] = useMemo(() => {
    if (!usersData?.users) return [];
    
    return usersData.users.map(user => {
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const registrationDate = new Date(user.registration_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const formattedDate = registrationDate.toISOString().split('T')[0];
      
      return {
        id: user.id,
        firstName,
        lastName,
        email: user.email,
        phone: user.phone_number || 'Not provided',
        registrationDate: formattedDate,
        totalBookings: user.total_bookings
      };
    });
  }, [usersData]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => 
      
      (searchQuery === '' || 
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, searchQuery]);

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <p className="text-lg">Loading customers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Error loading customers</p>
          <p>Please try again later or contact support.</p>
        </div>
      )}

      {/* Customers Table */}
      {!isLoading && !error && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.registrationDate}</TableCell>
                    <TableCell>{customer.totalBookings}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 w-4 h-4" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No customers found matching your search or filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information about the customer
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Name:</p>
                <p className="col-span-3">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Email:</p>
                <p className="col-span-3">{selectedCustomer.email}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Phone:</p>
                <p className="col-span-3">{selectedCustomer.phone}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Registration Date:</p>
                <p className="col-span-3">{selectedCustomer.registrationDate}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Total Bookings:</p>
                <p className="col-span-3">{selectedCustomer.totalBookings}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;