import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import SEOHead from "../../components/seo/SEOHead";
import api from "../../lib/axiosSetup";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/api/users/contact", formData);
      const ticket = res.data?.data?.ticketId || "TICK-847291";
      setSubmittedTicket(ticket);
      toast.success("Inquiry submitted! We'll reply shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SkillHub Support & Operations",
    "description": "Get in touch with SkillHub customer experience, safety desk, provider relations, and corporate headquarters.",
    "url": "https://skillhub.local/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "SkillHub",
      "telephone": "+1-800-SKILLHUB",
      "email": "support@skillhub.com"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="Contact Us & 24/7 Customer Support | SkillHub"
        description="Have a question about booking a service or becoming a provider? Reach out to SkillHub support. Average response time under 15 minutes."
        canonical="https://skillhub.local/contact"
        schema={structuredData}
      />

      {/* Hero Header */}
      <section className="border-b border-border bg-card/40 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            SkillHub Help & Concierge Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            We’re here to help you get things done.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have questions regarding an existing booking, need help finding a verified specialist, or want to partner as a business, our team is standing by.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & SLA Info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Direct Channels</CardTitle>
                <CardDescription>
                  Fast response times across all customer channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Email Concierge
                    </span>
                    <a href="mailto:support@skillhub.com" className="text-sm font-semibold hover:text-primary transition-colors">
                      support@skillhub.com
                    </a>
                    <p className="text-xs text-muted-foreground mt-0.5">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Emergency Hotline
                    </span>
                    <a href="tel:+18007545548" className="text-sm font-semibold hover:text-primary transition-colors">
                      +1 (800) 754-5548
                    </a>
                    <p className="text-xs text-muted-foreground mt-0.5">Toll-free 24/7 for active service disputes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Operating Hours
                    </span>
                    <p className="text-sm font-semibold text-foreground">Monday – Sunday</p>
                    <p className="text-xs text-muted-foreground mt-0.5">7:00 AM – 11:00 PM Local Time</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Headquarters
                    </span>
                    <p className="text-sm font-semibold text-foreground">100 Innovation Way, Suite 400</p>
                    <p className="text-xs text-muted-foreground mt-0.5">San Francisco, CA 94105</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Box */}
            <div className="p-5 rounded-2xl border border-border bg-secondary/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                SkillHub Guarantee Backed
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every booking made through SkillHub is insured up to $50,000 against accidental property damage and covers job satisfaction or full refund.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below. Our support coordinators will route your inquiry to the right department immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submittedTicket ? (
                  <div className="p-8 text-center space-y-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Message Received!</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Your ticket <span className="font-mono font-semibold text-foreground">{submittedTicket}</span> has been created. A dedicated representative will reach out via email shortly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmittedTicket(null)}
                      className="mt-2"
                    >
                      Submit Another Query
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Your Name *</label>
                        <Input
                          placeholder="e.g. Sarah Jenkins"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-11 bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="sarah@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11 bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Phone Number (Optional)</label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11 bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Topic</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full h-11 px-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Booking & Order Support">Booking & Order Support</option>
                          <option value="Provider Verification">Provider Verification</option>
                          <option value="Billing & Escrow">Billing & Escrow</option>
                          <option value="Safety & Trust Concern">Safety & Trust Concern</option>
                          <option value="Enterprise Partnership">Enterprise Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">How can we help? *</label>
                      <textarea
                        rows={5}
                        placeholder="Please describe your question or issue in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
                    >
                      {isSubmitting ? "Transmitting..." : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <Send className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
