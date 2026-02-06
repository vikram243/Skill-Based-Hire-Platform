import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Search,
  CheckCircle,
  MessageCircle,
  Shield,
  ArrowRight,
  Clock,
  Zap,
  Users,
  Star,
  Award
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function HowItWorksPage({
  setIsAuthPanelOpen
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.user);
  const steps = [
    {
      id: 1,
      title: "Discover Skills",
      description: "Browse through hundreds of skills or search for exactly what you need. From plumbers to graphic designers, we have it all.",
      icon: <Search className="w-8 h-8" />,
      color: "blue",
      details: ["Real-time search", "Category filters", "Location-based results"]
    },
    {
      id: 2,
      title: "Choose Your Provider",
      description: "Compare providers based on their ratings, reviews, portfolios, and hourly rates to find your perfect match.",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      details: ["Verified reviews", "Detailed portfolios", "Transparent pricing"]
    },
    {
      id: 3,
      title: "Book Instantly",
      description: "Select a date and time that works for you. Chat with the provider to discuss specific details before they arrive.",
      icon: <Clock className="w-8 h-8" />,
      color: "purple",
      details: ["Flexible scheduling", "Direct messaging", "Secure booking"]
    },
    {
      id: 4,
      title: "Get Quality Service",
      description: "The provider arrives and completes the job. Your payment is held securely until you're satisfied with the work.",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "green",
      details: ["SkillHub Guarantee", "Safe payments", "Quality assurance"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      <main>
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="container max-w-6xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                Simple. Secure. <br />
                <span className="text-blue-200">Efficient.</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover how SkillHub connects you with the best professional talent in your neighborhood in just a few clicks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-blue-50 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                  onClick={() => isAuthenticated ? navigate("/search") : setIsAuthPanelOpen(true)}
                >
                  Start Browsing
                </Button>
                <Button
                  size="lg"
                  className="border-2 hover:text-indigo-700 hover:bg-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                  onClick={() => isAuthenticated ? navigate("/profile") : setIsAuthPanelOpen(true)}
                >
                  Join as Provider
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20" />
        </section>


        {/* Steps Section */}
        <section className="py-20 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Your Journey on SkillHub</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to get things done, designed with your convenience in mind.
              </p>
            </div>

            <div className="grid gap-20">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}
                >
                  <div className="flex-1 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-${step.color}-500 flex items-center justify-center text-white shadow-lg shadow-${step.color}-500/20 mb-8`}>
                      {step.icon}
                    </div>
                    <div className="space-y-4">
                      <span className={`text-sm font-bold uppercase tracking-widest text-${step.color}-600`}>Step 0{step.id}</span>
                      <h3 className="text-3xl font-bold leading-tight">{step.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                          <div className={`w-6 h-6 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30 flex items-center justify-center`}>
                            <CheckCircle className={`w-4 h-4 text-${step.color}-600`} />
                          </div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full">
                    <div className={`relative aspect-square md:aspect-video lg:aspect-square rounded-3xl bg-linear-to-br from-${step.color}-100 to-${step.color}-50 dark:from-${step.color}-950/20 dark:to-transparent border-border border border-${step.color}-200/30 overflow-hidden shadow-2xl`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`p-8 rounded-full bg-white dark:bg-slate-900 shadow-2xl scale-125 text-${step.color}-600`}>
                          {step.icon}
                        </div>
                      </div>
                      {/* Decorative elements inside the image box */}
                      <div className={`absolute top-10 left-10 w-20 h-20 bg-${step.color}-500/10 rounded-full blur-xl`} />
                      <div className={`absolute bottom-10 right-10 w-32 h-32 bg-${step.color}-500/10 rounded-full blur-xl`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why we are different</h2>
              <p className="text-lg text-muted-foreground">More than just a marketplace—it's a community built on trust.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Background Checked",
                  description: "Every provider goes through a rigorous identity and background verification process.",
                  icon: <Shield className="w-10 h-10 text-blue-500" />
                },
                {
                  title: "Smart Matching",
                  description: "Our algorithm suggests the best providers based on proximity, rating, and expertise.",
                  icon: <Zap className="w-10 h-10 text-yellow-500" />
                },
                {
                  title: "Direct Communication",
                  description: "End-to-end encrypted chat system to discuss requirements and get real-time updates.",
                  icon: <MessageCircle className="w-10 h-10 text-purple-500" />
                },
                {
                  title: "SkillHub Guarantee",
                  description: "If you're not satisfied with the service, we'll make it right with our money-back guarantee.",
                  icon: <Award className="w-10 h-10 text-green-500" />
                },
                {
                  title: "24/7 Support",
                  description: "Our dedicated support team is always available to help you with any queries or disputes.",
                  icon: <Clock className="w-10 h-10 text-red-500" />
                },
                {
                  title: "Skill Portfolio",
                  description: "View real work samples and case studies before hiring any professional.",
                  icon: <Star className="w-10 h-10 text-indigo-500" />
                }
              ].map((feature, i) => (
                <Card key={i} className="p-8 border-2 border-transparent hover:border-blue-500/20 transition-all duration-300 hover:shadow-xl group">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container max-w-5xl mx-auto">
            <Card className="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 text-white p-12 md:p-20 rounded-[40px] text-center shadow-2xl border-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to get started?</h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of satisfied customers and skilled professionals on India's most trusted skill-sharing platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-blue-50 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                    onClick={() => isAuthenticated ? navigate("/search") : setIsAuthPanelOpen(true)}
                  >
                    I want to hire
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <Button
                    size="lg"
                    className="border-2 hover:text-indigo-700 hover:bg-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                    onClick={() => isAuthenticated ? navigate("/profile") : setIsAuthPanelOpen(true)}
                  >
                    I want to provide
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}