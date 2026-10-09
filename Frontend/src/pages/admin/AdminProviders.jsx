import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  DollarSign,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
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

export default function AdminProviders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/api/admin/providers', { params });
      setProviders(res.data?.data?.providers || []);
    } catch (err) {
      toast.error('Failed to load providers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleUpdateStatus = async (providerId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/admin/providers/${providerId}/status`, { status: newStatus });
      toast.success(`🎉 Provider application marked as ${newStatus}!`);

      setProviders((prev) =>
        prev.map((p) => (p._id === providerId ? { ...p, applicationStatus: newStatus } : p))
      );

      if (selectedProvider && selectedProvider._id === providerId) {
        setSelectedProvider((prev) => ({ ...prev, applicationStatus: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update provider status`);
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-semibold">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold">
            <ShieldAlert className="w-3 h-3 mr-1" /> Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Provider Applications & Verification</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit professional credentials, identity documents, and onboard local providers.
          </p>
        </div>
        <Button
          onClick={fetchProviders}
          variant="outline"
          size="sm"
          disabled={loading}
          className="self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Filters & Search Bar ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-secondary/50 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Providers' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setSearchParams(tab.id === 'all' ? {} : { status: tab.id });
                }}
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

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 min-w-56">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search business, name, skill..."
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

      {/* ── Providers Table ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Business / Provider</th>
                <th className="py-3 px-4 font-semibold">Primary Skill</th>
                <th className="py-3 px-4 font-semibold">Experience</th>
                <th className="py-3 px-4 font-semibold">Rate</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Documents</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading provider applications...
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                    No providers found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-sm">{p.businessName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.user?.fullName || 'Individual'} • {p.user?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      <Badge variant="outline" className="text-[11px] bg-secondary/50">
                        {p.skillName || 'Service Provider'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{p.yearsExperience || 0} years</td>
                    <td className="py-3 px-4 text-foreground font-semibold">
                      ${p.pricing?.serviceRate || 0}/{p.pricing?.rateType || 'hr'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div>{p.contactPhone || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4">
                      {p.documents && p.documents.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                          <FileText className="w-3 h-3" /> {p.documents.length} File(s)
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(p.applicationStatus)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(p)}
                          className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>

                        {p.applicationStatus !== 'approved' && (
                          <Button
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(p._id, 'approved')}
                            className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                          >
                            Approve
                          </Button>
                        )}

                        {p.applicationStatus !== 'rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(p._id, 'rejected')}
                            className="h-7 px-2 text-[11px] text-red-600 border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Provider Details & Verification Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <div>
                    <DialogTitle className="text-xl font-bold">{selectedProvider.businessName}</DialogTitle>
                    <DialogDescription className="text-xs">
                      Applied by {selectedProvider.user?.fullName} ({selectedProvider.user?.email})
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedProvider.applicationStatus)}
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Basic Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Service Skill</span>
                    <span className="font-semibold text-foreground">{selectedProvider.skillName || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Experience</span>
                    <span className="font-semibold text-foreground">{selectedProvider.yearsExperience || 0} Years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Pricing</span>
                    <span className="font-semibold text-foreground">
                      ${selectedProvider.pricing?.serviceRate || 0}/{selectedProvider.pricing?.rateType || 'hr'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Phone</span>
                    <span className="font-semibold text-foreground">{selectedProvider.contactPhone || 'N/A'}</span>
                  </div>
                </div>

                {/* Professional Description */}
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Professional Bio / Description</h4>
                  <p className="p-3 rounded-xl bg-muted/40 text-muted-foreground border border-border/50 text-xs leading-relaxed">
                    {selectedProvider.professionalDescription || 'No description provided.'}
                  </p>
                </div>

                {/* Verification Documents */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center justify-between">
                    <span>Uploaded ID & Verification Documents</span>
                    <span className="text-muted-foreground font-normal text-[11px]">
                      {selectedProvider.documents?.length || 0} document(s)
                    </span>
                  </h4>

                  {selectedProvider.documents && selectedProvider.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProvider.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate text-xs">
                                {doc.filename || `Document #${idx + 1}`}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{doc.mimetype || 'Attachment'}</p>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-500 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border text-center text-muted-foreground text-xs">
                      No document files submitted with this application.
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border pt-4">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedProvider._id, 'rejected')}
                    className="text-red-600 border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                  >
                    Reject Application
                  </Button>
                  <Button
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedProvider._id, 'approved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                  >
                    Approve Application
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
