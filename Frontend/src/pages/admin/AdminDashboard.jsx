import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Activity,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../lib/axiosSetup';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/admin/dashboard');
        setData(res.data?.data || null);
      } catch (err) {
        toast.error('Failed to load admin dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const overview = data?.overview || {
    totalRevenue: 0,
    totalUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    approvedProviders: 0,
    totalOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    pendingOrders: 0
  };

  const monthlyTrends = data?.monthlyTrends || [];
  const recentOrders = data?.recentOrders || [];
  const recentActivities = data?.recentActivities || [];

  const statCards = [
    {
      title: 'Total Platform Revenue',
      value: `$${(overview.totalRevenue || 0).toLocaleString()}`,
      description: 'Completed orders gross value',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      badge: '+18.4% vs last mo',
      badgeColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Total Registered Users',
      value: (overview.totalUsers || 0).toLocaleString(),
      description: `${overview.activeUsers || 0} active accounts`,
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Active Base',
      badgeColor: 'text-blue-500 bg-blue-500/10'
    },
    {
      title: 'Providers Onboarded',
      value: (overview.totalProviders || 0).toLocaleString(),
      description: `${overview.pendingProviders || 0} applications pending`,
      icon: ShieldCheck,
      gradient: 'from-purple-500 to-pink-600',
      badge: `${overview.approvedProviders || 0} Approved`,
      badgeColor: 'text-purple-500 bg-purple-500/10'
    },
    {
      title: 'Total Platform Bookings',
      value: (overview.totalOrders || 0).toLocaleString(),
      description: `${overview.completedOrders || 0} completed successfully`,
      icon: Package,
      gradient: 'from-amber-500 to-orange-600',
      badge: `${overview.inProgressOrders || 0} In Progress`,
      badgeColor: 'text-amber-500 bg-amber-500/10'
    }
  ];

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
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              SkillHub Central Administration
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Platform Master Console
            </h1>
            <p className="text-indigo-200/80 text-sm max-w-xl">
              Monitor hyperlocal bookings, approve provider applications, inspect user safety flags, and oversee platform performance in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {overview.pendingProviders > 0 && (
              <Button
                onClick={() => navigate('/admin/providers?status=pending')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 mr-1.5" />
                {overview.pendingProviders} Pending Approvals
              </Button>
            )}
            <Button
              onClick={() => navigate('/admin/orders')}
              variant="outline"
              className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer"
            >
              Inspect Orders
            </Button>
          </div>
        </div>

        {/* Ambient background blur circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center text-white shadow-md`}>
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight text-foreground">{card.value}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs">
                <span className="text-muted-foreground truncate">{card.description}</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <Card className="lg:col-span-2 border-border/60 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Revenue & Demand Trends</CardTitle>
              <CardDescription>Monthly completed order volume & earnings</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Last 6 Months
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-border bg-card p-2.5 shadow-xl text-xs">
                              <p className="font-semibold text-foreground mb-1">{payload[0].payload.name}</p>
                              <p className="text-indigo-500 font-bold">Revenue: ${payload[0].value?.toLocaleString()}</p>
                              <p className="text-muted-foreground">Orders: {payload[0].payload.orders}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#adminRevenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No monthly booking records yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">Order Fulfilment Status</CardTitle>
            <CardDescription>Breakdown across platform lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                </span>
                <span className="font-bold text-foreground">{overview.completedOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${overview.totalOrders ? (overview.completedOrders / overview.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-blue-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress
                </span>
                <span className="font-bold text-foreground">{overview.inProgressOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${overview.totalOrders ? (overview.inProgressOrders / overview.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-amber-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Confirmation
                </span>
                <span className="font-bold text-foreground">{overview.pendingOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${overview.totalOrders ? (overview.pendingOrders / overview.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-red-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Cancelled / Declined
                </span>
                <span className="font-bold text-foreground">{overview.cancelledOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${overview.totalOrders ? (overview.cancelledOrders / overview.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/orders')}
              className="w-full text-xs mt-3 cursor-pointer"
            >
              View All Orders Log
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Orders & Activities Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 border-border/60 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Recent Platform Bookings</CardTitle>
              <CardDescription>Real-time booking events across all skills</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-y border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Customer</th>
                    <th className="py-2.5 px-4 font-semibold">Skill</th>
                    <th className="py-2.5 px-4 font-semibold">Total</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">
                          {order.customer?.fullName || 'Customer'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {order.skill?.name || 'General Service'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          ${order.pricing?.total || 0}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Audit & Activities</CardTitle>
              <CardDescription>Live administrative events</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/activities')}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              All <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors text-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{act.action}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{act.description}</p>
                    <span className="text-[10px] text-muted-foreground/80 mt-0.5 block">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground text-xs">
                No recent system logs
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
