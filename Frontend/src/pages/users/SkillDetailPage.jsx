import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Phone,
  Mail,
  Heart,
  Share2
} from 'lucide-react';

export default function SkillDetailPage({ provider }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const listItem = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const MotionAvatar = motion.create(Avatar);
  const MotionButton = motion.create(Button);
  const MotionCard = motion.create(Card);
  const MotionP = motion.p;

  if (!provider) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Provider not found</p>
            <Button onClick={navigate(-1)}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent work! Very professional and completed the job ahead of schedule. Highly recommend!',
      service: 'Plumbing Repair'
    },
    {
      id: 2,
      user: 'Mike R.',
      rating: 5,
      date: '1 week ago',
      comment: 'Great communication and quality work. Will definitely hire again.',
      service: 'Electrical Installation'
    },
    {
      id: 3,
      user: 'Lisa P.',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good service, arrived on time and fixed the issue quickly.',
      service: 'Emergency Plumbing'
    }
  ];

  const portfolio = [
    {
      id: 1,
      title: 'Kitchen Renovation',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
      description: 'Complete kitchen plumbing overhaul'
    },
    {
      id: 2,
      title: 'Bathroom Fixture Installation',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=200&fit=crop',
      description: 'Modern bathroom fixtures and piping'
    },
    {
      id: 3,
      title: 'Emergency Leak Repair',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      description: 'Quick response emergency service'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid lg:grid-cols-3 gap-8">
          <motion.div variants={sectionVariants} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <MotionCard className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <div className="flex justify-between">
                <MotionAvatar initial={false} whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }} className="h-20 w-20 ring-4 ring-(--primary-gradient-start)/20">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white text-xl">
                    {provider.name.charAt(0)}
                  </AvatarFallback>
                </MotionAvatar>

                <div className="flex items-center space-x-2">
                  <MotionButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`border-border/40 ${isFavorited ? 'bg-accent/10 text-accent' : ''}`}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.div animate={isFavorited ? { scale: 1.2 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 1000 }}>
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </motion.div>
                  </MotionButton>

                  <Button variant="outline" size="sm" className="border-border/40">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold truncate max-w-54 md:max-w-100">{provider.name}</h1>
                      {provider.isVerified && (
                        <CheckCircle className="w-6 h-6 text-(--primary-gradient-start)" />
                      )}
                    </div>
                    <div className="flex items-center justify-between space-x-4 text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className='truncate max-w-35 md:max-w-70'>{provider.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span className='truncate max-w-16 md:max-w-40'>{provider.responseTime || 'N/A'} response time</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-(--primary-gradient-start)/10 border-(--primary-gradient-start)/30 text-(--primary-gradient-start)"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <MotionP layout transition={{ duration: 0.25, ease: 'easeOut' }} className={`text-muted-foreground leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
                  {provider.bio}
                </MotionP>
                <button onClick={() => setExpanded(!expanded)} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              </div>
            </MotionCard>

            {/* Tabs */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full h-full grid-cols-3 mb-6 bg-muted/50">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <motion.div variants={listVariants} initial="hidden" animate="show">
                        {reviews.map((review) => (
                          <motion.div key={review.id} variants={listItem} className="pb-4 border-b border-border/30 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold">{review.user}</span>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.service} • {review.date}</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed line-clamp-6">{review.comment}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="portfolio"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      {portfolio.map((item) => (
                        <MotionCard
                          key={item.id}
                          whileHover={{ y: -6, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-border/40"
                        >
                          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </MotionCard>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <Award className="w-6 h-6 text-(--primary-gradient-start)" />
                        <div>
                          <p className="font-semibold">10+ Years Experience</p>
                          <p className="text-sm text-muted-foreground">Professional plumbing and electrical work</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-(--primary-gradient-start)" />
                        <div>
                          <p className="font-semibold">Licensed & Insured</p>
                          <p className="text-sm text-muted-foreground">Fully licensed contractor with liability insurance</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-(--primary-gradient-start)" />
                        <div>
                          <p className="font-semibold">{provider.completedJobs}+ Completed Jobs</p>
                          <p className="text-sm text-muted-foreground">Successfully completed projects with high satisfaction</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Available after booking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Message through platform</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150 }}
            className="space-y-6">
            {/* Booking Card */}
            <MotionCard initial={false} className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-20">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-(--primary-gradient-start) mb-1">
                  ₹{provider.hourlyRate}/{provider.rateType === "hourly" ? "hr" : provider.rateType === "perday" ? "day" : "job"}
                </p>
                <p className="text-muted-foreground">Starting rate</p>
              </div>

              <div className="space-y-4 mb-6">
                <MotionButton
                  size="lg"
                  className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => navigate(`/hire/${provider.id}`, { selectedProviderId: provider.id })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </MotionButton>

                <MotionButton
                  variant="ghost"
                  size="lg"
                  className="w-full border-2 border-(--primary-gradient-start)/30 text-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/5"
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </MotionButton>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span className="font-medium">{provider.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed Jobs:</span>
                  <span className="font-medium">{provider.completedJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium">{provider.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span className="font-medium">{provider.estimatedTime}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Protected by SkillHub guarantee</span>
                </div>
              </div>
            </MotionCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}