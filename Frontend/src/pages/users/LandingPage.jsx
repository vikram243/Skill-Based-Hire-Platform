import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Search, MapPin, Clock, CheckCircle, Bell, User, ArrowRight, Users, Shield, Zap } from 'lucide-react';
import { Skills } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function LandingPage({ setIsAuthPanelOpen }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useSelector(state => state.user);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      isAuthenticated ? navigate('/search', { initialSearchQuery: searchQuery }) : setIsAuthPanelOpen(true);
    } else {
      isAuthenticated ? navigate('/search') : setIsAuthPanelOpen(true);
    }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Trusted Community",
      description: "Connect with verified local service providers who are background-checked and highly rated."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with buyer protection and satisfaction guarantee."
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Quick Response",
      description: "Get responses within minutes and book services that fit your schedule."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability and automated scheduling."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        {/* Animated Background blobs */}
        <motion.div
          animate={{
            scale: [1, 1.6, 1],
            rotate: [0, 90, 0],
            x: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl z-0"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            rotate: [0, -90, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl z-0"
        />

        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {user && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-blue-600 font-bold mb-4 tracking-wider uppercase text-sm"
              >
                Welcome back, {user?.fullName?.split(' ')[0]}!
              </motion.p>
            )}
            <h1 className="text-6xl md:text-8xl font-black mb-8 bg-linear-to-r from-[#3B82F6] via-blue-500 to-[#1E40AF] bg-clip-text text-transparent leading-[1.1] tracking-tight">
              Hire skills near you,<br /> <span className="text-foreground">anytime!</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with skilled professionals in your area for any service you need.
            Fast, reliable, and trusted by thousands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-12"
          >
            <div className="flex-1 relative group">
              <Search className="absolute z-1 left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="What skill are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-14 h-16 text-lg bg-card/50 backdrop-blur-sm border-2 border-border/60 shadow-xl focus:shadow-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 rounded-2xl"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-16 px-12 text-lg font-bold bg-linear-to-r from-[#3B82F6] to-[#1E40AF] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl"
            >
              Find Skills
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground"
          >
            {[
              { icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, text: "10k+ Customers" },
              { icon: <Clock className="w-5 h-5 text-amber-500" />, text: "24/7 Support" },
              { icon: <MapPin className="w-5 h-5 text-blue-500" />, text: "50+ Cities" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-border/10 backdrop-blur-sm"
              >
                {item.icon}
                <span className="font-medium text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-24 px-6 bg-secondary/10">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black mb-6">Popular Skills</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most requested services in your area
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {Skills.slice(0, 8).map((skill) => (
              <motion.div key={skill.id} variants={itemVariants}>
                <Card
                  className="group h-full p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 bg-card border border-border/80 hover:border-blue-500/50 relative overflow-hidden rounded-3xl"
                  onClick={() => isAuthenticated ? navigate('/search', { initialSearchQuery: skill.name }) : setIsAuthPanelOpen(true)}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 origin-left">{skill.icon}</div>
                    <h3 className="font-bold mb-3 text-xl">{skill.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
                    <div className="mt-6 flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform -translate-x-2.5 group-hover:translate-x-0 transition-all duration-300">
                      Browse Providers <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <Button
              variant="outline"
              onClick={() => isAuthenticated ? navigate('/search') : setIsAuthPanelOpen(true)}
              className="px-12 h-14 text-lg border-2 border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 rounded-2xl font-bold"
            >
              View All Skills
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Active Users", value: "250K+" },
              { label: "Providers", value: "45K+" },
              { label: "Cities Covered", value: "120+" },
              { label: "Average Rating", value: "4.9/5" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-background relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black mb-6">Why Choose SkillHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The world's most trusted platform for professional local services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full p-8 text-center hover:shadow-2xl transition-all duration-500 bg-card border-2 border-border/40 hover:border-blue-500/40 rounded-4xl overflow-hidden">
                  <div className="mb-8 p-4 rounded-3xl bg-secondary/50 inline-block group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user?.isProvider && (
        <section className="py-24 px-6 relative">
          <div className="container max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-linear-to-br from-indigo-600 to-blue-800 rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2" />

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to earn by sharing your skills?</h2>
                <p className="text-xl text-indigo-100/80 mb-12 leading-relaxed">
                  Join our community of over 45,000 professional providers and grow your business today.
                  Get paid weekly and choose your own hours.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => isAuthenticated ? navigate('/register-provider') : setIsAuthPanelOpen(true)}
                    size="lg"
                    className="h-16 px-10 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl text-lg shadow-xl"
                  >
                    Become a Provider
                  </Button>
                  <Button
                    onClick={() => navigate('/success-stories')}
                    variant="ghost"
                    size="lg"
                    className="h-16 px-10 text-white hover:bg-white/10 font-bold rounded-2xl text-lg"
                  >
                    Read Success Stories
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}