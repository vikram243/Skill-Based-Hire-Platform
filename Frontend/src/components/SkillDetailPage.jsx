import React, { useState } from 'react';
import Navigation from './Navigation';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
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
import { getProviderById } from '../data/mockData';

export default function SkillDetailPage({ providerId, onNavigate, onBack, user }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const provider = providerId ? getProviderById(providerId) : null;

  if (!provider) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
        <Navigation 
          onNavigate={onNavigate} 
          user={user}
          isAuthenticated={!!user}
          currentPage="skill-detail"
        />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Provider not found</p>
            <Button onClick={onBack}>Go Back</Button>
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
    <div className="min-h-screen bg-linear-to-br pb-16 from-background via-surface/30 to-background authenticated-page">
      <Navigation 
        onNavigate={onNavigate} 
        user={user}
        isAuthenticated={!!user}
        currentPage="skill-detail"
      />
      
      <div className="container mx-auto px-4 py-6">
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <div className="flex justify-between">
                <Avatar className="h-20 w-20 ring-4 ring-(--primary-gradient-start)/20">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white text-xl">
                      {provider.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`border-border/40 ${isFavorited ? 'bg-accent/10 text-accent' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-border/40">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{provider.name}</h1>
                      {provider.isVerified && (
                        <CheckCircle className="w-6 h-6 text-(--primary-gradient-start)" />
                      )}
                    </div>
                    <div className="flex items-center justify-between space-x-4 text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{provider.responseTime} response</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                      </div>
                      <Badge 
                        variant={provider.availability === 'available' ? 'default' : 'secondary'}
                        className={provider.availability === 'available' 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-accent text-accent-foreground'
                        }
                      >
                        {provider.availability}
                      </Badge>
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
                <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
              </div>
            </Card>

            {/* Tabs */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-border/30 last:border-b-0">
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
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {portfolio.map((item) => (
                      <Card key={item.id} className="overflow-hidden border-border/40">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <div className="space-y-4">
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
                  </div>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-20">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-(--primary-gradient-start) mb-1">
                  ${provider.hourlyRate}/hr
                </p>
                <p className="text-muted-foreground">Starting rate</p>
              </div>

              <div className="space-y-4 mb-6">
                <Button 
                  size="lg"
                  className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onNavigate('hire-flow', { selectedProviderId: provider.id })}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full border-2 border-(--primary-gradient-start)/30 text-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/5"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
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
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Protected by SkillHub guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}