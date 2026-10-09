import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../lib/axiosSetup';
import { toast } from 'sonner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [flagFilter, setFlagFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/reviews');
      setReviews(res.data?.data?.reviews || []);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleHide = async (reviewId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/reviews/${reviewId}/hide`);
      const updated = res.data?.data;
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, isHidden: updated?.isHidden ?? !r.isHidden } : r))
      );
      toast.success(`Review visibility toggled!`);
    } catch (err) {
      toast.error('Failed to update visibility');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFlag = async (reviewId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/reviews/${reviewId}/flag`);
      const updated = res.data?.data;
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, isFlagged: updated?.isFlagged ?? !r.isFlagged } : r))
      );
      toast.success('Review flag status updated');
    } catch (err) {
      toast.error('Failed to flag review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/admin/reviews/${reviewId}/status`, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
      );
      toast.success(`Review ${newStatus} successfully`);
    } catch (err) {
      toast.error('Failed to update review status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter)) return false;
    if (flagFilter === 'flagged' && !r.isFlagged) return false;
    if (flagFilter === 'hidden' && !r.isHidden) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const userMatch = (r.user?.fullName || '').toLowerCase().includes(q);
      const provMatch = (r.provider?.businessName || r.provider?.fullName || '').toLowerCase().includes(q);
      const commentMatch = (r.comment || '').toLowerCase().includes(q);
      if (!userMatch && !provMatch && !commentMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ratings & Review Moderation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit customer feedback, flag suspicious activity, and manage public testimonial visibility.
          </p>
        </div>
        <Button
          onClick={fetchReviews}
          variant="outline"
          size="sm"
          disabled={loading}
          className="self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Filters ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Stars Filter */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
              {['all', '5', '4', '3', '2', '1'].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    ratingFilter === star
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {star === 'all' ? 'All Ratings' : `★ ${star}`}
                </button>
              ))}
            </div>

            {/* Flag Filter */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'flagged', label: '🚩 Flagged' },
                { id: 'hidden', label: '👁️ Hidden' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFlagFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    flagFilter === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search reviewer, provider, comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Reviews Grid / List ── */}
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          Loading reviews...
        </Card>
      ) : filteredReviews.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No reviews found matching current moderation criteria.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <Card
              key={r._id}
              className={`border-border/60 bg-card/60 backdrop-blur-sm transition-all ${
                r.isHidden ? 'opacity-60 bg-muted/30' : ''
              } ${r.isFlagged ? 'border-amber-500/50 shadow-amber-500/5 shadow-md' : ''}`}
            >
              <CardContent className="p-5 space-y-3">
                {/* Header with stars and flags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400' : 'text-muted/40'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-foreground ml-1.5">{r.rating}.0</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {r.isFlagged && (
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                        Flagged
                      </Badge>
                    )}
                    {r.isHidden ? (
                      <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 text-[10px]">
                        Hidden
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        Visible
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-xl border border-border/40">
                  "{r.comment || 'No text review comment provided.'}"
                </p>

                {/* Reviewer & Provider Info */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/50">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Customer:</span>
                    <span className="font-semibold text-foreground truncate block">
                      {r.user?.fullName || 'Client'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Provider:</span>
                    <span className="font-semibold text-foreground truncate block">
                      {r.provider?.businessName || r.provider?.fullName || 'Provider'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleToggleHide(r._id)}
                      className={`h-7 px-2 text-[11px] cursor-pointer ${
                        r.isHidden ? 'text-indigo-500' : 'text-muted-foreground'
                      }`}
                    >
                      {r.isHidden ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
                      {r.isHidden ? 'Unhide' : 'Hide'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleToggleFlag(r._id)}
                      className={`h-7 px-2 text-[11px] cursor-pointer ${
                        r.isFlagged ? 'text-amber-500' : 'text-muted-foreground'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5 mr-1" />
                      {r.isFlagged ? 'Unflag' : 'Flag'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
