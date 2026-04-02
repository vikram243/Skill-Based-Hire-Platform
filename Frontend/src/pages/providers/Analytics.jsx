import { useState } from 'react';
import {
  DollarSign, TrendingUp, Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  Star, Users, CheckCircle, Clock, Package, Zap, Target, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { mockMonthlyEarnings, mockProviderStats, mockProviderOrders } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.97 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

const CHART_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
        <p className="text-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs">
            {p.name}: {p.name === 'earnings' || p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProviderAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('earnings');

  const stats = mockProviderStats;
  const growthPct = ((stats.thisMonthEarnings - 2350) / 2350) * 100;
  const avgOrderValue = stats.totalEarnings / stats.completedOrders;

  // Pie chart data: normal vs urgent
  const urgencyData = [
    { name: 'Normal Orders', value: mockProviderOrders.filter(o => o.urgency === 'normal').length, color: '#3B82F6' },
    { name: 'Urgent Orders', value: mockProviderOrders.filter(o => o.urgency === 'urgent').length, color: '#F59E0B' },
  ];

  // Completion rate per month (mock)
  const completionData = mockMonthlyEarnings.map(m => ({
    ...m,
    completed: Math.round(m.orders * 0.88),
    cancelled: Math.round(m.orders * 0.12),
  }));

  // Weekly data (mock)
  const weeklyData = [
    { day: 'Mon', earnings: 480, orders: 2 },
    { day: 'Tue', earnings: 320, orders: 1 },
    { day: 'Wed', earnings: 750, orders: 3 },
    { day: 'Thu', earnings: 900, orders: 3 },
    { day: 'Fri', earnings: 650, orders: 2 },
    { day: 'Sat', earnings: 300, orders: 1 },
    { day: 'Sun', earnings: 0, orders: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl text-foreground">Analytics & Earnings</h1>
                <p className="text-muted-foreground text-sm mt-1">Track your performance and revenue trends</p>
              </div>
              <div className="flex gap-1 bg-secondary rounded-xl p-1">
                {(['earnings', 'orders', 'performance']).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all duration-200 ${
                      activeTab === tab ? 'bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            initial="hidden" animate="visible" variants={containerVariants}>
            {[
              {
                label: 'Total Revenue', value: `$${stats.totalEarnings.toLocaleString()}`,
                sub: 'All time earnings', icon: DollarSign, color: 'from-emerald-400 to-green-600',
                badge: null
              },
              {
                label: 'This Month', value: `$${stats.thisMonthEarnings.toLocaleString()}`,
                sub: 'Current month', icon: TrendingUp, color: 'from-blue-400 to-indigo-600',
                badge: `${growthPct > 0 ? '+' : ''}${growthPct.toFixed(1)}%`, positive: growthPct >= 0
              },
              {
                label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(0)}`,
                sub: 'Per completed order', icon: BarChart3, color: 'from-violet-400 to-purple-600',
                badge: null
              },
              {
                label: 'Total Clients', value: stats.totalClients,
                sub: `${stats.repeatClients} repeat clients`, icon: Users, color: 'from-amber-400 to-orange-500',
                badge: null
              },
            ].map((s, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-linear-to-br ${s.color} shadow-lg`}>
                        <s.icon className="h-4 w-4 text-white" />
                      </div>
                      {s.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${(s).positive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'} flex items-center gap-0.5`}>
                          {(s).positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
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

          {/* Secondary Metrics */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3"
            initial="hidden" animate="visible" variants={containerVariants}>
            {[
              { label: 'On-Time Delivery', value: `${stats.onTimeDelivery}%`, icon: Clock, color: 'text-green-500 bg-green-500/10' },
              { label: 'Response Rate', value: `${stats.responseRate}%`, icon: Zap, color: 'text-blue-500 bg-blue-500/10' },
              { label: 'Avg Rating', value: `${stats.averageRating}★`, icon: Star, color: 'text-amber-500 bg-amber-500/10' },
              { label: 'Completed', value: stats.completedOrders, icon: CheckCircle, color: 'text-purple-500 bg-purple-500/10' },
            ].map((m, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md">
                  <CardContent className="p-4">
                    <div className={`inline-flex p-2 rounded-lg mb-2 ${m.color}`}>
                      <m.icon className="h-4 w-4" />
                    </div>
                    <p className="text-foreground text-lg">{m.value}</p>
                    <p className="text-muted-foreground text-xs">{m.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Monthly Earnings Area Chart */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">Monthly Revenue Trend</CardTitle>
                  <CardDescription>Earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={mockMonthlyEarnings} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={2.5} fill="url(#earningsGrad)" dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Types Pie */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">Order Priority Split</CardTitle>
                  <CardDescription>Normal vs Urgent order breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="60%" height={200}>
                      <PieChart>
                        <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          dataKey="value" paddingAngle={4}>
                          {urgencyData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-3">
                      {urgencyData.map((d, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-muted-foreground text-xs">{d.name}</span>
                            </div>
                            <span className="text-foreground text-sm">{d.value}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ backgroundColor: d.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(d.value / (urgencyData.reduce((s, x) => s + x.value, 0))) * 100}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }} />
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border/40">
                        <p className="text-muted-foreground text-xs">Urgent orders earn</p>
                        <p className="text-foreground text-sm">+25% premium avg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Weekly Earnings Bar */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">This Week's Earnings</CardTitle>
                  <CardDescription>Daily revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="earnings" radius={[6, 6, 0, 0]} fill="url(#barGrad)">
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#3B82F6" />
                          </linearGradient>
                        </defs>
                        {weeklyData.map((_, i) => (
                          <Cell key={i} fill={i === 3 ? '#6366F1' : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Completion Rate Stacked Bar */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">Order Completion Rate</CardTitle>
                  <CardDescription>Completed vs cancelled by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={completionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend formatter={v => <span style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{v}</span>} />
                      <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="completed" />
                      <Bar dataKey="cancelled" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} name="cancelled" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Goals & Milestones */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-foreground text-base">Monthly Goals</CardTitle>
                </div>
                <CardDescription>Your progress towards targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { label: 'Revenue Goal', current: stats.thisMonthEarnings, target: 4000, unit: '$', color: 'from-blue-500 to-indigo-600' },
                    { label: 'Orders Goal', current: 12, target: 15, unit: '', color: 'from-emerald-500 to-green-600' },
                    { label: 'Rating Goal', current: stats.averageRating * 20, target: 100, unit: '', color: 'from-amber-500 to-orange-500', label2: `${stats.averageRating} / 5.0` },
                  ].map((g, i) => {
                    const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                    return (
                      <div key={i} className="p-4 rounded-xl bg-(--surface) border border-border/40">
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-muted-foreground text-sm">{g.label}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pct >= 100 ? 'bg-green-500/15 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                            {pct}%
                          </span>
                        </div>
                        <p className="text-foreground text-lg mb-1">
                          {g.label2 || `${g.unit}${typeof g.current === 'number' && g.unit === '$' ? g.current.toLocaleString() : g.current} / ${g.unit}${g.target}`}
                        </p>
                        <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                          <motion.div className={`h-full rounded-full bg-linear-to-r ${g.color}`}
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Service Card (single service) */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
            <Card className="bg-linear-to-r from-blue-600 via-indigo-700 to-blue-800 border-0 shadow-xl text-white overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs mb-1">Your Service</p>
                      <p className="text-white text-lg">Web Development</p>
                      <p className="text-blue-200 text-sm">{stats.completedOrders} completed · ${stats.totalEarnings.toLocaleString()} total revenue</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div className="p-3 bg-white/15 rounded-xl">
                      <p className="text-white text-xl">{stats.averageRating}</p>
                      <p className="text-blue-200 text-xs">Rating</p>
                    </div>
                    <div className="p-3 bg-white/15 rounded-xl">
                      <p className="text-white text-xl">{stats.onTimeDelivery}%</p>
                      <p className="text-blue-200 text-xs">On-Time</p>
                    </div>
                    <div className="p-3 bg-white/15 rounded-xl">
                      <p className="text-white text-xl">${avgOrderValue.toFixed(0)}</p>
                      <p className="text-blue-200 text-xs">Avg Value</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}