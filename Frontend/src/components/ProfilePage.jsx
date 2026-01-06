import React, { useState } from 'react';
import  Navigation from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea  }from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  MapPin,
  Phone,
  Star,
  Edit,
  LogOut,
  Camera,
  Save,
  X,
  Moon,
  Sun,
  Briefcase
} from 'lucide-react';
import { Switch } from './ui/switch';

function ProfilePage({
  onNavigate,
  user,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced professional providing quality services in my community.',
  });

  const stats = [
    { label: 'Services Completed', value: '127' },
    { label: 'Average Rating', value: '4.9' },
    { label: 'Response Time', value: '< 1hr' },
    { label: 'Member Since', value: '2023' },
  ];

  const recentActivity = [
    { type: 'completed', service: 'Home Cleaning', date: '2 days ago', rating: 5 },
    { type: 'hired', service: 'Plumbing Repair', date: '1 week ago', rating: 5 },
    { type: 'completed', service: 'Garden Maintenance', date: '2 weeks ago', rating: 4 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navigation
        onNavigate={onNavigate}
        isAuthenticated={true}
        user={user}
        currentPage="profile"
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback className="text-xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                      {formData.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-bold mb-1">{formData.name}</h2>
                <p className="text-muted-foreground mb-2">{formData.email}</p>

                <Badge variant="secondary" className="mb-4">
                  {user?.isProvider ? 'Service Provider' : 'Customer'}
                </Badge>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, i) => (
                    <div key={i}>
                      <div className="font-bold text-lg text-(--primary-gradient-start)">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate('register-provider')}
                  >
                    {user?.isProvider ? 'Update Services' : 'Become Provider'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
             <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full h-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      {!isEditing ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditing(false)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={handleSave}
                            className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-(--surface) border border-border/40">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'completed' ? 'bg-success' : 'bg-(--primary-gradient-start)'
                            }`} />
                            <div>
                              <p className="font-medium">{activity.service}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.type === 'completed' ? 'Service completed' : 'Service hired'} • {activity.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{activity.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
                    <div className="space-y-6">
                      {(
                        <>
                          <div className="space-y-4">
                            <h4 className="font-medium">Mode Switcher</h4>
                            <div className="p-4 rounded-lg bg-linear-to-br from-(--primary-gradient-start)/10 to-(--primary-linear-end)/10 border border-(--primary-gradient-start)/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                                    <Briefcase className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Switch to Provider Mode</p>
                                    <p className="text-sm text-muted-foreground">Access your provider dashboard</p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                className="w-full mt-3 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white"
                                onClick={() => onNavigate('provider-dashboard')}
                              >
                                <Briefcase className="w-4 h-4 mr-2" />
                                Go to Provider Dashboard
                              </Button>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Appearance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                              <span>Dark mode</span>
                            </div>
                            <Switch
                              className="border border-border"
                              checked={isDarkMode}
                              onCheckedChange={onToggleDarkMode}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Email notifications</span>
                            <Switch defaultChecked className="border border-border" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SMS notifications</span>
                            <Switch defaultChecked className="border border-border" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Marketing emails</span>
                            <Switch className="border border-border"/>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Privacy</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Profile visibility</span>
                            <Badge variant="secondary">Public</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Show location</span>
                            <Switch defaultChecked className="border border-border"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage