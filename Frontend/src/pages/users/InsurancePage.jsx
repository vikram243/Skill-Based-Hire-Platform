import React from 'react';
import { 
  ShieldCheck, 
  Umbrella, 
  HardHat, 
  Building, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Info,
  FileText,
  BadgeCheck
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';


export default function InsurancePage() {
  const coverageItems = [
    {
      icon: <Building className="w-6 h-6" />,
      title: "Property Damage",
      limit: "₹1,00,000",
      desc: "Protection against accidental damage to your home or property during a service booking."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "General Liability",
      limit: "₹5,00,000",
      desc: "Broad protection for bodily injury or third-party property damage arising from covered services."
    },
    {
      icon: <HardHat className="w-6 h-6" />,
      title: "Provider Safety",
      limit: "Included",
      desc: "Specific protections designed to support our providers while they perform their skills."
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      <main className="py-24">
        <div className="container max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="mt-12 mb-20 relative overflow-hidden rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-900 p-12 md:p-20 text-white">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
               <Umbrella className="w-full h-full transform translate-x-1/4 -translate-y-1/4" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              >
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-bold tracking-wide uppercase">Comprehensive Protection</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight"
              >
                You're Covered <br/><span className="text-blue-300">Every Step.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-blue-100/80 leading-relaxed mb-10"
              >
                SkillHub partners with leading insurance providers to ensure that every job booked on our platform is backed by industry-standard protection policies.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 h-14 px-8 rounded-2xl font-bold">
                  View Policy Details
                </Button>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold">
                  Contact Insurance Team
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Coverage Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {coverageItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs font-black uppercase tracking-wider mb-4">
                    Up to {item.limit}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <h2 className="text-4xl font-black mb-8">How Insurance Works on SkillHub</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Automatic Coverage",
                    desc: "You don't need to sign up for anything. Every booking made and paid through SkillHub is automatically eligible for protection."
                  },
                  {
                    title: "Verified Pros",
                    desc: "Our insurance only covers work performed by providers who have passed our multi-step verification process."
                  },
                  {
                    title: "Easy Claims",
                    desc: "If an incident occurs, our dedicated claims team helps you through the process to ensure a fair resolution."
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">Policy Verification</h4>
                  <p className="text-sm text-muted-foreground">Certified Insurance Status</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-bold">Global Shield Assurance</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-muted-foreground">Policy Type</span>
                  <span className="font-bold">Master General Liability</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-muted-foreground">Effective Date</span>
                  <span className="font-bold">Jan 2026 - Jan 2027</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                </div>
              </div>
              
              <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold group">
                Download Certificate of Insurance
                <FileText className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* FAQ/Notice */}
          <Card className="p-8 md:p-12 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 rounded-[40px]">
            <div className="flex gap-6 flex-col md:flex-row">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Info className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Important Disclosure</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Coverage is subject to the terms, conditions, and exclusions of the master policy. For a claim to be eligible, the service must have been booked, scheduled, and paid for exclusively through the SkillHub platform. Off-platform transactions are not covered by SkillHub Insurance.
                </p>
                <button className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                  Read complete terms of insurance <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}