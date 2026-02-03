import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterProviderPanel from './RegisterProviderPage';
import { profileSchema, firstZodError } from '../lib/schemas';
import ApplicationStatusPanel from './ApplicationStatusPanel';
import api from '../lib/axiosSetup';
import { useDispatch } from "react-redux";
import { updateAvatar } from "../slices/userSlice";
import { updatePersonalInfo } from "../slices/userSlice";
import {
  MapPin,
  Phone,
  Star,
  Edit,
  LogOut,
  Camera,
  Save,
  X,
  Briefcase
} from 'lucide-react';
import { Switch } from './ui/switch';

function ProfilePage() {
  const { user } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisterProviderOpen, setIsRegisterProviderOpen] = useState(false);
  const [isApplicationStatusOpen, setIsApplicationStatusOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    fistName: user?.firstName || '',
    lastName: user?.lastName || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [profileError, setProfileError] = useState('');
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Bookings', value: '127' },
    { label: 'Active Orders', value: '4' },
  ];

  const recentActivity = [
    { type: 'completed', service: 'Home Cleaning', date: '2 days ago', rating: 5 },
    { type: 'hired', service: 'Plumbing Repair', date: '1 week ago', rating: 5 },
    { type: 'completed', service: 'Garden Maintenance', date: '2 weeks ago', rating: 4 },
  ];

  useEffect(() => {
    if (!profileError) return;

    const timer = setTimeout(() => {
      setProfileError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [profileError]);


  const onLogout = async () => {
    try {
      const res = await api.get('/api/users/logout');
      if (res.status === 200)
        localStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSave = async () => {
    setProfileError('');

    const parsed = profileSchema.safeParse({
      firstName: formData.fistName,
      lastName: formData.lastName,
      location: formData.location,
      bio: formData.bio
    });

    if (!parsed.success) {
      setProfileError(firstZodError(parsed.error));
      return;
    }

    try {
      setSaveLoading(true);

      const res = await api.put("/api/users/update-profile", {
        firstName: formData.fistName,
        lastName: formData.lastName,
        location: formData.location,
        bio: formData.bio
      });

      if (res.status === 200) {
        dispatch(updatePersonalInfo({
          firstName: res?.data?.data?.firstName,
          lastName: res?.data?.data?.lastName,
          fullName: res?.data?.data?.fullName,
          location: res?.data?.data?.location,
          bio: res?.data?.data?.bio
        }));

        setIsEditing(false);
      }
    } catch (error) {
      setProfileError(
        error?.response?.data?.message || "Profile update failed"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      setAvatarLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.put(
        "/api/users/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        dispatch(updateAvatar(res?.data?.data?.avatar));
      }
    } catch (error) {
      console.error("Avatar upload failed", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
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
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="text-xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                      {user?.fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    disabled={avatarLoading}
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/90 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarLoading ? (
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>

                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateProfilePicture(file);
                  }}
                />

                <h2 className="text-xl font-bold mb-1">{user?.fullName}</h2>
                <p className="text-muted-foreground mb-2">{user?.email}</p>

                <Badge variant="secondary" className="mb-4">
                  {user?.isProvider ? 'Service Provider' : 'Customer'}
                </Badge>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 {user?.number}</span>
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
                    className="w-full mt-3 bg-linear-to-r cursor-pointer from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white"
                    onClick={() => {
                      if (user?.isProvider && user?.providerStatus === "approved") {
                        navigate("/provider-dashboard");
                      } else if (
                        user?.isProvider &&
                        (user?.providerStatus === "pending" ||
                          user?.providerStatus === "rejected")
                      ) {
                        setIsApplicationStatusOpen(true);
                      } else {
                        setIsRegisterProviderOpen(true);
                      }
                    }}
                  >
                    {user?.isProvider && user?.providerStatus === "approved"
                      ? "Go to Provider Dashboard"
                      : user?.isProvider &&
                        (user?.providerStatus === "pending" ||
                          user?.providerStatus === "rejected")
                        ? "Check Application Status"
                        : "Become Provider"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                            disabled={saveLoading}
                            onClick={handleSave}
                            className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                          >
                            {saveLoading ? (
                              <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                              </svg>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {profileError && (
                      <div className="text-sm text-red-600">{profileError}</div>
                    )}

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className='flex gap-1 flex-col'>
                          <Label htmlFor="name">First Name</Label>
                          <Input
                            id="name"
                            value={formData.fistName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fistName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className='flex gap-1 flex-col'>
                          <Label htmlFor="email">Last Name</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className='flex gap-1 flex-col'>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={user?.number}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled
                          />
                        </div>
                        <div className='flex gap-1 flex-col'>
                          <Label htmlFor="location">Email</Label>
                          <Input
                            id="address"
                            value={user?.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            disabled
                          />
                        </div>
                      </div>
                      <div className='flex gap-1 flex-col'>
                        <Label htmlFor="bio">Address</Label>
                        <Textarea
                          id="bio"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                          rows={2}
                        />
                      </div>

                      <div className='flex gap-1 flex-col'>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={2}
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
                            <div className={`w-2 h-2 rounded-full ${activity.type === 'completed' ? 'bg-success' : 'bg-(--primary-gradient-start)'
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
                            <Switch className="border border-border" />
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
                            <Switch defaultChecked className="border border-border" />
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
      <RegisterProviderPanel
        isOpen={isRegisterProviderOpen}
        onClose={() => setIsRegisterProviderOpen(false)}
        onSuccess={() => {
          setIsRegisterProviderOpen(false);
        }}
        number={user?.number}
      />

      <ApplicationStatusPanel
        isOpen={isApplicationStatusOpen}
        onClose={() => setIsApplicationStatusOpen(false)}
        status={user?.providerStatus}
        submittedAt={user?.providerSubmittedAt}
      />
    </div>
  );
}

export default ProfilePage