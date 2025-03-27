import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Filter, 
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
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import { Card } from "@/components/ui/card";

// Customer Status Types
type CustomerStatus = 'active' | 'inactive' | 'pending';

// Customer Interface
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  registrationDate: string;
  totalBookings: number;
}

const CustomerManagement: React.FC = () => {
  // Initial Customer Data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      registrationDate: '2024-01-15',
      totalBookings: 3
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      status: 'active',
      registrationDate: '2024-02-20',
      totalBookings: 2
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      registrationDate: '2024-03-10',
      totalBookings: 1
    }
  ]);

  // State for filters and modals
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});

  // Status Color Mapping
  const statusColorMap = {
    'active': 'success',
    'inactive': 'destructive',
    'pending': 'secondary'
  };

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => 
      (statusFilter === 'all' || customer.status === statusFilter) &&
      (searchQuery === '' || 
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, statusFilter, searchQuery]);

  // Add New Customer
  const handleAddCustomer = () => {
    if (newCustomer.firstName && newCustomer.lastName && newCustomer.email) {
      const customerToAdd: Customer = {
        ...newCustomer as Customer,
        id: customers.length + 1,
        status: newCustomer.status || 'active',
        registrationDate: new Date().toISOString().split('T')[0],
        totalBookings: 0
      };
      setCustomers([...customers, customerToAdd]);
      setIsAddCustomerOpen(false);
      setNewCustomer({});
    }
  };

  // Edit Customer
  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, ...newCustomer } 
          : customer
      ));
      setIsEditCustomerOpen(false);
      setSelectedCustomer(null);
      setNewCustomer({});
    }
  };

  // Delete Customer
  const handleDeleteCustomer = () => {
    if (deleteCustomerId) {
      setCustomers(customers.filter(customer => customer.id !== deleteCustomerId));
      setDeleteCustomerId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        
        {/* Filters and Actions */}
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

          {/* Status Filter */}
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as CustomerStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status">
                {statusFilter === 'all' ? 'All Customers' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Customers`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Add New Customer Button */}
          <Button onClick={() => setIsAddCustomerOpen(true)}>
            <Plus className="mr-2 w-4 h-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Badge variant={statusColorMap[customer.status]}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.registrationDate}</TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onSelect={() => {
                            setSelectedCustomer(customer);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="mr-2 w-4 h-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => {
                            setSelectedCustomer(customer);
                            setNewCustomer(customer);
                            setIsEditCustomerOpen(true);
                          }}
                        >
                          <Edit className="mr-2 w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => setDeleteCustomerId(customer.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                <p className="font-bold">Status:</p>
                <Badge variant={statusColorMap[selectedCustomer.status]} className="col-span-3">
                  {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                </Badge>
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

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="firstName" className="text-right">First Name</label>
              <Input 
                id="firstName" 
                className="col-span-3"
                value={newCustomer.firstName || ''}
                onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                placeholder="Enter first name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastName" className="text-right">Last Name</label>
              <Input 
                id="lastName" 
                className="col-span-3"
                value={newCustomer.lastName || ''}
                onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                placeholder="Enter last name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input 
                id="email" 
                type="email"
                className="col-span-3"
                value={newCustomer.email || ''}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">Phone</label>
              <Input 
                id="phone" 
                className="col-span-3"
                value={newCustomer.phone || ''}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">Status</label>
              <Select
                value={newCustomer.status || 'active'}
                onValueChange={(value) => setNewCustomer({...newCustomer, status: value as CustomerStatus})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddCustomer}
              disabled={!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email}
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerOpen} onOpenChange={() => {
        setIsEditCustomerOpen(false);
        setSelectedCustomer(null);
        setNewCustomer({});
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer profile information
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editFirstName" className="text-right">First Name</label>
                <Input 
                  id="editFirstName" 
                  className="col-span-3"
                  value={newCustomer.firstName || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editLastName" className="text-right">Last Name</label>
                <Input 
                  id="editLastName" 
                  className="col-span-3"
                  value={newCustomer.lastName || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editEmail" className="text-right">Email</label>
                <Input 
                  id="editEmail" 
                  type="email"
                  className="col-span-3"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editPhone" className="text-right">Phone</label>
                <Input 
                  id="editPhone" 
                  className="col-span-3"
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editStatus" className="text-right">Status</label>
                <Select
                  value={newCustomer.status || selectedCustomer.status}
                  onValueChange={(value) => setNewCustomer({...newCustomer, status: value as CustomerStatus})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleEditCustomer}
              disabled={!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email}
            >
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Confirmation */}
      <AlertDialog 
        open={deleteCustomerId !== null} 
        onOpenChange={() => setDeleteCustomerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerManagement;