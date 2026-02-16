import React, { useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  Heart,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  HardHat,
  FileBadge,
  Clock,
  Zap,
  MessageSquare,
  Handshake,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function SafetyPage({ setIsAuthPanelOpen }) {
  useEffect(() => {
    document.title = "Safety | SkillHub";
  }, []);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section with Animation */}
        <section className="relative py-24 overflow-hidden bg-linear-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-background dark:to-slate-900 border-b">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/4 w-full h-full dark:bg-blue-400/50 bg-blue-400/50 rounded-full blur-3xl z-10"
            />
          </div>

          <div className="container max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-2xl shadow-2xl mb-10 rotate-3"
            >
              <ShieldCheck className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
            >
              Built on <span className="text-blue-600">Trust</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              SkillHub implements industry-leading safety protocols to ensure
              every job is completed professionally and securely. Your peace of
              mind is our highest priority.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-blue-50 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                onClick={() =>
                  isAuthenticated
                    ? navigate("/profile")
                    : setIsAuthPanelOpen(true)
                }
              >
                Register as Provider
              </Button>
              <Button
                size="lg"
                className="border-2 hover:bg-indigo-500 dark:text-white text-black h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                onClick={() =>
                  isAuthenticated
                    ? navigate("/insurance")
                    : setIsAuthPanelOpen(true)
                }
              >
                Learn About Insurance
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-6xl mx-auto px-6 py-8"></div>

        {/* The Three Pillars Section */}
        <section className="py-24 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Core Safety Pillars
              </h2>
              <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-10"
            >
              <motion.div variants={itemVariants}>
                <Card className="p-10 h-full border-border/50 bg-slate-50 dark:bg-slate-900/40 hover:shadow-2xl transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Background Checks</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every service professional undergoes a multi-layer
                    verification process, including local background checks and
                    professional history validation.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Government ID Verification",
                      "Address Proof Validation",
                      "Reference Checks",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-10 h-full border-border/50 bg-slate-50 dark:bg-slate-900/40 hover:shadow-2xl transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Secure Transactions
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your money stays safe. SkillHub uses a secure escrow system
                    where funds are released only after the job is confirmed as
                    "Finished" by you.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "256-bit SSL Encryption",
                      "No Hidden Fees",
                      "Instant Refund Policy",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-10 h-full border-border/50 bg-slate-50 dark:bg-slate-900/40 hover:shadow-2xl transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-8 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                    <HardHat className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Quality Control</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We maintain high standards through continuous monitoring and
                    a robust rating system that keeps providers accountable for
                    every job.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Verified Reviews Only",
                      "Regular Skill Audits",
                      "Performance-based Ranking",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Protection Shield Section */}
        <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                    The SkillHub{" "}
                    <span className="text-blue-500">Insurance Shield</span>
                  </h2>
                  <p className="text-xl text-slate-400 leading-relaxed">
                    We've got your back. Every booking made through our platform
                    is automatically protected by our property damage and
                    liability insurance policy.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      icon: <FileBadge />,
                      title: "$1M Coverage",
                      desc: "Liability insurance for all active bookings.",
                    },
                    {
                      icon: <Clock />,
                      title: "24/7 Support",
                      desc: "Dedicated safety response team available.",
                    },
                    {
                      icon: <Zap />,
                      title: "Fast Claims",
                      desc: "Resolved within 7 business days.",
                    },
                    {
                      icon: <Handshake />,
                      title: "No Extra Cost",
                      desc: "Automatically included in every booking.",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        {React.cloneElement(feature.icon, {
                          className: "w-6 h-6",
                        })}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-slate-400 leading-snug">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="flex-1 w-full flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="relative w-full max-w-md aspect-square bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20 animate-pulse">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl animate-ping" />
                  <div className="relative z-10 w-64 h-80 bg-linear-to-b from-blue-500 to-blue-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-10 text-center border border-white/20">
                    <ShieldCheck className="w-32 h-32 text-white mb-6 drop-shadow-lg" />
                    <h3 className="text-2xl font-bold mb-2">FULLY INSURED</h3>
                    <p className="text-blue-100 text-sm">
                      Valid for all verified transactions in SkillHub.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Safety Tips Section */}
        <section className="py-24 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Stay Safe: Pro Tips</h2>
              <p className="text-muted-foreground">
                Follow these guidelines for the best possible experience.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Communicate within the app",
                  desc: "Keep all messages and agreements on SkillHub. This helps us mediate any issues and provides a secure record of the job details.",
                  icon: <MessageSquare />,
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  title: "Avoid cash payments",
                  desc: "Never pay a provider in cash or through external links. External payments are not protected by our Guarantee or Insurance.",
                  icon: <AlertTriangle />,
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  title: "Review work before closing",
                  desc: "Only mark the job as 'Completed' once you have thoroughly inspected the work. This ensures your satisfaction before payment release.",
                  icon: <Eye />,
                  color: "bg-green-100 text-green-600",
                },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                    <div
                      className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${tip.color}`}
                    >
                      {React.cloneElement(tip.icon, { className: "w-7 h-7" })}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{tip.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
          <div className="container max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-bold mb-8">
              <PhoneCall className="w-4 h-4" />
              Emergency Safety Support
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need immediate assistance?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Our safety response team is available 24/7 for any urgent concerns
              during an active job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-700 text-white hover:shadow-red-500/20 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
              >
                Call Incident Team
              </Button>
              <Button
                size="lg"
                className="border-2 hover:bg-red-700 dark:text-white text-black h-14 px-10 text-lg font-bold border-border rounded-2xl shadow-xl transition-all hover:scale-105"
              >
                Report a Concern
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
