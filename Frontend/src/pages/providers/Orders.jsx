import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Calendar, Eye, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { toast } from 'sonner';
import { mockProviderOrders } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  useEffect(() => {
    // Use mock data - show all orders
    setOrders(mockProviderOrders);
  }, []);

  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    // Update the order in the mock data
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus, notes: updateNotes || order.notes }
        : order
    );

    setOrders(updatedOrders);
    toast.success('Order status updated successfully');
    setShowUpdateDialog(false);
    setUpdateNotes('');
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      in_progress: 'default',
      completed: 'default',
      cancelled: 'destructive'
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const configs = {
      emergency: {
        icon: <Zap className="h-3 w-3" />,
        className: 'bg-red-500 text-white border-red-600',
        label: 'Emergency'
      },
      urgent: {
        icon: <AlertTriangle className="h-3 w-3" />,
        className: 'bg-orange-500 text-white border-orange-600',
        label: 'Urgent'
      },
      normal: {
        icon: null,
        className: 'bg-gray-500 text-white border-gray-600',
        label: 'Normal'
      }
    };
    const config = configs[urgency];
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 md:pt-0">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            <h1 className="text-3xl mb-2 text-foreground">Orders Management</h1>
            <p className="text-muted-foreground">Manage your bookings and customer requests</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer or service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
              <CardContent className="pt-6">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No orders found matching your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.01 }}
                        className="p-6 rounded-xl bg-(--surface) border border-border/40 hover:bg-secondary/50 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-foreground text-lg">{order.customer_name}</h3>
                              {getStatusBadge(order.status)}
                              {getUrgencyBadge(order.urgency)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <p className="text-muted-foreground">
                                <span className="text-foreground">Service:</span> {order.skill_name}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="text-foreground">Email:</span> {order.customer_email}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="text-foreground">Booked:</span>{' '}
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              {order.scheduled_date && (
                                <p className="text-muted-foreground">
                                  <span className="text-foreground">Scheduled:</span>{' '}
                                  {new Date(order.scheduled_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <p className="text-foreground text-2xl">${order.price.toFixed(2)}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setNewStatus(order.status);
                                  setShowUpdateDialog(true);
                                }}
                                className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                              >
                                Update Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary border border-border">
                <h4 className="text-muted-foreground text-sm mb-2">Customer Information</h4>
                <p className="text-foreground mb-1">{selectedOrder.customer_name}</p>
                <p className="text-muted-foreground text-sm">{selectedOrder.customer_email}</p>
                {selectedOrder.customer_phone && (
                  <p className="text-muted-foreground text-sm">{selectedOrder.customer_phone}</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-secondary border border-border">
                <h4 className="text-muted-foreground text-sm mb-2">Service Details</h4>
                <p className="text-foreground mb-1">{selectedOrder.skill_name}</p>
                <p className="text-muted-foreground text-sm">Price: ${selectedOrder.price.toFixed(2)}</p>
              </div>
              {selectedOrder.notes && (
                <div className="p-4 rounded-xl bg-secondary border border-border">
                  <h4 className="text-muted-foreground text-sm mb-2">Notes</h4>
                  <p className="text-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status and add notes for this order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm mb-2 block">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-muted-foreground text-sm mb-2 block">Notes (Optional)</label>
              <Textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Add any updates or notes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
            >
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}