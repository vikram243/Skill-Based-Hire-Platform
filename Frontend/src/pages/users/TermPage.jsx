import React from 'react';
import { Scale, FileText, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24">
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
                <p className="text-muted-foreground mt-2">Effective Date: February 6, 2026</p>
              </div>
            </div>

            <Card className="p-8 mb-12 border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/10">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
                <p className="text-orange-800 dark:text-orange-300 font-medium">
                  Please read these Terms of Service carefully before using SkillHub. By accessing our platform, you agree to be bound by these terms and all applicable laws.
                </p>
              </div>
            </Card>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  1. Service Overview
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SkillHub is a platform that facilitates connections between independent service providers and customers. SkillHub is not an employer of providers and does not provide the services directly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold">2. User Responsibilities</h2>
                <div className="space-y-4 mt-6">
                  {[
                    "You must be at least 18 years old to create an account.",
                    "You are responsible for maintaining the security of your account credentials.",
                    "All information provided must be accurate and truthful.",
                    "You agree not to bypass the platform for payments."
                  ].map((rule, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-muted-foreground font-medium">{rule}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold">3. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Customers agree to pay for services booked through SkillHub using the designated payment methods. Providers agree to a service fee deduction as specified in the provider agreement. All payments are held in escrow until service completion is confirmed.
                </p>
              </section>

              <section className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                  Liability & Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  SkillHub reserves the right to suspend or terminate accounts that violate these terms. We are not liable for the quality of work performed by independent providers, beyond our SkillHub Guarantee policy.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}