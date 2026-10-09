import React, { useState } from "react";
import { Search, HelpCircle, ChevronDown, ShieldCheck, DollarSign, Clock, Users, ArrowRight } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "../../components/seo/SEOHead";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});
  const navigate = useNavigate();

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "booking", label: "Bookings & Hiring" },
    { id: "payments", label: "Payments & Escrow" },
    { id: "safety", label: "Trust & Safety" },
    { id: "providers", label: "For Service Providers" },
  ];

  const faqs = [
    {
      id: "b1",
      category: "booking",
      question: "How quickly can a service provider arrive at my location?",
      answer: "Most providers offer same-day and on-demand scheduling. In metropolitan regions, emergency providers can arrive in as little as 30 to 60 minutes. You can view the live ETA and distance before confirming your booking."
    },
    {
      id: "b2",
      category: "booking",
      question: "What happens if I need to reschedule or cancel my booking?",
      answer: "You can cancel or reschedule for free up to 2 hours before the appointment time directly from your Bookings dashboard. Cancellations made after a provider has already traveled may incur a nominal dispatch fee to compensate the provider for fuel and time."
    },
    {
      id: "p1",
      category: "payments",
      question: "How does payment protection and escrow work?",
      answer: "When you hire a provider, your payment is safely authorized into escrow. The funds are never released to the provider until the work is marked completed and you confirm your satisfaction."
    },
    {
      id: "p2",
      category: "payments",
      question: "Are there any hidden service or dispatch fees?",
      answer: "No. SkillHub guarantees transparent pricing. The rate you see—whether hourly or flat-rate per job—is the exact rate charged. Any additional materials required must be pre-approved by you in writing within the in-app chat."
    },
    {
      id: "s1",
      category: "safety",
      question: "How are SkillHub service providers verified?",
      answer: "Every provider passes identity verification via government photo ID, background screening check, professional trade certification review, and previous customer references. Only vetted professionals receive the verified checkmark."
    },
    {
      id: "s2",
      category: "safety",
      question: "What does the SkillHub Guarantee cover?",
      answer: "The SkillHub Guarantee covers every eligible service booking up to $50,000 for accidental property damage, alongside a 100% money-back guarantee if the job does not meet professional trade standards and cannot be resolved."
    },
    {
      id: "pr1",
      category: "providers",
      question: "How do I become a provider on SkillHub?",
      answer: "Click 'Join as Pro' or 'Become a Provider'. Complete your professional profile, select your skills, set your hourly rate, and submit your ID and certification documents. Our verification team reviews applications within 24 to 48 hours."
    },
    {
      id: "pr2",
      category: "providers",
      question: "When and how do service providers get paid?",
      answer: "Providers receive payouts directly to their linked bank accounts via automated direct deposit. Earnings become available immediately upon order completion and customer confirmation."
    }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | SkillHub"
        description="Find answers to common questions about booking local professionals, escrow payment security, background checks, cancellations, and provider onboarding."
        canonical="https://skillhub.local/faq"
        schema={structuredData}
      />

      {/* Header & Search */}
      <section className="border-b border-border bg-card/40 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base & Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            How can we help you today?
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Clear, transparent answers on booking, payments, insurance, and provider requirements.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <Input
              placeholder="Search by keywords (e.g. refund, insurance, booking, payout)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-4 rounded-2xl bg-card border border-border shadow-sm text-sm"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>

      {/* Categories & Questions */}
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === c.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center border border-border rounded-2xl bg-card">
              <p className="text-base font-semibold text-foreground">No questions found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for another term or reach out to our team directly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = Boolean(openItems[faq.id]);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-border bg-card shadow-xs transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span className="text-base tracking-tight">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions card */}
        <div className="mt-12 p-8 rounded-3xl border border-border bg-card text-center space-y-3 shadow-sm">
          <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Can’t find the answer you’re looking for? Reach out to our dedicated support concierge.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => navigate("/contact")}
              className="bg-primary text-white hover:bg-primary/90 rounded-xl h-10 px-5 text-xs font-semibold"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
