import { useState, useEffect } from 'react';
import {
  Calendar, DollarSign, Star, TrendingUp, Users, Package,
  CheckCircle2, XCircle, AlertTriangle, Clock, ArrowUpRight,
  Activity, Bell, ChevronRight, BarChart3,
  CheckCircle, Circle, LockIcon, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { mockProviderStats, mockProviderOrders, mockActivityFeed, mockMonthlyEarnings } from '../../data/providerMockData';
import { toast } from 'sonner';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 24, opacity: 0, scale: 0.96 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

export default function ProviderDashboard({  onNavigate }) {
  const [upcomingOrders, setUpcomingOrders] = useState(
    mockProviderOrders.filter(o => o.status === 'pending').sort((a, b) => {
      const w = { urgent: 0, normal: 1 };
      return w[a.urgency] - w[b.urgency];
    })
  );
  const [activeOrders, setActiveOrders] = useState(mockProviderOrders.filter(o => o.status === 'in_progress'));
  const [greeting, setGreeting] = useState('');

  // Core rule: only 1 active (in_progress) order at a time
  const hasActiveOrder = activeOrders.length > 0;
  const currentActiveOrder = activeOrders[0] || null;

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleAccept = (id) => {
    if (hasActiveOrder) {
      toast.error(`⚠️ Complete your active order with ${currentActiveOrder?.customer_name} first!`);
      return;
    }
    const o = mockProviderOrders.find(x => x.id === id);
    if (o) {
      o.status = 'in_progress';
      setUpcomingOrders(p => p.filter(x => x.id !== id));
      setActiveOrders([{ ...o, status: 'in_progress', progress: 0 }]);
      toast.success(`✅ Accepted order from ${o.customer_name} — now in progress!`);
    }
  };
  const handleReject = (id) => {
    const o = mockProviderOrders.find(x => x.id === id);
    if (o) { o.status = 'cancelled'; setUpcomingOrders(p => p.filter(x => x.id !== id)); toast.info(`Order from ${o.customer_name} declined.`); }
  };
  const handleMarkComplete = (id) => {
    const o = activeOrders.find(x => x.id === id);
    if (o) {
      setActiveOrders([]);
      toast.success(`🎉 Order from ${o.customer_name} completed! You can now accept new orders.`);
    }
  };

  const stats = mockProviderStats;
  const maxEarning = Math.max(...mockMonthlyEarnings.map(m => m.earnings));

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Hero Header ── */}
          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full border border-white/20"
                  style={{ width: `${(i + 1) * 100}px`, height: `${(i + 1) * 100}px`, top: '-30%', right: '-5%' }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-blue-200 text-sm mb-1">{greeting}, 👋</p>
                <h1 className="text-2xl md:text-3xl text-white mb-1">John Smith</h1>
                <p className="text-blue-200">Web Development Provider</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" /> {stats.averageRating} Rating
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-300" /> {stats.completedOrders} Completed
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    <Activity className="h-3 w-3 text-blue-200" /> {stats.responseRate}% Response Rate
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => onNavigate('provider-orders')} className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                  View Orders
                </Button>
                <Button onClick={() => onNavigate('provider-analytics')} variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Analytics
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── Stats Grid ── */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            initial="hidden" animate="visible" variants={containerVariants}
          >
            {[
              {
                label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`,
                sub: 'All time revenue', icon: DollarSign, color: 'from-emerald-400 to-green-600',
                badge: '+12.5%', positive: true
              },
              {
                label: 'This Month', value: `$${stats.thisMonthEarnings.toLocaleString()}`,
                sub: 'Monthly revenue', icon: TrendingUp, color: 'from-blue-400 to-indigo-600',
                badge: '+18.2%', positive: true
              },
              {
                label: 'Active Orders', value: stats.activeOrders,
                sub: `${stats.pendingOrders} awaiting approval`, icon: Package, color: 'from-violet-400 to-purple-600',
                badge: `${stats.pendingOrders} pending`, positive: null
              },
              {
                label: 'Avg Rating', value: stats.averageRating.toFixed(1),
                sub: `${stats.completedOrders} total reviews`, icon: Star, color: 'from-amber-400 to-orange-500',
                badge: '★ Top Rated', positive: true
              },
            ].map((s, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-linear-to-br ${s.color} shadow-lg`}>
                        <s.icon className="h-4 w-4 text-white" />
                      </div>
                      {s.positive !== null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.positive ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mb-1">{s.label}</p>
                    <p className="text-foreground text-xl md:text-2xl">{s.value}</p>
                    <p className="text-muted-foreground text-xs mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Performance Metrics ── */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            initial="hidden" animate="visible" variants={containerVariants}
          >
            {[
              { label: 'On-Time Delivery', value: stats.onTimeDelivery, color: 'bg-green-500' },
              { label: 'Response Rate', value: stats.responseRate, color: 'bg-blue-500' },
              { label: 'Client Satisfaction', value: 96, color: 'bg-purple-500' },
              { label: 'Repeat Clients', value: Math.round((stats.repeatClients / stats.totalClients) * 100), color: 'bg-amber-500' },
            ].map((m, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-xs mb-2">{m.label}</p>
                    <p className="text-foreground text-xl mb-2">{m.value}%</p>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${m.color}`}
                        initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Main Content Grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Pending Orders */}
            <motion.div className="xl:col-span-2"
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Pending Requests
                        {upcomingOrders.length > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{upcomingOrders.length}</span>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {hasActiveOrder
                          ? '🔒 Complete your active order to accept new requests'
                          : 'Awaiting your response'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onNavigate('provider-orders')}
                      className="text-xs gap-1">
                      All Orders <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingOrders.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-10 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No pending orders — enjoy the break! 🎉</p>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      <div className="space-y-3">
                        {upcomingOrders.map((order, i) => {
                          const isLocked = hasActiveOrder;
                          return (
                            <motion.div key={order.id}
                              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0, height: 0 }}
                              transition={{ delay: i * 0.08 }}
                              whileHover={{ scale: 1.01 }}
                              className={`rounded-xl p-4 border transition-all duration-300 ${
                                isLocked
                                  ? 'bg-secondary/40 border-border/30 opacity-70'
                                  : order.urgency === 'urgent'
                                    ? 'bg-linear-to-r from-orange-500/8 to-amber-500/8 border-orange-400/40'
                                    : 'bg-(--surface) border-border/40'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <img src={order.customer_avatar} alt={order.customer_name}
                                  className="h-9 w-9 rounded-full object-cover ring-2 ring-border shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-foreground text-sm">{order.customer_name}</span>
                                    {order.urgency === 'urgent' && (
                                      <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
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
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-foreground text-sm">${order.price.toFixed(0)}</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  {isLocked && (
                                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 italic">
                                      <Info className="h-3 w-3 shrink-0" />
                                      Waiting — finish current order to accept
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" onClick={() => handleAccept(order.id)}
                                  disabled={isLocked}
                                  title={isLocked ? 'Complete your active order first' : 'Accept order'}
                                  className={`flex-1 text-xs ${
                                    isLocked
                                      ? 'bg-secondary text-muted-foreground cursor-not-allowed opacity-60'
                                      : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                                  }`}>
                                  {isLocked ? <><LockIcon className="h-3.5 w-3.5 mr-1" /> Locked</> : <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept</>}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReject(order.id)}
                                  className="flex-1 border-red-400/50 text-red-500 hover:bg-red-50 text-xs">
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </AnimatePresence>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-foreground text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" /> Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockActivityFeed.map((item, i) => (
                      <motion.div key={item.id}
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <div className={`p-1.5 rounded-full shrink-0 ${
                          item.type === 'review_received' ? 'bg-yellow-500/15 text-yellow-500' :
                          item.type === 'payment_received' ? 'bg-green-500/15 text-green-500' :
                          item.type === 'order_new' ? 'bg-blue-500/15 text-blue-500' :
                          'bg-purple-500/15 text-purple-500'
                        }`}>
                          {item.type === 'review_received' ? <Star className="h-3.5 w-3.5" /> :
                           item.type === 'payment_received' ? <DollarSign className="h-3.5 w-3.5" /> :
                           item.type === 'order_new' ? <Bell className="h-3.5 w-3.5" /> :
                           <CheckCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-xs leading-snug">{item.message}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{item.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Active Orders Progress + Mini Chart ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Active Orders */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-lg flex items-center gap-2">
                      <Circle className="h-5 w-5 text-blue-500" /> Active Order
                    </CardTitle>
                    {hasActiveOrder && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs text-blue-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    {hasActiveOrder ? 'You have 1 active order — complete it to accept new requests' : 'No active order right now'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeOrders.map((order, i) => (
                      <motion.div key={order.id}
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="p-4 rounded-xl bg-linear-to-br from-blue-500/5 to-indigo-500/5 border border-blue-400/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img src={order.customer_avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-blue-400/30" />
                            <span className="text-foreground text-sm">{order.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.urgency === 'urgent' && (
                              <Badge className="bg-orange-500/15 text-orange-600 border-orange-400/30 text-xs">Urgent</Badge>
                            )}
                            <span className="text-foreground text-sm">${order.price.toFixed(0)}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-xs mb-3 truncate">{order.notes}</p>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-xs">Progress</span>
                          <span className="text-foreground text-xs">{(order).progress ?? 60}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${(order).progress ?? 60}%` }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-muted-foreground text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Started {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <Button size="sm" onClick={() => handleMarkComplete(order.id)}
                            className="h-7 text-xs bg-linear-to-r from-green-500 to-emerald-600 text-white gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    {activeOrders.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No active order</p>
                        <p className="text-xs mt-1 opacity-70">Accept a pending request to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Earnings Mini Chart */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-500" /> Monthly Earnings
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => onNavigate('provider-analytics')} className="text-xs gap-1">
                      Full Analytics <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMonthlyEarnings.map((m, i) => {
                      const pct = (m.earnings / maxEarning) * 100;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-muted-foreground text-xs w-8 shrink-0">{m.month}</span>
                          <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.6 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-foreground text-xs w-16 text-right shrink-0">${m.earnings.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Growth vs last month</span>
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" /> +18.2%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Quick Actions ── */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            initial="hidden" animate="visible" variants={containerVariants}
          >
            {[
              { label: 'Manage Orders', desc: 'View & update statuses', icon: Package, color: 'from-blue-500 to-indigo-600', page: 'provider-orders' },
              { label: 'View Analytics', desc: 'Earnings & performance', icon: TrendingUp, color: 'from-emerald-500 to-green-600', page: 'provider-analytics' },
              { label: 'My Reviews', desc: 'Customer feedback', icon: Star, color: 'from-amber-500 to-orange-500', page: 'provider-reviews' },
              { label: 'Edit Profile', desc: 'Update your details', icon: Users, color: 'from-purple-500 to-violet-600', page: 'provider-profile' },
            ].map((a, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Card onClick={() => onNavigate(a.page)}
                  className="cursor-pointer bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-4 md:p-5">
                    <div className={`inline-flex p-2.5 rounded-xl bg-linear-to-br ${a.color} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <a.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-foreground text-sm mb-0.5">{a.label}</p>
                    <p className="text-muted-foreground text-xs">{a.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}