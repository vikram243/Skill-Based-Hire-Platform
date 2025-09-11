import React, { useState } from 'react';
import { Navigation } from './Navigation.jsx';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Badge } from './ui/badge.jsx';
import { Separator } from './ui/separator.jsx';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Calendar,
  MapPin
} from 'lucide-react';

export function CartPage({ onNavigate, user }) {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      providerId: '1',
      providerName: 'Mike Johnson',
      providerAvatar: 'https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlcyUyMHdvcmtlcnxlbnwxfHx8fDE3NTcxOTIzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      skill: 'Electrician',
      pricePerHour: 85,
      estimatedHours: 2,
      address: '123 Main St, New York, NY',
      scheduledDate: 'Tomorrow, 2:00 PM',
      notes: 'Kitchen outlet repair'
    }
  ]);

  const updateHours = (itemId, newHours) => {
    if (newHours < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, estimatedHours: newHours }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.pricePerHour * item.estimatedHours), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here');
    onNavigate('orders');
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation
        currentPage="cart"
        onNavigate={onNavigate}
        user={user}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Browse our services and add them to your cart to get started.
            </p>
            <Button 
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
            >
              Browse Services
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <Avatar className="w-16 h-16 mb-4">
                        <AvatarImage src={item.providerAvatar} alt={item.providerName} />
                        <AvatarFallback>{item.providerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{item.providerName}</h3>
                            <Badge variant="outline" className="mt-1">{item.skill}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{item.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{item.scheduledDate}</span>
                          </div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Notes: </span>
                              {item.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Duration:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateHours(item.id, item.estimatedHours - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-16 text-center">
                                {item.estimatedHours}h
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateHours(item.id, item.estimatedHours + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              ${item.pricePerHour}/hr 
                              {item.estimatedHours}h
                            </div>
                            <div className="font-bold text-lg">
                              ${item.pricePerHour * item.estimatedHours}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Service fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Payment will be processed after service completion
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Promo Code</h4>
                  <div className="flex w-full justify-between items-center">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="px-3 w-[80%] py-2 border border-border rounded-md text-sm"
                    />
                    <Button variant="outline" size="sm">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
