import {useEffect} from "react";
import { Eye, Shield, Lock, Info, CheckCircle2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy | SkillHub";
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24">
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground mt-2">
                  Last Updated: February 6, 2026
                </p>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At SkillHub, we value your privacy and are committed to
                  protecting your personal data. This Privacy Policy explains
                  how we collect, use, and safeguard your information when you
                  visit our platform or use our services.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold">1. Data We Collect</h2>
                <div className="grid md:grid-cols-2 gap-6 not-prose">
                  <Card className="p-6 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                    <h4 className="font-bold mb-3">Identity Data</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> Full
                        name and title
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> Email
                        address and phone number
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />{" "}
                        Profile photograph
                      </li>
                    </ul>
                  </Card>
                  <Card className="p-6 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                    <h4 className="font-bold mb-3">Technical Data</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> IP
                        address and location
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />{" "}
                        Browser type and version
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> Usage
                        patterns and cookies
                      </li>
                    </ul>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use your data to provide, improve, and personalize our
                  services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Connecting customers with relevant service providers</li>
                  <li>Processing payments securely through our partners</li>
                  <li>
                    Maintaining community safety through identity verification
                  </li>
                  <li>Sending service-related notifications and updates</li>
                </ul>
              </section>

              <section className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  You have the right to access, correct, or delete your personal
                  data. You can also object to processing or request data
                  portability at any time.
                </p>
                <button
                  onClick={() => navigate("/help")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Contact Privacy Team
                </button>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
