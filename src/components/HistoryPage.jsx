import React, { useState } from 'react';
import { Navigation } from './Navigation.jsx';
import { Button } from './ui/button.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Badge } from './ui/badge.jsx';
import { Input } from './ui/input.jsx';
import {
  Search,
  Calendar,
  MapPin,
  Star,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { orders } from '../data/mockData.js';

export function HistoryPage({ onNavigate, user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const completedOrders = orders.filter(order => order.status === 'completed');

  const filteredOrders = completedOrders.filter(order => {
    const matchesSearch = order.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.skill.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch;
  });

  const totalSpent = completedOrders.reduce((sum, order) => sum + order.price, 0);
  const averageRating = 4.8;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation
        currentPage="history"
        onNavigate={onNavigate}
        user={user}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              View and manage your completed orders
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <div className="text-sm text-muted-foreground">Completed Orders</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">${totalSpent}</div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              {averageRating}
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating Given</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Providers Used</div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by provider name or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'last-week', 'last-month'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter ? 
                    "bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white" : 
                    ""
                  }
                >
                  {filter === 'all' && 'All Time'}
                  {filter === 'last-week' && 'Last Week'}
                  {filter === 'last-month' && 'Last Month'}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              {searchQuery ? 'No orders found matching your search.' : 'No completed orders yet.'}
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              {searchQuery ? 'Clear Search' : 'Browse Services'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={order.providerAvatar} alt={order.providerName} />
                      <AvatarFallback>{order.providerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.providerName}</h3>
                          <p className="text-sm text-muted-foreground">{order.skill}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${order.price}</div>
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{order.scheduledTime}</span>
                        </div>
                        {order.note && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Service: </span>
                            {order.note}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Completed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Receipt
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Book Again
                          </Button>
                          <Button size="sm" variant="outline">
                            <Star className="w-4 h-4 mr-2" />
                            Rate & Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
