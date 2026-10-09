import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  RefreshCw,
  Clock,
  Shield,
  User,
  Package,
  Star,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../lib/axiosSetup';
import { toast } from 'sonner';

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/activities');
      setActivities(res.data?.data?.activities || []);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionIcon = (targetModel, action = '') => {
    if (action.toLowerCase().includes('provider') || targetModel === 'Provider') {
      return <Shield className="w-4 h-4 text-purple-500" />;
    }
    if (action.toLowerCase().includes('order') || targetModel === 'Order') {
      return <Package className="w-4 h-4 text-blue-500" />;
    }
    if (action.toLowerCase().includes('review') || targetModel === 'Review') {
      return <Star className="w-4 h-4 text-amber-500" />;
    }
    return <User className="w-4 h-4 text-indigo-500" />;
  };

  const filtered = activities.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.action || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.performedBy?.fullName || '').toLowerCase().includes(q) ||
      (a.performedBy?.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System Audit & Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Immutable timeline of platform logins, provider decisions, user state alterations, and operational events.
          </p>
        </div>
        <Button
          onClick={fetchActivities}
          variant="outline"
          size="sm"
          disabled={loading}
          className="self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Search Bar ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search action, actor, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Showing {filtered.length} log entry(s)
          </span>
        </CardContent>
      </Card>

      {/* ── Activities Timeline List ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              Loading system audit trail...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No activity logs recorded matching your search.
            </div>
          ) : (
            <div className="relative border-l border-border/80 ml-4 space-y-6">
              {filtered.map((item) => (
                <div key={item._id} className="relative pl-6 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-card border-2 border-primary/60 flex items-center justify-center text-xs shadow-sm">
                    {getActionIcon(item.targetModel, item.action)}
                  </div>

                  {/* Log Content Card */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{item.action}</span>
                        {item.targetModel && (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            {item.targetModel}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>Actor:</span>
                      <strong className="text-foreground font-semibold">
                        {item.performedBy?.fullName || 'System Automated'}
                      </strong>
                      {item.performedBy?.email && (
                        <span>({item.performedBy.email})</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
