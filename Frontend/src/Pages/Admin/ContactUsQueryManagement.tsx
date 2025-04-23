import React, { useState, useMemo, useEffect } from 'react';
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
import { toast } from "sonner";

import {
  useGetContactQueriesQuery,
  useUpdateContactQueryStatusMutation,
  useDeleteContactQueryMutation,
  useReplyQueryMutation
} from '@/slices/contactApiSlice';

type QueryStatus = 'pending' | 'resolved' | 'closed';

interface ContactQuery {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  status: QueryStatus;
  created_at: string;
  response?: string; // Single response string
}

const ContactManagement: React.FC = () => {
  const {
    data: apiData,
    isLoading,
    isError,
    refetch
  } = useGetContactQueriesQuery();
  const [updateContactQueryStatus, { isLoading: isUpdating }] =
    useUpdateContactQueryStatusMutation();
  const [deleteContactQuery, { isLoading: isDeleting }] =
    useDeleteContactQueryMutation();
  const [replyQuery, { isLoading: isReplying }] = 
    useReplyQueryMutation();

  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QueryStatus | 'all'>('all');
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (apiData) {
      // Map directly from the API data structure
      const mapped = apiData.map(item => ({
        ...item,
        // Handle the case where response might not exist
        response: item.response || ''
      }));
      setQueries(mapped);
    }
  }, [apiData]);

  // Updated status color map to match backend statuses
  const statusColorMap = {
    pending: 'secondary',
    resolved: 'success',
    closed: 'destructive'
  } as const;

  const filteredQueries = useMemo(() => {
    return queries.filter(query =>
      (statusFilter === 'all' || query.status === statusFilter) &&
      (searchQuery === '' ||
        query.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [queries, statusFilter, searchQuery]);

  const handleReplyToQuery = async () => {
    if (selectedQuery && replyMessage.trim()) {
      try {
        // Call the backend API to send the reply
        await replyQuery({
          id: selectedQuery.id,
          payload: { response: replyMessage }
        }).unwrap();
        
        toast.success('Reply sent successfully');
        
        // Update status to resolved after successful reply
        await updateContactQueryStatus({
          id: selectedQuery.id,
          payload: { status: 'resolved' }
        }).unwrap();
        
        refetch(); // Refresh data from server
        
        // Close dialog and reset state
        setIsReplyOpen(false);
        setSelectedQuery(null);
        setReplyMessage('');
      } catch (err: any) {
        toast.error(err.data?.message || 'Failed to send reply');
      }
    }
  };

  const updateQueryStatus = async (newStatus: QueryStatus) => {
    if (!selectedQuery) return;
    try {
      await updateContactQueryStatus({
        id: selectedQuery.id,
        payload: { status: newStatus }
      }).unwrap();
      toast.success(`Status updated to "${newStatus}"`);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update status');
    } finally {
      setIsDetailsOpen(false);
      setSelectedQuery(null);
    }
  };

  const handleDeleteQuery = async () => {
    if (!deleteQueryId) return;
    try {
      await deleteContactQuery(deleteQueryId).unwrap();
      toast.success('Query deleted');
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete query');
    } finally {
      setDeleteQueryId(null);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading queries.</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Page Header + Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Queries</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as QueryStatus | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status">
                {statusFilter === 'all'
                  ? 'All Queries'
                  : `${statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)} Queries`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queries</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
                      {query.status.charAt(0).toUpperCase() +
                        query.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(query.created_at).toLocaleString()}
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
                      {/* Only show Reply button for non-resolved queries */}
                      {query.status !== 'resolved' && (
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
                      )}
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
              {selectedQuery.phone_number && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="font-bold">Phone:</p>
                  <p className="col-span-3">{selectedQuery.phone_number}</p>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Subject:</p>
                <p className="col-span-3">{selectedQuery.subject}</p>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <p className="font-bold">Message:</p>
                <div className="col-span-3 whitespace-pre-wrap border p-3 rounded-md bg-muted/50">
                  {selectedQuery.message}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Status:</p>
                <Badge variant={statusColorMap[selectedQuery.status]} className="col-span-3">
                  {selectedQuery.status.charAt(0).toUpperCase() +
                    selectedQuery.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-bold">Received:</p>
                <p className="col-span-3">
                  {new Date(selectedQuery.created_at).toLocaleString()}
                </p>
              </div>

              {/* Admin Response Section - Only show for resolved queries with a response */}
              {selectedQuery.status === 'resolved' && selectedQuery.response && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <p className="font-bold">Admin Response:</p>
                  <div className="col-span-3 whitespace-pre-wrap border p-3 rounded-md bg-muted/50">
                    {selectedQuery.response}
                  </div>
                </div>
              )}

              {/* Status Update Buttons - Only show for non-resolved queries */}
              {selectedQuery.status !== 'resolved' && (
                <DialogFooter className="mt-4">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updateQueryStatus('resolved')}
                      disabled={isUpdating}
                    >
                      Mark Resolved
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateQueryStatus('closed')}
                      disabled={selectedQuery.status === 'closed' || isUpdating}
                    >
                      Mark Closed
                    </Button>
                  </div>
                </DialogFooter>
              )}
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
                <label htmlFor="to" className="text-right">To:</label>
                <div className="col-span-3">
                  <p className="font-medium">{selectedQuery.name} ({selectedQuery.email})</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="subject" className="text-right">Subject:</label>
                <div className="col-span-3">
                  <p className="font-medium">Re: {selectedQuery.subject}</p>
                </div>
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
                  disabled={!replyMessage.trim() || isReplying}
                >
                  <Mail className="mr-2 w-4 h-4" /> {isReplying ? 'Sending...' : 'Send Reply'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteQueryId !== null}
        onOpenChange={() => setDeleteQueryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this query? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuery} disabled={isDeleting}>
              Delete Query
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactManagement;