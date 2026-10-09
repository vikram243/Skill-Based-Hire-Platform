import React from "react";
import { ShieldCheck, RefreshCw, AlertCircle, FileCheck, HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import SEOHead from "../../components/seo/SEOHead";

export default function RefundPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="Refund & Cancellation Policy | SkillHub"
        description="Learn about SkillHub's client refund policy, cancellation timelines, escrow dispute protection, and the $50,000 satisfaction guarantee."
        canonical="https://skillhub.local/refund-policy"
      />

      <section className="border-b border-border bg-card/40 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            SkillHub Escrow & Buyer Protection
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Clear, transparent guidelines designed to protect both clients and independent service providers.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 prose dark:prose-invert">
        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-foreground">
            <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 m-0 mb-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              100% Satisfaction or Money-Back Principle
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground m-0 leading-relaxed">
              Payments on SkillHub are held securely in escrow. Funds are never transferred to a service provider until you have inspected and accepted the completed work.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Client Cancellation Windows</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Free Cancellation (&gt; 2 Hours Ahead):</strong> Clients may cancel any scheduled booking at least two (2) hours prior to the confirmed service start time for an immediate 100% refund to the original payment method.
              </li>
              <li>
                <strong className="text-foreground">Late Cancellation (&lt; 2 Hours Ahead):</strong> Cancellations made within two hours of scheduled start may incur a dispatch travel fee of up to $25 to compensate the provider for fuel, transit, and lost booking opportunities.
              </li>
              <li>
                <strong className="text-foreground">Provider Arrival / No-Show:</strong> If a provider arrives on site and the client is unavailable for more than 20 minutes without notice, the minimum 1-hour service fee may be charged.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Provider Cancellations</h2>
            <p>
              In the rare event that a service provider must cancel a job due to emergency or equipment issues, you will immediately receive a 100% full refund with zero fees, or the option for automated priority rematch with an available alternative specialist.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Work Quality Disputes & Resolution</h2>
            <p>
              If a completed service does not meet trade standards or deviates substantially from the agreed scope:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>Do not confirm completion in the app.</li>
              <li>Click <em>Report an Issue</em> within 48 hours of work completion.</li>
              <li>Provide photo documentation and description of the defect.</li>
              <li>SkillHub Dispute Concierge will hold escrow funds and review the case within 24 hours. If valid, the provider is either required to re-perform the work at no extra charge or a full refund is issued.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Refund Processing Timelines</h2>
            <p>
              Approved refunds are credited to the original payment method (Credit Card, Debit, Apple Pay, Google Pay). Depending on your bank or card issuer, funds typically reflect in your account within 3 to 5 business days.
            </p>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Need help with an active order or refund request?</p>
              <p className="text-sm font-semibold text-foreground">Our concierge team is available 24/7.</p>
            </div>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-primary text-white hover:bg-primary/90 text-xs font-semibold rounded-xl"
            >
              Contact Dispute Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
