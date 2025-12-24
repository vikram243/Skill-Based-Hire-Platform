import React from 'react'
import Navigation from './Navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import {
  Search,
  ArrowRight,
  Users,
  Star,
  Clock,
  Shield,
  Wrench,
  Palette,
  Code,
  Camera,
  Music,
  GraduationCap,
  Briefcase,
  Heart,
  CheckCircle,
  Zap
} from 'lucide-react';

const HomeFeed = () => {

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '10,000+', label: 'Skilled Professionals' },
    { icon: <Star className="w-8 h-8" />, value: '50,000+', label: 'Services Completed' },
    { icon: <Clock className="w-8 h-8" />, value: '< 2 hrs', label: 'Average Response Time' },
    { icon: <Shield className="w-8 h-8" />, value: '100%', label: 'Verified Providers' }
  ];

  const professions = [
    { icon: <Wrench className="w-8 h-8" />, name: 'Home Repair', color: 'from-blue-500 to-blue-600' },
    { icon: <Palette className="w-8 h-8" />, name: 'Creative', color: 'from-purple-500 to-purple-600' },
    { icon: <Code className="w-8 h-8" />, name: 'Tech & IT', color: 'from-green-500 to-green-600' },
    { icon: <Camera className="w-8 h-8" />, name: 'Photography', color: 'from-pink-500 to-pink-600' },
    { icon: <Music className="w-8 h-8" />, name: 'Music & Arts', color: 'from-orange-500 to-orange-600' },
    { icon: <GraduationCap className="w-8 h-8" />, name: 'Education', color: 'from-indigo-500 to-indigo-600' },
    { icon: <Briefcase className="w-8 h-8" />, name: 'Business', color: 'from-cyan-500 to-cyan-600' },
    { icon: <Heart className="w-8 h-8" />, name: 'Health & Wellness', color: 'from-red-500 to-red-600' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Search & Discover',
      description: 'Browse through our verified professionals or search for specific skills you need',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: '2',
      title: 'Review & Compare',
      description: 'Check ratings, reviews, and portfolios to find the perfect match for your needs',
      icon: <Star className="w-6 h-6" />
    },
    {
      step: '3',
      title: 'Book & Connect',
      description: 'Schedule a service, chat with your provider, and manage everything in one place',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      step: '4',
      title: 'Get It Done',
      description: 'Receive quality service from skilled professionals and leave your feedback',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'Found an amazing electrician within minutes! The booking process was seamless and the service was outstanding.'
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      text: 'SkillHub connected me with a talented graphic designer who transformed my brand. Highly recommend!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Property Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      text: 'The quality of professionals on this platform is exceptional. I use it for all my property maintenance needs.'
    }
  ];

  return (
    <div className='min-h-screen bg-linear-to-br pb-8 from-background via-surface/30 to-background authenticated-page'>
      <Navigation />

      <div className='container mx-auto px-4 py-6'>
        <div className='mb-16 text-center py-12 md:py-16'>
          <div className='max-w-4xl mx-auto'>
            <Badge className="mb-6 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white px-4 py-1">
              Welcome to SkillHub
            </Badge>
            <h1 className="text-4xl! md:text-6xl! mb-6 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
              Connect with Skilled Professionals
            </h1>
            <p className="text-xl! text-muted-foreground mb-8 leading-relaxed">
              Find trusted experts for any service you need. From home repairs to creative projects, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                // onClick={() => onNavigate('search')}
                className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Providers
              </Button>
              <Button
                size="lg"
                variant="outline"
                // onClick={() => onNavigate('register-provider')}
                className="border-2 hover:border-(--primary-gradient-start) px-8"
              >
                Become a Provider
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mb-16'>
        <div className="grid grid-cols-2 mx-4 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-linear-to-br from-card to-surface hover:shadow-xl transition-all duration-300 border-2 border-border/40 hover:border-(--primary-gradient-start)/30">
              <div className="flex justify-center mb-3 text-(--primary-gradient-start)">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl mb-2">{stat.value}</div>
              <p className="text-sm! text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className='mb-16'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl! md:text-4xl! mb-4'>Explore by Profession</h2>
          <p className='text-lg! text-muted-foreground max-w-2xl mx-auto'>Discover skilled professionals across various industries ready to help you</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mx-4'>
          {
            professions.map((profession, index) => (
              <Card
                key={index}
                className="group p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden"
                onClick={() => onNavigate('search')}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${profession.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 text-foreground group-hover:text-(--primary-gradient-start) transition-colors group-hover:scale-110 transform duration-300">
                    {profession.icon}
                  </div>
                  <p className="text-sm md:text-base">{profession.name}</p>
                </div>
              </Card>
            ))
          }
        </div>
      </div>

      <div className='mb-16'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl! md:text-4xl! mb-4'>How It Works</h2>
          <p className='text-lg! text-muted-foreground max-w-2xl mx-auto'>
            Get Started In Simple Steps
          </p>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4'>
          {howItWorks.map((item, index) => (
            <Card key={index} className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-border/40 hover:border-(--primary-gradient-start)/30">
              <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-(--primary-gradient-start)/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-4xl mb-4 opacity-20">{item.step}</div>
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='mb-16'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl! md:text-4xl! mb-4'>What Our Users Say</h2>
          <p className='text-lg! text-muted-foreground max-w-2xl mx-auto'>
            Real stories from people who found the help they needed
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-6 mx-4'>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-border/40 hover:border-[var(--primary-gradient-start)]/30">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='mb-16'>
        <div className='grid md:grid-cols-2 gap-8 mx-4'>
          <Card className="group p-8 bg-linear-to-br from-(--primary-gradient-start)/10 to-(--primary-gradient-end)/5 border-2 border-(--primary-gradient-start)/20 hover:border-(--primary-gradient-start)/40 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-(--primary-gradient-start)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center text-white mb-4 shadow-lg">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Become a Provider</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Share your skills and earn money by helping others in your community. Join thousands of successful providers.
              </p>
              <Button
                onClick={() => onNavigate('register-provider')}
                className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="group p-8 bg-linear-to-br from-accent/10 to-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-accent to-accent/80 flex items-center justify-center text-white mb-4 shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Need Urgent Help?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find providers available for emergency services 24/7. Get help when you need it most.
              </p>
              <Button
                variant="outline"
                onClick={() => onNavigate('search')}
                className="border-2 border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-200"
              >
                Find Emergency Help
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default HomeFeed;
