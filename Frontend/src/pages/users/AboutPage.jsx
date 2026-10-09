import React from "react";
import { ShieldCheck, Award, Users, Target, CheckCircle2, ArrowRight, HeartHandshake, Sparkles, Building, Globe } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "../../components/seo/SEOHead";

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: ShieldCheck,
      title: "Verified Trust & Safety",
      description: "Every professional undergoes multi-tier ID verification, skill evaluation, and background screening before being admitted to our network."
    },
    {
      icon: HeartHandshake,
      title: "Fair Work & Transparent Rates",
      description: "We empower skilled tradespeople and gig experts with direct earnings, transparent platform fees, and instant payouts without predatory middlemen."
    },
    {
      icon: Target,
      title: "Hyperlocal Precision",
      description: "Real-time geolocation routing matches homeowners and businesses with the nearest qualified providers to ensure rapid arrival and lower costs."
    },
    {
      icon: Award,
      title: "SkillHub Guarantee",
      description: "Every service booking is backed by escrow protection, dispute mediation, and $50,000 property damage insurance coverage."
    }
  ];

  const milestones = [
    { year: "2024", title: "Platform Conceived", text: "Founded to eliminate unreliable directory ads and replace them with a verified on-demand skilled workforce." },
    { year: "2025", title: "Real-Time Geo Match", text: "Engineered sub-minute provider discovery, live in-app coordination, and digital contract milestones." },
    { year: "2026", title: "Multi-City Expansion", text: "Operating across 50+ metropolitan service areas with thousands of active tradespeople, technicians, and educators." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SkillHub Technologies",
    "description": "Learn about SkillHub's mission to organize local skilled talent and provide homeowners with reliable on-demand services.",
    "url": "https://skillhub.local/about"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="About SkillHub | Reimagining Local Skilled Services & Gig Work"
        description="SkillHub connects homeowners and enterprises with vetted local service professionals. Learn about our verification standard, team, and mission."
        canonical="https://skillhub.local/about"
        schema={structuredData}
      />

      {/* Hero Header */}
      <section className="border-b border-border bg-card/40 py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Building the economic infrastructure for local skilled services.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Finding reliable, vetted help shouldn’t be a gamble. SkillHub combines transparent pricing, identity verification, and real-time hyperlocal dispatch to make booking skilled talent effortless.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/search")}
              className="bg-primary text-white hover:bg-primary/90 h-11 px-6 rounded-xl font-semibold shadow-sm"
            >
              Explore Providers
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/safety")}
              className="h-11 px-6 rounded-xl font-semibold"
            >
              Our Safety Standards
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            What Sets SkillHub Apart
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Engineered from first principles to ensure exceptional quality for clients and fair compensation for providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => (
            <Card key={idx} className="border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <v.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Verification Process Deep Dive */}
      <section className="border-y border-border bg-card/30 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-2">
                Uncompromising Quality
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                How We Vet Every Single Service Provider
              </h2>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Unlike unmoderated directories where anyone can post an ad, SkillHub operates a rigorous onboarding funnel. Less than 25% of applicant providers are approved to ensure unmatched quality.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  "Government ID & Criminal History Background Checks",
                  "Trade License & Certification Authenticity Verification",
                  "Direct Skills Interview & Historical Customer Portfolio Audit",
                  "Ongoing Customer Review Quality Scores & Instant Suspension on Violations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-border bg-card shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground">Vetting Standard</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active Tier 1</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Applicant Review Rate</span>
                  <span className="font-semibold text-foreground">100% Inspected</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Insurance Protection</span>
                  <span className="font-semibold text-foreground">Up to $50,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Dispute Resolution SLA</span>
                  <span className="font-semibold text-foreground">&lt; 24 Hours</span>
                </div>
              </div>
              <Button
                onClick={() => navigate("/safety")}
                className="w-full bg-secondary text-foreground hover:bg-muted font-semibold text-xs"
              >
                Read Comprehensive Safety Policy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Journey Milestones */}
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10 tracking-tight">
          Our Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-border bg-card">
              <span className="text-2xl font-black text-primary block mb-2">{m.year}</span>
              <h3 className="font-bold text-base text-foreground">{m.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 mt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-800 text-white text-center shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience dependable local service?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Book top-rated specialists in under 60 seconds with upfront rates and satisfaction guarantee.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/search")}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold h-11 px-6 rounded-xl shadow-md"
            >
              Browse Services
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/contact")}
              className="bg-transparent border-white/40 text-white hover:bg-white/10 font-bold h-11 px-6 rounded-xl"
            >
              Contact Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
