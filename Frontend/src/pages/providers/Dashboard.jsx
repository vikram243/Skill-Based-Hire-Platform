import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Star, TrendingUp, Users, Package, ArrowUpRight, CheckCircle2, XCircle, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { mockProviderStats, mockProviderOrders } from '../../data/providerMockData.js';
import { toast } from '../../components/ui/toast-sonner.jsx';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockProviderStats);
  const [upcomingOrders, setUpcomingOrders] = useState([]);

  useEffect(() => {
    setStats(mockProviderStats);
    // Filter only pending orders and sort emergency to top
    const pendingOrders = mockProviderOrders
      .filter(order => order.status === 'pending')
      .sort((a, b) => {
        // Emergency orders first, then urgent, then normal
        const urgencyWeight = { emergency: 0, urgent: 1, normal: 2 };
        return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
      });
    setUpcomingOrders(pendingOrders);
  }, []);

  const handleAcceptOrder = (orderId) => {
    const order = mockProviderOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'in_progress';
      setUpcomingOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success(`Order accepted! ${order.customer_name}'s order is now in progress.`);
    }
  };

  const handleRejectOrder = (orderId) => {
    const order = mockProviderOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      setUpcomingOrders(prev => prev.filter(o => o.id !== orderId));
      toast.info(`Order rejected. ${order.customer_name} has been notified.`);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'default', color: 'bg-yellow-500' },
      in_progress: { variant: 'default', color: 'bg-blue-500' },
      completed: { variant: 'default', color: 'bg-green-500' },
      cancelled: { variant: 'destructive', color: 'bg-red-500' },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="capitalize">
        {String(status).replace('_', ' ')}
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

  const getOrderCardClass = (urgency) => {
    if (urgency === 'emergency') {
      return 'bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-2 border-red-500/50 shadow-lg shadow-red-500/20';
    }
    return 'bg-[var(--surface)] border border-border/40';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
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
            <h1 className="text-3xl mb-2 text-foreground">Provider Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <StatCard title="Total Earnings" icon={<DollarSign className="h-4 w-4 text-accent" />} value={`$${stats.totalEarnings.toFixed(2)}`} sub="All time revenue" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="This Month" icon={<TrendingUp className="h-4 w-4 text-success" />} value={`$${stats.thisMonthEarnings.toFixed(2)}`} sub="Monthly revenue" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="Active Orders" icon={<Package className="h-4 w-4 text-(--primary-gradient-start)" />} value={stats.activeOrders} sub={`${stats.pendingOrders} pending approval`} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="Rating" icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />} value={stats.averageRating.toFixed(1)} sub={`${stats.completedOrders} reviews`} />
            </motion.div>
          </motion.div>

          {/* Upcoming Orders (Pending Only) */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Upcoming Orders</CardTitle>
                    <CardDescription>Pending orders awaiting your response</CardDescription>
                  </div>
                  <Button
                    className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate('/provider/orders')}
                  >
                    View All Orders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingOrders.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No pending orders at the moment</p>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {upcomingOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex flex-col p-4 rounded-xl hover:shadow-md transition-all duration-300 gap-3 ${getOrderCardClass(order.urgency)}`}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Order Header with Customer Name and Urgency */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-foreground">{order.customer_name}</h3>
                                <div className="flex items-center gap-2">
                                  {getUrgencyBadge(order.urgency)}
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm">{order.skill_name}</p>
                              {order.notes && (
                                <p className="text-muted-foreground text-xs italic">{order.notes}</p>
                              )}
                              <p className="text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-foreground text-xl">${order.price.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Accept/Reject Actions */}
                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectOrder(order.id)}
                              variant="outline"
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <QuickActionCard title="Manage Orders" icon={<Calendar className="h-8 w-8 text-accent" />} desc="View and update order statuses" onClick={() => navigate('/provider/orders')} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <QuickActionCard title="Edit Profile" icon={<Users className="h-8 w-8 text-accent" />} desc="Update your profile and services" onClick={() => navigate('/provider/profile')} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <QuickActionCard title="View Analytics" icon={<TrendingUp className="h-8 w-8 text-accent" />} desc="Check your earnings and stats" onClick={() => navigate('/provider/analytics')} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Small helper sub-components to reduce repetition */
function StatCard({ title, icon, value, sub }) {
  return (
    <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid) hover:shadow-(--shadow-high) transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-accent/10">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ title, icon, desc, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid) hover:shadow-(--shadow-high) transition-all duration-300 group"
    >
      <CardContent className="pt-6">
        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-foreground text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
}