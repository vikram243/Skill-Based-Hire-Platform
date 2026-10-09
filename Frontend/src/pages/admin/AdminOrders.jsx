import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import api from '../../lib/axiosSetup';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/api/admin/orders', { params });
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      toast.error('Failed to load platform orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/admin/orders/${orderToDelete._id}`);
      toast.success('Order deleted successfully');
      setOrders((prev) => prev.filter((o) => o._id !== orderToDelete._id));
      setOrderToDelete(null);
    } catch (err) {
      toast.error('Failed to delete order');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'in_progress':
      case 'ongoing':
      case 'accepted':
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">Pending</Badge>;
      case 'cancelled':
      case 'rejected':
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Bookings & Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time directory of all service bookings, assignments, and status updates.
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          disabled={loading}
          className="self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Filters & Search ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-secondary/50 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 min-w-56">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search customer, provider, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 px-3 text-xs cursor-pointer">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Orders Table ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Order / Customer</th>
                <th className="py-3 px-4 font-semibold">Assigned Provider</th>
                <th className="py-3 px-4 font-semibold">Skill Service</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Urgency</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Booking Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-sm">{o.customer_name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {o.customer_email || o.customer_phone || `#${o._id.slice(-6)}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div>{o.provider_name}</div>
                      {o.provider_phone && (
                        <div className="text-[11px] text-muted-foreground">{o.provider_phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      <Badge variant="outline" className="text-[11px] bg-secondary/40">
                        {o.skill_name}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground text-sm">${o.price}</td>
                    <td className="py-3 px-4">
                      {o.urgency === 'emergency' ? (
                        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 text-[10px]">
                          Emergency
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Normal</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(o);
                            setIsDetailsOpen(true);
                          }}
                          className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOrderToDelete(o)}
                          className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Order Details Modal ── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <div>
                    <DialogTitle className="text-lg font-bold">Booking Details</DialogTitle>
                    <DialogDescription className="text-xs">
                      Order ID: {selectedOrder._id}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-semibold text-foreground">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-semibold text-foreground">{selectedOrder.provider_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold text-foreground">{selectedOrder.skill_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="font-bold text-foreground text-sm">${selectedOrder.price}</span>
                  </div>
                </div>

                {selectedOrder.address && (
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> Service Location
                    </span>
                    <p className="p-2.5 rounded-lg bg-muted/40 text-muted-foreground border border-border/50">
                      {selectedOrder.address}
                    </p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div>
                    <span className="font-semibold text-foreground mb-1 block">Description & Instructions</span>
                    <p className="p-2.5 rounded-lg bg-muted/40 text-muted-foreground border border-border/50">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsDetailsOpen(false)} className="w-full">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={Boolean(orderToDelete)} onOpenChange={() => setOrderToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Delete Order Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete order #{orderToDelete?._id?.slice(-6)}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOrderToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={actionLoading}
              onClick={handleDeleteOrder}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
