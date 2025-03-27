import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Mail, 
  Reply, 
  Filter, 
  Trash2 
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
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
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
import { Card } from "@/components/ui/card";

type QueryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

interface ContactQuery {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: QueryStatus;
  receivedAt: string;
  replies?: Reply[];
}

interface Reply {
  id: number;
  adminName: string;
  message: string;
  sentAt: string;
}

const ContactManagement: React.FC = () => {
  const [queries, setQueries] = useState<ContactQuery[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 123-4567',
      subject: 'Product Inquiry',
      message: 'I would like to know more about your latest product features.',
      status: 'new',
      receivedAt: '2024-03-25T10:30:00Z',
      replies: []
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      subject: 'Technical Support',
      message: 'I am experiencing issues with my recent purchase.',
      status: 'in-progress',
      receivedAt: '2024-03-24T15:45:00Z',
      replies: [
        {
          id: 1,
          adminName: 'Support Team',
          message: 'We are investigating your issue and will get back to you soon.',
          sentAt: '2024-03-25T11:15:00Z'
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QueryStatus | 'all'>('all');
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const statusColorMap = {
    'new': 'secondary',
    'in-progress': 'warning',
    'resolved': 'success',
    'closed': 'destructive'
  };

  const filteredQueries = useMemo(() => {
    return queries.filter(query => 
      (statusFilter === 'all' || query.status === statusFilter) &&
      (searchQuery === '' || 
        query.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [queries, statusFilter, searchQuery]);

  const handleReplyToQuery = () => {
    if (selectedQuery && replyMessage.trim()) {
      const newReply: Reply = {
        id: (selectedQuery.replies?.length || 0) + 1,
        adminName: 'Support Admin',
        message: replyMessage,
        sentAt: new Date().toISOString()
      };

      const updatedQueries = queries.map(query => 
        query.id === selectedQuery.id 
          ? { 
              ...query, 
              status: 'in-progress', 
              replies: [...(query.replies || []), newReply] 
            } 
          : query
      );

      setQueries(updatedQueries);
      setIsReplyOpen(false);
      setSelectedQuery(null);
      setReplyMessage('');
    }
  };

  const handleDeleteQuery = () => {
    if (deleteQueryId) {
      setQueries(queries.filter(query => query.id !== deleteQueryId));
      setDeleteQueryId(null);
    }
  };

  const updateQueryStatus = (status: QueryStatus) => {
    if (selectedQuery) {
      setQueries(queries.map(query => 
        query.id === selectedQuery.id 
          ? { ...query, status } 
          : query
      ));
      setIsDetailsOpen(false);
      setSelectedQuery(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Queries</h1>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search queries..." 
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as QueryStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status">
                {statusFilter === 'all' ? 'All Queries' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Queries`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queries</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Queries Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{query.name}</TableCell>
                  <TableCell>{query.email}</TableCell>
                  <TableCell>{query.subject}</TableCell>
                  <TableCell>
                    <Badge variant={statusColorMap[query.status]}>
                      {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(query.receivedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedQuery(query);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 w-4 h-4" /> View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedQuery(query);
                          setIsReplyOpen(true);
                        }}
                      >
                        <Reply className="mr-2 w-4 h-4" /> Reply
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setDeleteQueryId(query.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No queries found matching your search or filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Query Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
            <DialogDescription>
              Detailed information about the contact query
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuery && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Name:</p>
                <p className="col-span-3">{selectedQuery.name}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Email:</p>
                <p className="col-span-3">{selectedQuery.email}</p>
              </div>
              {selectedQuery.phone && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="font-bold">Phone:</p>
                  <p className="col-span-3">{selectedQuery.phone}</p>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Subject:</p>
                <p className="col-span-3">{selectedQuery.subject}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Message:</p>
                <p className="col-span-3">{selectedQuery.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Status:</p>
                <Badge variant={statusColorMap[selectedQuery.status]} className="col-span-3">
                  {selectedQuery.status.charAt(0).toUpperCase() + selectedQuery.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Received:</p>
                <p className="col-span-3">
                  {new Date(selectedQuery.receivedAt).toLocaleString()}
                </p>
              </div>
              
              {/* Replies Section */}
              {selectedQuery.replies && selectedQuery.replies.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Replies</h3>
                  {selectedQuery.replies.map((reply) => (
                    <div key={reply.id} className="border-b py-2">
                      <div className="flex justify-between">
                        <p className="font-medium">{reply.adminName}</p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(reply.sentAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-1">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Status Update Buttons */}
              <DialogFooter className="mt-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => updateQueryStatus('in-progress')}
                  >
                    Mark In Progress
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => updateQueryStatus('resolved')}
                  >
                    Mark Resolved
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => updateQueryStatus('closed')}
                  >
                    Close Query
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Query</DialogTitle>
            <DialogDescription>
              Respond to the customer's query
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuery && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">To:</p>
                <p className="col-span-3">{selectedQuery.name} ({selectedQuery.email})</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Subject:</p>
                <p className="col-span-3">Re: {selectedQuery.subject}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="replyMessage" className="text-right">Message:</label>
                <Textarea
                  id="replyMessage"
                  className="col-span-3"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleReplyToQuery}
                  disabled={!replyMessage.trim()}
                >
                  <Mail className="mr-2 w-4 h-4" /> Send Reply
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Query Confirmation */}
      <AlertDialog 
        open={deleteQueryId !== null} 
        onOpenChange={() => setDeleteQueryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this query? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuery}>
              Delete Query
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactManagement;