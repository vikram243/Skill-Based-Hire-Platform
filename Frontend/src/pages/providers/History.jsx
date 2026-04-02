/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Calendar, DollarSign, Star, CheckCircle, XCircle, Filter, Download,
  TrendingUp, Clock, AlertTriangle, Search, ChevronRight, Award, X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { mockProviderHistory } from '../../data/providerMockData';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.97 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

export default function ProviderHistoryPage({ isDarkMode = false, onToggleDarkMode, onNavigate }) {
  const [orders, setOrders] = useState(mockProviderHistory);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completed = orders.filter(o => o.status === 'completed');
  const cancelled = orders.filter(o => o.status === 'cancelled');
  const totalEarnings = completed.reduce((s, o) => s + o.price, 0);
  const rated = completed.filter(o => o.rating);
  const avgRating = rated.length > 0 ? rated.reduce((s, o) => s + (o.rating || 0), 0) / rated.length : 0;
  const urgentCompleted = completed.filter(o => o.urgency === 'urgent').length;
  const successRate = orders.length > 0 ? Math.round((completed.length / orders.length) * 100) : 0;

  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== 'all') filtered = filtered.filter(o => o.status === statusFilter);
    if (searchQuery) filtered = filtered.filter(o =>
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (dateFilter === 'week') cutoff.setDate(now.getDate() - 7);
      else if (dateFilter === 'month') cutoff.setMonth(now.getMonth() - 1);
      else if (dateFilter === 'year') cutoff.setFullYear(now.getFullYear() - 1);
      filtered = filtered.filter(o => new Date(o.created_at) >= cutoff);
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="mt-3">
              <h1 className="text-2xl md:text-3xl text-foreground">Order History</h1>
              <p className="text-muted-foreground text-sm mt-1">Your complete track record of completed & cancelled orders</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            initial="hidden" animate="visible" variants={containerVariants}>
            {[
              { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'from-green-400 to-emerald-600', sub: `${successRate}% success rate` },
              { label: 'Total Earned', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-blue-400 to-indigo-600', sub: 'From completed orders' },
              { label: 'Avg Rating', value: avgRating.toFixed(1), icon: Star, color: 'from-amber-400 to-orange-500', sub: `${rated.length} rated orders` },
              { label: 'Cancelled', value: cancelled.length, icon: XCircle, color: 'from-red-400 to-rose-600', sub: 'Not completed' },
            ].map((s, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 md:p-5">
                    <div className={`inline-flex p-2.5 rounded-xl bg-linear-to-br ${s.color} shadow-lg mb-3`}>
                      <s.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-muted-foreground text-xs mb-1">{s.label}</p>
                    <p className="text-foreground text-xl md:text-2xl">{s.value}</p>
                    <p className="text-muted-foreground text-xs mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievement Banner */}
          {completed.length >= 3 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500 p-5 text-white shadow-xl">
              <div className="absolute inset-0 opacity-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border border-white/30"
                    style={{ width: `${(i + 1) * 80}px`, height: `${(i + 1) * 80}px`, top: '-20%', right: '5%' }} />
                ))}
              </div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs mb-0.5">Achievement Unlocked</p>
                  <p className="text-white text-lg">🏆 Top Performer — {successRate}% Success Rate</p>
                  <p className="text-white/80 text-sm">{completed.length} completed orders · ${totalEarnings.toLocaleString()} total earned</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customer name..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-42.5 h-9">
                      <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-40 h-9">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-9 gap-1.5 text-sm shrink-0">
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* History List */}
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16 text-muted-foreground">
                <Calendar className="h-14 w-14 mx-auto mb-4 opacity-25" />
                <p>No orders found in history</p>
                <Button variant="outline" onClick={() => { setStatusFilter('all'); setDateFilter('all'); setSearchQuery(''); }} className="mt-3 text-sm">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3" initial="hidden" animate="visible" variants={containerVariants}>
                {filteredOrders.map((order, i) => (
                  <motion.div key={order.id} variants={itemVariants} whileHover={{ scale: 1.005 }}
                    className="rounded-2xl bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Status stripe */}
                    <div className={`h-1 ${order.status === 'completed' ? 'bg-linear-to-r from-green-400 to-emerald-500' : 'bg-linear-to-r from-red-400 to-rose-500'}`} />
                    
                    <div className="p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Left: Customer + Details */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <img
                            src={order.customer_avatar || `https://ui-avatars.com/api/?name=${order.customer_name}&background=6366f1&color=fff`}
                            alt={order.customer_name} className="h-11 w-11 rounded-xl object-cover ring-2 ring-border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-foreground">{order.customer_name}</span>
                              {order.status === 'completed' ? (
                                <Badge className="bg-green-500/10 text-green-600 border border-green-400/30 text-xs gap-1">
                                  <CheckCircle className="h-3 w-3" /> Completed
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/10 text-red-600 border border-red-400/30 text-xs gap-1">
                                  <XCircle className="h-3 w-3" /> Cancelled
                                </Badge>
                              )}
                              {order.urgency === 'urgent' && (
                                <Badge className="bg-orange-500/10 text-orange-600 border border-orange-400/20 text-xs gap-1">
                                  <AlertTriangle className="h-2.5 w-2.5" /> Was Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs mb-2">{order.skill_name}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Booked {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {order.completed_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {order.status === 'completed' ? 'Completed' : 'Closed'} {new Date(order.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>

                            {/* Rating */}
                            {order.rating && (
                              <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-400/20">
                                <div className="flex items-center gap-1 mb-1.5">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} className={`h-3.5 w-3.5 ${j < !order.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/25'}`} />
                                  ))}
                                  <span className="text-amber-600 text-xs ml-1">{order.rating}.0</span>
                                </div>
                                {order.review && (
                                  <p className="text-muted-foreground text-xs italic leading-relaxed">"{order.review}"</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Price */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                          <div className="text-right">
                            <p className="text-foreground text-xl">${order.price.toLocaleString()}</p>
                            <p className="text-muted-foreground text-xs">
                              {order.status === 'completed' ? 'Earned' : 'Not earned'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Card */}
          {filteredOrders.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="bg-linear-to-r from-blue-600 to-indigo-700 border-0 shadow-xl text-white">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Showing {filteredOrders.length} orders</p>
                      <p className="text-white text-lg">
                        Total Visible: ${filteredOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.price, 0).toLocaleString()} earned
                      </p>
                    </div>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                      <Download className="h-4 w-4" /> Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}