import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Plus, X, Save, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { mockProviderProfile, mockProviderSkills, mockProviderGallery } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState(mockProviderProfile);
  const [skills,] = useState(mockProviderSkills);
  const [galleryImages, setGalleryImages] = useState(mockProviderGallery);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    setGalleryImages(galleryImages.filter(img => img !== imageUrl));
    toast.success('Image removed from gallery');
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
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
            <h1 className="text-3xl mb-2 text-foreground">Provider Profile</h1>
            <p className="text-muted-foreground">Manage your profile and service offerings</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className='max-w-4xl mx-auto'
          >
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="gallery">Portfolio</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <motion.div variants={itemVariants}>
                  <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                    <CardHeader>
                      <CardTitle className="text-foreground">Personal Information</CardTitle>
                    <CardDescription>Update your profile details and business information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2 block">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile.email}
                            disabled
                            className="pl-10 opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2 block">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2 block">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2 block">Hourly Rate ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={profile.hourly_rate}
                            onChange={(e) => setProfile({ ...profile, hourly_rate: parseFloat(e.target.value) })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2 block">Years of Experience</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={profile.years_experience}
                            onChange={(e) => setProfile({ ...profile, years_experience: parseInt(e.target.value) })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground mb-2 block">Bio</Label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell customers about yourself and your expertise..."
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              </TabsContent>

              {/* Skills & Services */}
              <TabsContent value="services">
                <motion.div variants={itemVariants}>
                  <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                    <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Your Services</CardTitle>
                        <CardDescription>Manage the services you offer</CardDescription>
                      </div>
                      <Button
                        onClick={() => toast.info('Add service functionality')}
                        className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map(skill => (
                        <div
                          key={skill.id}
                          className="p-4 rounded-xl bg-(--surface) border border-border/40"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-foreground mb-1">{skill.name}</h3>
                              <p className="text-muted-foreground text-sm">${skill.price}/hr</p>
                            </div>
                            <Badge className="bg-success text-success-foreground">Active</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </TabsContent>

              {/* Portfolio Gallery */}
              <TabsContent value="gallery">
                <motion.div variants={itemVariants}>
                  <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                    <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Portfolio Gallery</CardTitle>
                        <CardDescription>Showcase your work with images</CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => toast.info('Upload images functionality')}>
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <motion.div key={index} variants={itemVariants} className="relative group">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-40 object-cover rounded-xl border border-border"
                          />
                          <button
                            onClick={() => handleRemoveGalleryImage(image)}
                            className="absolute top-2 right-2 p-2 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-destructive-foreground" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}