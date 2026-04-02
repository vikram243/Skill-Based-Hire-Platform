import { useState, useEffect } from 'react';
import {
  Search, Filter, Eye, AlertTriangle, CheckCircle2, XCircle,
  Clock, Mail, MessageSquare, ArrowUpDown,
  Package, SlidersHorizontal, X, LockIcon, Info
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import { mockProviderOrders } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';

const statusConfig = {
  pending:     { label: 'Pending',     color: 'text-amber-600',  bg: 'bg-amber-500/10 border-amber-400/30',  dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', color: 'text-blue-600',   bg: 'bg-blue-500/10 border-blue-400/30',    dot: 'bg-blue-500' },
  completed:   { label: 'Completed',   color: 'text-green-600',  bg: 'bg-green-500/10 border-green-400/30',  dot: 'bg-green-500' },
  cancelled:   { label: 'Cancelled',   color: 'text-red-600',    bg: 'bg-red-500/10 border-red-400/30',      dot: 'bg-red-500' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState(mockProviderOrders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Core rule: only 1 active (in_progress) order at a time
  const activeOrder = orders.find(o => o.status === 'in_progress') || null;
  const hasActiveOrder = !!activeOrder;

  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== 'all') filtered = filtered.filter(o => o.status === statusFilter);
    if (urgencyFilter !== 'all') filtered = filtered.filter(o => o.urgency === urgencyFilter);
    if (searchQuery) filtered = filtered.filter(o =>
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'price') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'urgency') filtered.sort((a) => (a.urgency === 'urgent' ? -1 : 1));
    else filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, urgencyFilter, sortBy]);

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;
    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id
        ? { ...o, status: newStatus, notes: updateNotes || o.notes, completed_at: newStatus === 'completed' ? new Date().toISOString() : o.completed_at }
        : o
    ));
    toast.success('Order status updated successfully');
    setShowUpdateDialog(false);
    setUpdateNotes('');
  };

  const handleQuickAccept = (id) => {
    if (hasActiveOrder) {
      toast.error(`⚠️ Complete your active order with ${activeOrder?.customer_name} first!`);
      return;
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'in_progress' } : o));
    const o = orders.find(x => x.id === id);
    toast.success(`✅ Order from ${o?.customer_name} accepted — now in progress!`);
  };

  const handleQuickReject = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    const o = orders.find(x => x.id === id);
    toast.info(`Order from ${o?.customer_name} declined.`);
  };

  const handleMarkComplete = (id) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status: 'completed', completed_at: new Date().toISOString() } : o
    ));
    const o = orders.find(x => x.id === id);
    toast.success(`🎉 Order from ${o?.customer_name} marked as completed! You can now accept new orders.`);
  };

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl text-foreground">Orders Management</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage bookings & customer requests</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-400/20">
                  {filteredOrders.length} of {orders.length} orders
                </span>
              </div>
            </div>
          </motion.div>

          {/* Active Order Banner — 1-order-at-a-time rule */}
          <AnimatePresence>
            {hasActiveOrder && (
              <motion.div
                key="active-banner"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="rounded-2xl border border-blue-400/40 bg-linear-to-r from-blue-500/10 via-indigo-500/8 to-blue-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 p-2 rounded-xl bg-blue-500/20">
                    <LockIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm flex items-center gap-2 flex-wrap">
                      <span className="text-blue-600">Active Order in Progress</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 text-xs border border-blue-400/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {activeOrder?.customer_name}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      You can only handle one order at a time. Complete this order to accept new requests.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMarkComplete(activeOrder.id)}
                  className="shrink-0 bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg text-xs gap-1.5 h-9"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Complete
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Tabs */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'pending', label: 'Pending', count: counts.pending },
              { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
              { key: 'completed', label: 'Completed', count: counts.completed },
              { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
            ].map(tab => (
              <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  statusFilter === tab.key
                    ? 'bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                    : 'bg-(--surface) text-muted-foreground border border-border/40 hover:border-blue-400/40'
                }`}>
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === tab.key ? 'bg-white/20' : 'bg-secondary'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customer, notes..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="w-full sm:w-40 h-9">
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Urgency</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={v => setSortBy(v)}>
                    <SelectTrigger className="w-full sm:w-37.5 h-9">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Newest First</SelectItem>
                      <SelectItem value="price">Highest Price</SelectItem>
                      <SelectItem value="urgency">Urgency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16 text-muted-foreground">
                <Package className="h-14 w-14 mx-auto mb-4 opacity-25" />
                <p className="text-lg">No orders match your filters</p>
                <Button variant="outline" onClick={() => { setStatusFilter('all'); setUrgencyFilter('all'); setSearchQuery(''); }}
                  className="mt-3 text-sm">Clear Filters</Button>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3" initial="hidden" animate="visible" variants={containerVariants}>
                {filteredOrders.map((order, i) => {
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  const isPending = order.status === 'pending';
                  const isInProgress = order.status === 'in_progress';
                  const isLocked = isPending && hasActiveOrder; // blocked from accepting

                  return (
                    <motion.div key={order.id} variants={itemVariants} whileHover={{ scale: 1.003 }}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isInProgress
                          ? 'border-blue-400/50 shadow-blue-500/10 shadow-lg'
                          : order.urgency === 'urgent' && isPending
                            ? 'border-orange-400/40 shadow-orange-500/10'
                            : 'border-border/40'
                      } bg-linear-to-br from-card to-(--surface) shadow-md hover:shadow-lg`}
                    >
                      {/* Status strip */}
                      {isInProgress && <div className="h-1 bg-linear-to-r from-blue-500 to-indigo-600" />}
                      {order.urgency === 'urgent' && !isInProgress && (
                        <div className="h-1 bg-linear-to-r from-orange-400 to-amber-500" />
                      )}

                      <div className="p-4 md:p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Customer Info */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="relative shrink-0">
                              <img src={order.customer_avatar || `https://ui-avatars.com/api/?name=${order.customer_name}`}
                                alt={order.customer_name} className="h-11 w-11 rounded-xl object-cover ring-2 ring-border" />
                              {isInProgress && (
                                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-blue-500 rounded-full border-2 border-card animate-pulse" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-foreground">{order.customer_name}</span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.color}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                  {sc.label}
                                </span>
                                {order.urgency === 'urgent' && (
                                  <Badge className="bg-orange-500/15 text-orange-600 border border-orange-400/30 text-xs flex items-center gap-1">
                                    <AlertTriangle className="h-2.5 w-2.5" /> Urgent
                                  </Badge>
                                )}
                                {isLocked && (
                                  <Badge className="bg-secondary text-muted-foreground border border-border/60 text-xs flex items-center gap-1">
                                    <LockIcon className="h-2.5 w-2.5" /> Queued
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-xs truncate">{order.notes}</p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{order.customer_email}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              {/* Progress bar for in_progress orders */}
                              {isInProgress && order.progress !== undefined && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">Progress</span>
                                    <span className="text-xs text-foreground">{order.progress}%</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
                                      initial={{ width: 0 }} animate={{ width: `${order.progress}%` }}
                                      transition={{ delay: 0.3 + i * 0.05, duration: 0.7, ease: 'easeOut' }}
                                    />
                                  </div>
                                </div>
                              )}
                              {/* Locked hint for queued pending orders */}
                              {isLocked && (
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 italic">
                                  <Info className="h-3 w-3 shrink-0" />
                                  Waiting — complete active order to accept
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:gap-2 shrink-0">
                            <div className="text-right">
                              <p className="text-foreground text-xl">${order.price.toLocaleString()}</p>
                              <p className="text-muted-foreground text-xs">Web Development</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setShowDetailsDialog(true); }}
                                className="h-8 text-xs gap-1">
                                <Eye className="h-3 w-3" /> Details
                              </Button>
                              {isPending ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickAccept(order.id)}
                                    disabled={isLocked}
                                    title={isLocked ? 'Complete your active order first' : 'Accept order'}
                                    className={`h-8 text-xs gap-1 ${
                                      isLocked
                                        ? 'bg-secondary text-muted-foreground cursor-not-allowed opacity-60'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                  >
                                    {isLocked ? <LockIcon className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                    {isLocked ? 'Locked' : 'Accept'}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleQuickReject(order.id)}
                                    className="h-8 text-xs border-red-400/50 text-red-500 hover:bg-red-50 gap-1">
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </>
                              ) : isInProgress ? (
                                <Button size="sm" onClick={() => handleMarkComplete(order.id)}
                                  className="h-8 text-xs bg-linear-to-r from-green-500 to-emerald-600 text-white gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Complete
                                </Button>
                              ) : (
                                <Button size="sm" onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowUpdateDialog(true); }}
                                  className="h-8 text-xs bg-linear-to-r from-blue-600 to-indigo-700 text-white">
                                  Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" /> Order Details
            </DialogTitle>
            <DialogDescription>Complete information about this booking</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border">
                <img src={selectedOrder.customer_avatar || `https://ui-avatars.com/api/?name=${selectedOrder.customer_name}`}
                  alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <p className="text-foreground">{selectedOrder.customer_name}</p>
                  <p className="text-muted-foreground text-sm">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && <p className="text-muted-foreground text-sm">{selectedOrder.customer_phone}</p>}
                </div>
              </div>
              {/* Status & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[selectedOrder.status]?.dot}`} />
                    {statusConfig[selectedOrder.status]?.label}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="text-muted-foreground text-xs mb-1">Priority</p>
                  {selectedOrder.urgency === 'urgent' ? (
                    <Badge className="bg-orange-500/15 text-orange-600 border-orange-400/30 text-xs"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Normal</Badge>
                  )}
                </div>
              </div>
              {/* Service details */}
              <div className="p-4 rounded-xl bg-secondary border border-border space-y-2">
                <p className="text-muted-foreground text-xs">Service Details</p>
                <div className="flex justify-between">
                  <span className="text-foreground text-sm">Web Development</span>
                  <span className="text-foreground text-sm">${selectedOrder.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Requested</span>
                  <span>{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {selectedOrder.completed_at && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Completed</span>
                    <span>{new Date(selectedOrder.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
              {selectedOrder.notes && (
                <div className="p-4 rounded-xl bg-secondary border border-border">
                  <p className="text-muted-foreground text-xs mb-2">Client Notes</p>
                  <p className="text-foreground text-sm italic">"{selectedOrder.notes}"</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
            {selectedOrder?.status === 'in_progress' && (
              <Button onClick={() => { setShowDetailsDialog(false); handleMarkComplete(selectedOrder.id); }}
                className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
                Mark Complete
              </Button>
            )}
            {selectedOrder?.status === 'pending' && !hasActiveOrder && (
              <Button onClick={() => { setShowDetailsDialog(false); handleQuickAccept(selectedOrder.id); }}
                className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
                Accept Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status and add notes for {selectedOrder?.customer_name}'s order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm mb-2 block">New Status</label>
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
              <Textarea value={updateNotes} onChange={e => setUpdateNotes(e.target.value)}
                placeholder="Add any updates, progress notes, or messages for the client..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}
              className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
