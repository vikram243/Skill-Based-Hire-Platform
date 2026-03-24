import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, BarChart3, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { mockMonthlyEarnings, mockTopServices, mockProviderStats } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ProviderAnalyticsPage() {
  const [analytics,] = useState({
    totalEarnings: mockProviderStats.totalEarnings,
    thisMonthEarnings: mockProviderStats.thisMonthEarnings,
    lastMonthEarnings: 2350.00,
    totalOrders: 52,
    completedOrders: mockProviderStats.completedOrders,
    averageOrderValue: mockProviderStats.totalEarnings / mockProviderStats.completedOrders,
    monthlyData: mockMonthlyEarnings,
    topServices: mockTopServices
  });

  const growthPercentage = analytics.lastMonthEarnings > 0
    ? ((analytics.thisMonthEarnings - analytics.lastMonthEarnings) / analytics.lastMonthEarnings) * 100
    : 0;

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
            <h1 className="text-3xl mb-2 text-foreground">Analytics & Earnings</h1>
            <p className="text-muted-foreground">Track your performance and revenue</p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle>
                  <div className="p-2 rounded-lg bg-accent/10">
                    <DollarSign className="h-4 w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-foreground">${analytics.totalEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">This Month</CardTitle>
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-foreground">${analytics.thisMonthEarnings.toFixed(2)}</div>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${growthPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                    <ArrowUpRight className="h-3 w-3" />
                    {Math.abs(growthPercentage).toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
                  <div className="p-2 rounded-lg bg-(--primary-gradient-start)/10">
                    <Calendar className="h-4 w-4 text-(--primary-gradient-start)" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-foreground">{analytics.totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">{analytics.completedOrders} completed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Avg Order Value</CardTitle>
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <BarChart3 className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-foreground">${analytics.averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per completed order</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Monthly Earnings Chart */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Earnings</CardTitle>
              <CardDescription>Revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyData.map((month, index) => {
                  const maxEarnings = Math.max(...analytics.monthlyData.map(m => m.earnings));
                  const percentage = maxEarnings > 0 ? (month.earnings / maxEarnings) * 100 : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">{month.month}</span>
                        <div className="text-right">
                          <span className="text-foreground">${month.earnings.toFixed(2)}</span>
                          <span className="text-muted-foreground text-sm ml-2">({month.orders} orders)</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardHeader>
              <CardTitle className="text-foreground">Top Performing Services</CardTitle>
              <CardDescription>Your most popular and profitable services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-(--surface) border border-border/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center text-white">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="text-foreground">{service.name}</h3>
                          <p className="text-muted-foreground text-sm">{service.count} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-xl">${service.revenue.toFixed(2)}</p>
                        <p className="text-muted-foreground text-sm">total revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}