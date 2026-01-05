import React, { useState } from 'react';
import Navigation from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Clock, 
  MapPin, 
  MessageCircle, 
  Phone,
  CheckCircle,
  XCircle,
  PlayCircle,
  Calendar,
  Star
} from 'lucide-react';
import { orders } from '../data/mockData.js';

export default function OrdersPage({ onNavigate, user }) {
  const [selectedTab, setSelectedTab] = useState('pending');

  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'ongoing': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const OrderCard = ({ order }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <Avatar className="w-12 h-12 mb-2">
          <AvatarImage src={order.providerAvatar} alt={order.providerName} />
          <AvatarFallback>
            {order.providerName
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{order.providerName}</h3>
                <p className="text-sm text-muted-foreground">{order.skill}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
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
                  <span className="font-medium">Note: </span>
                  {order.note}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">${order.price}</div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline">Cancel</Button>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {order.status === 'accepted' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}

                {order.status === 'ongoing' && (
                  <>
                    <Button size="sm" variant="outline">Track Progress</Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {order.status === 'completed' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Star className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    <Button size="sm" variant="outline">Rebook</Button>
                  </>
                )}

                {order.status === 'cancelled' && (
                  <Button size="sm" variant="outline">Book Again</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation
        currentPage="orders"
        onNavigate={onNavigate}
        user={user}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl! font-bold!">My Orders</h1>
          <Button 
            onClick={() => onNavigate('home')}
            className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
          >
            Book New Service
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid-cols md:grid-cols-5 mb-6">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs sm:text-sm">Accepted</TabsTrigger>
            <TabsTrigger value="ongoing" className="text-xs sm:text-sm">Ongoing</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">Cancelled</TabsTrigger>
          </TabsList>

          {['pending', 'accepted', 'ongoing', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-4">
                {getOrdersByStatus(status).length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      {status === 'pending' && "No pending orders"}
                      {status === 'accepted' && "No accepted orders"}
                      {status === 'ongoing' && "No ongoing orders"}
                      {status === 'completed' && "No completed orders"}
                      {status === 'cancelled' && "No cancelled orders"}
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => onNavigate('home')}
                    >
                      Browse Services
                    </Button>
                  </Card>
                ) : (
                  getOrdersByStatus(status).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, o) => sum + o.price, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
