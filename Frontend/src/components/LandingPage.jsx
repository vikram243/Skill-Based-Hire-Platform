import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Skills, Provider } from '../data/mockData';
import AuthPanel from './AuthPanel';
import { 
  Star, 
  Users, 
  Shield, 
  ArrowRight,
  Zap
} from 'lucide-react';

export default function LandingPage({ onNavigate, onLogin }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate('home', { searchQuery });
    }
  };
  
  const handleAuthSuccess = (user, userType) => {
    console.log('🎉 Auth success in LandingPage:', user, userType);
    setIsAuthPanelOpen(false);
    onLogin(user);
  };

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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-6 mx-auto">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-bold text-lg">S</span>
              </div>
              <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                SkillHub
              </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => setIsAuthPanelOpen(true)}>
              Sign In
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('admin-login')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Admin
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="md:hidden"
            onClick={() => setIsAuthPanelOpen(true)}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-linear-to-br from-(--primary-gradient-start)/20 to-(--primary-gradient-end)/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-62 h-62 bg-linear-to-br from-(--primary-gradient-start)10 to-(--primary-gradient-end)/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-linear-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent leading-tight">
            Hire skills near you, anytime
          </h1>
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with skilled professionals in your area for any service you need. 
            Fast, reliable, and trusted by thousands.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                placeholder="Search skill or service, e.g. Electrician"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 h-14 text-lg bg-card border-2 border-border/60 shadow-lg focus:shadow-xl focus:border-(--primary-gradient-start transition-all duration-200"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-14 px-10 text-lg bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Find Skills
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
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
      </section>

      {/* Featured Skills */}
      <section className="py-20 px-6 bg-linear-to-b from-secondary/30 to-secondary/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Skills</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most requested services in your area
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {Skills.slice(0, 8).map((skill) => (
              <Card 
                key={skill.id}
                className="group p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden"
                onClick={() => onNavigate('home', { searchQuery: skill.name })}
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
              onClick={() => onNavigate('home')}
              className="px-10 py-3 text-lg border-2 hover:border-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/10 transition-all duration-200"
            >
              View All Skills
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-linear-to-br from-surface/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SkillHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find, book, and manage local services with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden">
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
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-secondary/20 via-background to-secondary/20" />
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              <h3 className="font-bold text-xl mb-4">Search</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Find skilled people near you for any service you need</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-4">Hire</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Send request & confirm address for the service</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-4">Get it done</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Provider performs the job professionally and efficiently</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-secondary/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3  gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-bold text-lg">S</span>
              </div>
              <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                SkillHub
              </h1>
            </div>
              <p className="text-muted-foreground">
                Connecting people with skilled professionals for all their service needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>How it works</li>
                <li>Browse services</li>
                <li>Safety</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Become a provider</li>
                <li>Provider resources</li>
                <li>Community</li>
                <li>Tools</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SkillHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Panel */}
      <AuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}