import { useState } from 'react';
import logo from '../assets/logo.png';
import { Search, MapPin, Clock, CheckCircle, Users, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { AuthPanel } from './AuthPanel';

function LandingPage() {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const skills = [
    {
      id: '1',
      name: 'Electrician',
      category: 'Home Services',
      icon: '⚡',
      description: 'Electrical repairs, installations, and maintenance'
    },
    {
      id: '2',
      name: 'Plumber',
      category: 'Home Services',
      icon: '🔧',
      description: 'Plumbing repairs, installations, and emergency services'
    },
    {
      id: '3',
      name: 'House Cleaning',
      category: 'Home Services',
      icon: '🧹',
      description: 'Professional house cleaning and organizing services'
    },
    {
      id: '4',
      name: 'Carpenter',
      category: 'Home Services',
      icon: '🔨',
      description: 'Woodworking, furniture repair, and custom builds'
    },
    {
      id: '5',
      name: 'Personal Trainer',
      category: 'Health & Fitness',
      icon: '💪',
      description: 'Fitness training, workout plans, and health coaching'
    },
    {
      id: '6',
      name: 'Massage Therapist',
      category: 'Health & Fitness',
      icon: '💆',
      description: 'Therapeutic massage and wellness services'
    },
    {
      id: '7',
      name: 'Tutor',
      category: 'Education',
      icon: '📚',
      description: 'Academic tutoring and educational support'
    },
    {
      id: '8',
      name: 'Pet Sitter',
      category: 'Pet Care',
      icon: '🐕',
      description: 'Pet sitting, walking, and care services'
    }
  ];
  const features = [
    {
      icon: <Users className="w-8 h-8 text-(--primary-gradient-start)" />,
      title: "Trusted Community",
      description: "Connect with verified local service providers who are background-checked and highly rated."
    },
    {
      icon: <Shield className="w-8 h-8 text-(--primary-gradient-start)" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with buyer protection and satisfaction guarantee."
    },
    {
      icon: <Clock className="w-8 h-8 text-(--primary-gradient-start)" />,
      title: "Quick Response",
      description: "Get responses within minutes and book services that fit your schedule."
    },
    {
      icon: <Zap className="w-8 h-8 text-(--primary-gradient-start)" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability and automated scheduling."
    }
  ];
  return (
    <div className="min-h-screen bg-background">
      <div className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-18 items-center justify-between px-4 mx-auto py-3'>
          <div className='flex items-center cursor-pointer group'>
            <img src={logo} alt="logo" className='max-w-[35px] max-h-[35px]' />
            <h1 className="font-bold! text-xl! bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
              killHub
            </h1>
          </div>
          <div className='hidden md:flex md:justify-end items-center gap-2'>
            <Button variant="ghost">
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Admin
            </Button>
          </div>
          <Button
            variant="ghost"
            className="md:hidden flex justify-end"
            onClick={() => setIsAuthPanelOpen(true)}
          >
            Sign In
          </Button>
        </div>
      </div>
      <div className='flex sm:flex-col flex-col items-center text-center md:mt-26 mt-24'>
        <h1 className='text-6xl! md:text-7xl! font-bold! mb-8 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent leading-tight'>Hire skills near you, anytime!</h1>
        <p className='text-2xl! text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'>Connect with skilled professionals in your area for any service you need. Fast, reliable, and trusted by thousands.</p>
        <div className='flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-18'>
          <div className='flex-1 relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground'></Search>
            <Input
              placeholder="Search skill or service, e.g. Electrician"
              className="pl-12 w-auto md:w-150 h-14 text-lg bg-card border-2 border-border/60 shadow-lg focus:shadow-xl focus:border-(--primary-gradient-start) transition-all duration-200"
            />
          </div>
          <Button className='h-14 px-10 text-lg bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>Find Skills</Button>
        </div>
        <div className="flex flex-wrap justify-center items-center mb-24 gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span>10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-(--primary-gradient-start)" />
            <span>50+ Cities</span>
          </div>
        </div>
      </div>
      <div className='py-20 px-6 bg-linear-to-b from-secondary/30 to-secondary/50'>
        <div className='container max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl! font-bold! mb-4'>Popular Skills</h2>
            <p className='text-xl! text-muted-foreground max-w-2xl mx-auto'>Discover the most requested services in your area</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {skills.slice(0, 8).map((skill) => (
              <Card
                key={skill.id}
                className="group p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-(--primary-gradient-start)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                  <h3 className="font-semibold mb-3 text-lg">{skill.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              className="px-10 py-3 text-lg border-2 hover:border-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/10 transition-all duration-200"
            >
              View All Skills
            </Button>
          </div>
        </div>
      </div>
      <div className="py-16 bg-linear-to-br from-surface/20 to-background">
        <div className='container mx-auto px-4'>
          <div className="text-center mb-12">
            <h2 className="text-3xl! md:text-4xl! font-bold! mb-4">
              Why Choose SkillHub?
            </h2>
            <p className="text-xl! text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find, book, and manage local services with confidence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-border/40 hover:border-[var(--primary-gradient-start)]/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-(--primary-gradient-start)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-secondary/20 via-background to-secondary/20" />
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="text-center! mb-16">
            <h2 className="text-4xl! font-bold! mb-4">How It Works</h2>
            <p className="text-xl! text-muted-foreground max-w-2xl mx-auto">
              Getting the help you need is as simple as 1, 2, 3
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-bold! text-xl! mb-4">Search</h3>
              <p className="text-muted-foreground text-lg! leading-relaxed">Find skilled people near you for any service you need</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-bold! text-xl! mb-4">Hire</h3>
              <p className="text-muted-foreground text-lg! leading-relaxed">Send request & confirm address for the service</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-bold! text-xl! mb-4">Get it done</h3>
              <p className="text-muted-foreground text-lg! leading-relaxed">Provider performs the job professionally and efficiently</p>
            </div>
          </div>
        </div>
      </div>
      <div className='py-12 px-6 border-t bg-secondary/50'>
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="logo" className='max-w-[35px] max-h-[35px]' />
                <h1 className="font-bold! text-xl! bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                  SkillHub
                </h1>
              </div>
              <p className="text-muted-foreground">
                Connecting people with skilled professionals for all their service needs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold! mb-4">For Customers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>How it works</li>
                <li>Browse services</li>
                <li>Safety</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold! mb-4">For Providers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Become a provider</li>
                <li>Provider resources</li>
                <li>Community</li>
                <li>Tools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold! mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SkillHub. All rights reserved.</p>
          </div>
        </div>
      </div>

      <AuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
      />
    </div>
  )
}

export default LandingPage;