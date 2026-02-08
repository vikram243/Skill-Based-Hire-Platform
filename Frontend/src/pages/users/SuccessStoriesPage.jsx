import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Star, Quote, PlayCircle, ArrowRight, TrendingUp, 
  Award, MapPin, CheckCircle2, Users, Briefcase, 
  Trophy, Heart, Calendar, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SuccessStoriesPage({
    setIsAuthPanelOpen
}) {
  const stats = [
    { label: "Providers", value: "50,000+", icon: <Users className="text-blue-500" /> },
    { label: "Jobs Completed", value: "1.2M+", icon: <Briefcase className="text-purple-500" /> },
    { label: "Provider Earnings", value: "₹450Cr+", icon: <TrendingUp className="text-emerald-500" /> },
    { label: "Avg. Rating", value: "4.8/5", icon: <Star className="text-yellow-500 fill-current" /> }
  ];

  const stories = [
    {
      name: "Rajesh Kumar",
      role: "Expert Electrician",
      earnings: "₹85,000+/mo",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecee?w=400&q=80",
      quote: "SkillHub changed my life. I went from looking for daily wage work to having a steady stream of high-paying customers every week. My family finally has financial security.",
      location: "Bangalore",
      tags: ["Home Repair", "Top Rated"]
    },
    {
      name: "Priya Sharma",
      role: "Professional Makeup Artist",
      earnings: "₹1,20,000+/mo",
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1594744803329-a584af1cae24?w=400&q=80",
      quote: "The booking system is so easy to use. I can manage my bridal bookings months in advance without any stress. The app handles everything so I can focus on my art.",
      location: "Delhi",
      tags: ["Beauty", "Luxury Services"]
    },
    {
      name: "Amit Patel",
      role: "Home Cleaning Specialist",
      earnings: "₹65,000+/mo",
      experience: "5 years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      quote: "The trust people have in SkillHub makes my job easier. I don't have to convince customers about my quality; my ratings do it for me. I've doubled my client list.",
      location: "Mumbai",
      tags: ["Sanitization", "5-Star"]
    }
  ];
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-background">

      <main>
        {/* Cinematic Hero */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80" 
              className="w-full h-full object-cover opacity-40"
              alt="Community"
            />
          </div>

          <div className="container max-w-6xl mx-auto px-6 relative z-20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold border border-blue-500/30 mb-8"
              >
                <Trophy className="w-4 h-4" />
                Celebrating 50,000+ Success Stories
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8"
              >
                Real People. <br />
                <span className="text-blue-500">Real Impact.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12"
              >
                Discover how everyday professionals are transforming their skills into successful independent businesses on SkillHub.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6"
              >
              </motion.div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute bottom-10 right-10 hidden xl:flex flex-col items-center bg-white p-6 rounded-3xl shadow-2xl text-slate-900 border-4 border-blue-600"
          >
            <Zap className="w-8 h-8 text-blue-600 mb-2 animate-bounce" />
            <span className="text-3xl font-black">₹0</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sign-up Fees</span>
          </motion.div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-4xl shadow-xl shadow-slate-200/50 dark:shadow-none text-center group hover:-translate-y-2 transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {React.cloneElement(stat.icon , { className: "w-7 h-7" })}
                  </div>
                  <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Detailed Story Grid */}
        <section className="py-24 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Meet the Professionals</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join a community of 50,000+ professionals who have found their calling on SkillHub.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full">All Categories</Button>
                <Button variant="outline" className="rounded-full bg-slate-900 text-white">Top Rated Only</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {stories.map((story, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all border-none bg-slate-50 dark:bg-slate-900/40 rounded-[40px]">
                    <div className="aspect-4/5 overflow-hidden relative">
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        {story.tags.map((tag, idx) => (
                          <span key={idx} className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white">
                        <div className="flex items-center gap-2 text-sm font-bold mb-1">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          {story.location}
                        </div>
                        <h3 className="text-2xl font-black">{story.name}</h3>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="space-y-1">
                          <p className="text-blue-600 font-black text-sm uppercase tracking-tighter">{story.role}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {story.experience} exp.
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600 leading-none">{story.earnings}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">MONTHLY REVENUE</p>
                        </div>
                      </div>
                      
                      <div className="relative pt-4">
                        <Quote className="w-10 h-10 text-slate-200 dark:text-slate-800 absolute -top-4 -left-4 opacity-50" />
                        <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed relative z-10 pl-6">
                          "{story.quote}"
                        </p>
                      </div>

                      <Button className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-900 hover:text-white transition-all group/btn font-bold">
                        Read Full Journey
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestone Tracker Section */}
        <section className="py-24 px-6 bg-blue-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="container max-w-5xl mx-auto relative z-10 text-white">
            <h2 className="text-4xl font-black text-center mb-16">The Journey to Platinum Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 -translate-y-1/2 hidden md:block" />
              
              <div className="grid md:grid-cols-4 gap-12 relative">
                {[
                  { icon: <Zap />, label: "Onboard", desc: "Pass verification and list your first service." },
                  { icon: <CheckCircle2 />, label: "First 10 Jobs", desc: "Build your reputation with high-quality work." },
                  { icon: <Award />, label: "Silver Tier", desc: "Unlock priority matching and better visibility." },
                  { icon: <Trophy />, label: "Platinum", desc: "The elite 1%. Unlimited growth potential." }
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6 relative z-20 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 transition-all duration-500">
                      {React.cloneElement(step.icon, { className: "w-8 h-8" })}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{step.label}</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-32 px-6">
          <div className="container max-w-4xl mx-auto">
            <Card className="p-12 md:p-20 rounded-[60px] bg-slate-900 text-white text-center overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12">
                  <Heart className="w-10 h-10 text-white fill-current" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to write your <br /> own success story?</h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                  Sign up today and start receiving high-intent leads in your local area. No hidden fees, no upfront costs.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => isAuthenticated?navigate('profile'):setIsAuthPanelOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 h-18 px-12 text-2xl font-black rounded-2xl shadow-2xl shadow-blue-500/20"
                  >
                    Get Started Now
                  </Button>
                </div>
              </motion.div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}