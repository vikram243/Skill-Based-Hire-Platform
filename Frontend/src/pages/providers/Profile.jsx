import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Camera, Save, DollarSign, Briefcase,
  Globe, Clock, Shield, Star, Award, CheckCircle, Edit3, Image,
  Languages, X, Plus, Link, Info, Zap, Package
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { mockProviderProfile, mockProviderGallery, mockProviderStats } from '../../data/providerMockData';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState({ ...mockProviderProfile });
  const [galleryImages, setGalleryImages] = useState(mockProviderGallery);
  const [isAvailable, setIsAvailable] = useState(true);
  const [urgentAvailable, setUrgentAvailable] = useState(true);
  const [newCert, setNewCert] = useState('');
  const [certifications, setCertifications] = useState(mockProviderProfile.certifications);

  const handleSave = () => toast.success('✅ Profile updated successfully!');

  const handleRemoveGallery = (img) => {
    setGalleryImages(prev => prev.filter(i => i !== img));
    toast.success('Image removed from portfolio');
  };

  const handleAddCert = () => {
    if (!newCert.trim()) return;
    setCertifications(prev => [...prev, newCert.trim()]);
    setNewCert('');
    toast.success('Certification added!');
  };

  const handleRemoveCert = (cert) => {
    setCertifications(prev => prev.filter(c => c !== cert));
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl text-foreground">Provider Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your profile & service offering</p>
              </div>
              <Button onClick={handleSave}
                className="bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl gap-2 self-start sm:self-auto">
                <Save className="h-4 w-4" /> Save All Changes
              </Button>
            </div>
          </motion.div>

          {/* Profile Hero Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="bg-linear-to-br from-blue-600 via-indigo-700 to-blue-800 border-0 shadow-xl text-white overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img src={profile.avatar_url} alt={profile.full_name}
                      className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl" />
                    <button onClick={() => toast.info('Upload photo feature')}
                      className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg">
                      <Camera className="h-3.5 w-3.5 text-blue-700" />
                    </button>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-white text-xl">{profile.full_name}</h2>
                      <Badge className="bg-green-400/20 text-green-300 border-green-400/30 text-xs gap-1">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </Badge>
                    </div>
                    <p className="text-blue-200 text-sm mb-2">{profile.service_name} · {profile.location}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-blue-200 text-xs">
                        <Star className="h-3.5 w-3.5 text-amber-300 fill-amber-300" /> {mockProviderStats.averageRating} rating
                      </span>
                      <span className="flex items-center gap-1 text-blue-200 text-xs">
                        <Award className="h-3.5 w-3.5" /> {mockProviderStats.completedOrders} completed
                      </span>
                      <span className="flex items-center gap-1 text-blue-200 text-xs">
                        <Briefcase className="h-3.5 w-3.5" /> {profile.years_experience} yrs experience
                      </span>
                    </div>
                  </div>
                  {/* Availability toggle */}
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-white text-xs">Available for orders</span>
                        <Switch checked={isAvailable} onCheckedChange={setIsAvailable} className="scale-75" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className={`h-3 w-3 ${urgentAvailable ? 'text-amber-300' : 'text-white/40'}`} />
                        <span className="text-white/80 text-xs">Accept urgent</span>
                        <Switch checked={urgentAvailable} onCheckedChange={setUrgentAvailable} className="scale-75" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="personal" className="space-y-5">
              <TabsList className="grid w-full grid-cols-4 h-10">
                <TabsTrigger value="personal" className="text-xs md:text-sm">Personal</TabsTrigger>
                <TabsTrigger value="service" className="text-xs md:text-sm">My Service</TabsTrigger>
                <TabsTrigger value="credentials" className="text-xs md:text-sm">Credentials</TabsTrigger>
                <TabsTrigger value="portfolio" className="text-xs md:text-sm">Portfolio</TabsTrigger>
              </TabsList>

              {/* ── Personal Info ── */}
              <TabsContent value="personal">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-foreground text-base flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" /> Basic Information
                        </CardTitle>
                        <CardDescription>Your public profile details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: 'Full Name', icon: User, key: 'full_name', type: 'text' },
                            { label: 'Email Address', icon: Mail, key: 'email', type: 'email', disabled: true },
                            { label: 'Phone Number', icon: Phone, key: 'phone', type: 'tel' },
                            { label: 'Location', icon: MapPin, key: 'location', type: 'text' },
                            { label: 'Hourly Rate ($)', icon: DollarSign, key: 'hourly_rate', type: 'number' },
                            { label: 'Years of Experience', icon: Briefcase, key: 'years_experience', type: 'number' },
                            { label: 'Website / Portfolio URL', icon: Globe, key: 'website', type: 'url' },
                            { label: 'Availability', icon: Clock, key: 'availability', type: 'text' },
                          ].map(f => (
                            <div key={f.key}>
                              <Label className="text-muted-foreground text-xs mb-1.5 block">{f.label}</Label>
                              <div className="relative">
                                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={f.type}
                                  value={(profile)[f.key] || ''}
                                  disabled={f.disabled}
                                  onChange={e => setProfile({ ...profile, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                                  className={`pl-10 h-9 ${f.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1.5 block">Professional Bio</Label>
                          <Textarea
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                            placeholder="Tell clients about your expertise, approach, and what makes you stand out..."
                            className="resize-none"
                          />
                          <p className="text-muted-foreground text-xs mt-1">{profile.bio.length}/500 characters</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Languages */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-foreground text-base flex items-center gap-2">
                          <Languages className="h-4 w-4 text-purple-500" /> Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.map((lang, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full border border-border/40">
                              <span className="text-foreground text-sm">{lang}</span>
                              <button onClick={() => setProfile({ ...profile, languages: profile.languages.filter(l => l !== lang) })}
                                className="text-muted-foreground hover:text-destructive transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => toast.info('Add language feature')}
                            className="h-8 text-xs gap-1">
                            <Plus className="h-3 w-3" /> Add Language
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-end">
                    <Button onClick={handleSave}
                      className="bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg gap-2">
                      <Save className="h-4 w-4" /> Save Personal Info
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* ── My Service (single service) ── */}
              <TabsContent value="service">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-foreground text-base flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" /> Your Service
                            </CardTitle>
                            <CardDescription>Each provider offers a single specialized service</CardDescription>
                          </div>
                          <Badge className="bg-green-500/10 text-green-600 border border-green-400/30 gap-1">
                            <CheckCircle className="h-3 w-3" /> Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Service Info Banner */}
                        <div className="p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-foreground">{profile.service_name}</h3>
                              <p className="text-muted-foreground text-sm">${profile.service_price}/hr base rate</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-2.5 rounded-lg bg-card border border-border/40">
                              <p className="text-muted-foreground text-xs mb-0.5">Normal Orders</p>
                              <p className="text-foreground">${profile.service_price}/hr</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-400/20">
                              <p className="text-muted-foreground text-xs mb-0.5">Urgent Orders</p>
                              <p className="text-amber-600">${Math.round(profile.service_price * 1.3)}/hr (+30%)</p>
                            </div>
                          </div>
                        </div>

                        {/* Editable Fields */}
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1.5 block">Service Name</Label>
                          <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input value={profile.service_name}
                              onChange={e => setProfile({ ...profile, service_name: e.target.value })}
                              className="pl-10 h-9" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1.5 block">Base Hourly Rate ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" value={profile.service_price}
                              onChange={e => setProfile({ ...profile, service_price: parseFloat(e.target.value), hourly_rate: parseFloat(e.target.value) })}
                              className="pl-10 h-9" />
                          </div>
                          <p className="text-muted-foreground text-xs mt-1">Urgent orders auto-calculated at +30% premium</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1.5 block">Service Description</Label>
                          <Textarea
                            value={profile.service_description}
                            onChange={e => setProfile({ ...profile, service_description: e.target.value })}
                            rows={4}
                            placeholder="Describe what you offer, tools you use, deliverables included..."
                            className="resize-none"
                          />
                        </div>

                        {/* Order Type Availability */}
                        <div className="space-y-3">
                          <Label className="text-muted-foreground text-xs">Order Type Availability</Label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 p-4 rounded-xl bg-secondary border border-border/40 flex items-center justify-between">
                              <div>
                                <p className="text-foreground text-sm">Normal Orders</p>
                                <p className="text-muted-foreground text-xs">Standard delivery time</p>
                              </div>
                              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-amber-500/5 border border-amber-400/20 flex items-center justify-between">
                              <div>
                                <p className="text-foreground text-sm flex items-center gap-1">
                                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Urgent Orders
                                </p>
                                <p className="text-muted-foreground text-xs">+30% premium rate</p>
                              </div>
                              <Switch checked={urgentAvailable} onCheckedChange={setUrgentAvailable} />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleSave} className="bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg gap-2">
                            <Save className="h-4 w-4" /> Save Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Service Stats */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-foreground text-base">Service Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: 'Total Orders', value: mockProviderStats.completedOrders },
                            { label: 'Total Revenue', value: `$${mockProviderStats.totalEarnings.toLocaleString()}` },
                            { label: 'Avg Rating', value: `${mockProviderStats.averageRating}★` },
                            { label: 'Repeat Clients', value: mockProviderStats.repeatClients },
                          ].map((m, i) => (
                            <div key={i} className="p-3 rounded-xl bg-secondary border border-border/40 text-center">
                              <p className="text-foreground text-lg">{m.value}</p>
                              <p className="text-muted-foreground text-xs">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* ── Credentials & Trust ── */}
              <TabsContent value="credentials">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-5">
                  {/* Certifications */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-foreground text-base flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" /> Certifications & Credentials
                        </CardTitle>
                        <CardDescription>Add your professional certifications to build trust</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <AnimatePresence>
                          <div className="space-y-2">
                            {certifications.map((cert, i) => (
                              <motion.div key={cert} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10, height: 0 }} transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border/40">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                                    <Award className="h-3.5 w-3.5 text-blue-500" />
                                  </div>
                                  <span className="text-foreground text-sm">{cert}</span>
                                </div>
                                <button onClick={() => handleRemoveCert(cert)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </AnimatePresence>
                        <div className="flex gap-2">
                          <Input placeholder="Add new certification..." value={newCert}
                            onChange={e => setNewCert(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddCert()}
                            className="h-9" />
                          <Button onClick={handleAddCert}
                            className="bg-linear-to-r from-blue-600 to-indigo-700 text-white h-9 gap-1 shrink-0">
                            <Plus className="h-4 w-4" /> Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Verification Status */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-foreground text-base flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" /> Verification Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { label: 'Email Verified', done: true },
                            { label: 'Phone Verified', done: true },
                            { label: 'Identity Verified', done: true },
                            { label: 'Background Check', done: false },
                            { label: 'Skill Assessment', done: false },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border/40">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-lg ${item.done ? 'bg-green-500/10' : 'bg-secondary'}`}>
                                  <CheckCircle className={`h-3.5 w-3.5 ${item.done ? 'text-green-500' : 'text-muted-foreground'}`} />
                                </div>
                                <span className="text-foreground text-sm">{item.label}</span>
                              </div>
                              {item.done ? (
                                <Badge className="bg-green-500/10 text-green-600 border border-green-400/20 text-xs">Verified</Badge>
                              ) : (
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Verify Now
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* ── Portfolio Gallery ── */}
              <TabsContent value="portfolio">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-foreground text-base flex items-center gap-2">
                              <Image className="h-4 w-4 text-purple-500" /> Portfolio Gallery
                            </CardTitle>
                            <CardDescription>Showcase your best work — {galleryImages.length} images</CardDescription>
                          </div>
                          <Button variant="outline" onClick={() => toast.info('Upload image functionality')} className="gap-1.5 text-sm">
                            <Camera className="h-3.5 w-3.5" /> Upload
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <AnimatePresence>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {galleryImages.map((img, i) => (
                              <motion.div key={img} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                                className="relative group rounded-xl overflow-hidden">
                                <img src={img} alt={`Portfolio ${i + 1}`}
                                  className="w-full h-36 md:h-44 object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <button onClick={() => handleRemoveGallery(img)}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                            {/* Upload placeholder */}
                            <button onClick={() => toast.info('Upload image functionality')}
                              className="h-36 md:h-44 rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-blue-400/50 hover:text-blue-500 transition-all duration-200">
                              <Plus className="h-6 w-6" />
                              <span className="text-xs">Add Image</span>
                            </button>
                          </div>
                        </AnimatePresence>
                        <p className="text-muted-foreground text-xs mt-3">
                          Supported: JPG, PNG, WebP · Max 5MB each · Up to 12 images
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Portfolio Tips */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-foreground text-sm mb-2">Portfolio Tips</p>
                            <ul className="text-muted-foreground text-xs space-y-1">
                              <li>• Show before/after project examples for maximum impact</li>
                              <li>• Include screenshots of live websites or apps you've built</li>
                              <li>• Add variety — different types of projects attract more clients</li>
                              <li>• High-quality images get 3x more profile views</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}