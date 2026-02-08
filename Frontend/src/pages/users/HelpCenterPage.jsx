import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MessageSquare,
  Shield,
  CreditCard,
  User,
  HelpCircle,
  Mail,
  Phone,
  LifeBuoy,
  BookOpen,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const FAQ_DATA = [
  {
    question: "How do I book a service?",
    answer:
      "Simply search for the skill you need, select a professional provider, choose your preferred time slot, and confirm your booking with a secure payment.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel any booking up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to a small processing fee.",
  },
  {
    question: "How are providers verified?",
    answer:
      "Every provider on SkillHub undergoes a multi-step verification process, including identity checks, professional certifications, and a review of their past work history.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Yes, all payments are processed through our secure encryption system. We hold funds in escrow until the service is completed to your satisfaction.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "If you're not happy with the service, please contact our support team within 48 hours of completion, and we'll work with you to resolve the issue, which may include a refund or rebooking.",
  },
];

const QUICK_LINKS = [
  { label: "Safety Center", path: "/safety" },
  { label: "Legal terms", path: "/terms" },
  { label: "Insurance Policy", path: "/insurance" },
];

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleLinkClick = (path) => {
    navigate(path);
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A]">
      <main>
        {/* Simplified Hero Section */}
        <section className="relative bg-linear-to-br from-[#3B82F6] to-[#1E40AF] py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-coral-400 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
            >
              How can we help you?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl mx-auto"
            ></motion.div>
          </div>
        </section>

        <div className="container max-w-5xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* FAQ Accordion */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {FAQ_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <button
                      onClick={() => toggleAccordion(i)}
                      className="w-full flex items-center justify-between p-6 text-left font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <span className="text-lg">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-slate-50 dark:border-slate-800/50">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support Sidebar */}
            <div className="space-y-6">
              <Card className="p-8 bg-slate-900 text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <MessageSquare className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">
                  Still need help?
                </h3>
                <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed">
                  Can't find what you're looking for? Our support team is
                  available 24/7 to assist you.
                </p>
                <div className="space-y-4 relative z-10">
                  <Button className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold h-12 rounded-xl">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10 text-white font-bold h-12 rounded-xl"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </Button>
                </div>
              </Card>

              <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-bold text-sm uppercase tracking-widest text-blue-600 mb-4">
                  Quick Links
                </h4>
                <div className="space-y-9">
                  {QUICK_LINKS.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => handleLinkClick(link.path)}
                      className="flex items-center justify-between w-full text-sm font-semibold hover:text-blue-600 transition-colors group"
                    >
                      {link.label}
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
