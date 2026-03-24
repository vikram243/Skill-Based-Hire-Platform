import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Star, CheckCircle, XCircle, Filter, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { mockProviderHistory } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ProviderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalCancelled: 0
  });

  useEffect(() => {
    // Use mock data
    setOrders(mockProviderHistory);
    
    // Calculate stats
    const completed = mockProviderHistory.filter(o => o.status === 'completed');
    const cancelled = mockProviderHistory.filter(o => o.status === 'cancelled');
    const totalEarnings = completed.reduce((sum, o) => sum + o.price, 0);
    const ratingsCount = completed.filter(o => o.rating).length;
    const averageRating = ratingsCount > 0
      ? completed.reduce((sum, o) => sum + (o.rating || 0), 0) / ratingsCount
      : 0;

    setStats({
      totalCompleted: completed.length,
      totalEarnings,
      averageRating,
      totalCancelled: cancelled.length
    });
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, dateFilter]);

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (dateFilter !== 'all') {
        filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
      }
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-success text-success-foreground gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Cancelled
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            <h1 className="text-3xl mb-2 text-foreground">Order History</h1>
            <p className="text-muted-foreground">View your completed and cancelled orders</p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-muted-foreground text-sm">Completed</span>
                  </div>
                  <p className="text-foreground text-2xl">{stats.totalCompleted}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-muted-foreground text-sm">Total Earned</span>
                  </div>
                  <p className="text-foreground text-2xl">${stats.totalEarnings.toFixed(2)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span className="text-muted-foreground text-sm">Avg Rating</span>
                  </div>
                  <p className="text-foreground text-2xl">{stats.averageRating.toFixed(1)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <span className="text-muted-foreground text-sm">Cancelled</span>
                  </div>
                  <p className="text-foreground text-2xl">{stats.totalCancelled}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-45">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-45">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardContent className="pt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found in your history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-6 rounded-xl bg-(--surface) border border-border/40 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-foreground text-lg">{order.customer_name}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-muted-foreground">{order.skill_name}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Booked: {new Date(order.created_at).toLocaleDateString()}</span>
                            {order.completed_at && (
                              <span>Completed: {new Date(order.completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                          {order.rating && (
                            <div className="flex items-start gap-2 flex-col">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < order.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                              {order.review && (
                                <p className="text-muted-foreground text-sm italic">"{order.review}"</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-foreground text-2xl">${order.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}