import { useEffect } from "react";
import {
  Accessibility,
  Eye,
  Smartphone,
  Keyboard,
  CheckCircle2,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";

export default function AccessibilityPage() {
  useEffect(() => {
    document.title = "Accessibility | SkillHub";
  }, []);

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
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <Accessibility className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Accessibility
                </h1>
                <p className="text-muted-foreground mt-2">
                  SkillHub is for everyone
                </p>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
              <section>
                <h2 className="text-2xl font-bold">Our Commitment</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe that professional skills should be accessible to
                  everyone. We are committed to ensuring our platform is usable
                  by people of all abilities, including those with visual,
                  auditory, motor, or cognitive impairments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold">
                  Key Accessibility Features
                </h2>
                <div className="grid md:grid-cols-3 gap-6 not-prose mt-8">
                  <Card className="p-6 border-slate-100 dark:border-slate-800 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold mb-2">High Contrast</h4>
                    <p className="text-xs text-muted-foreground">
                      Optimal text-to-background contrast ratios for better
                      readability.
                    </p>
                  </Card>
                  <Card className="p-6 border-slate-100 dark:border-slate-800 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                      <Keyboard className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold mb-2">Keyboard Navigation</h4>
                    <p className="text-xs text-muted-foreground">
                      Full support for navigating the site without a mouse.
                    </p>
                  </Card>
                  <Card className="p-6 border-slate-100 dark:border-slate-800 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold mb-2">Screen Readers</h4>
                    <p className="text-xs text-muted-foreground">
                      Semantic HTML structure for screen reader compatibility.
                    </p>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold">Standards Compliance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We aim to conform to the Web Content Accessibility Guidelines
                  (WCAG) 2.1 Level AA. This is an ongoing effort, and we
                  continuously audit our platform to identify and fix
                  accessibility barriers.
                </p>
              </section>

              <section className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                <h3 className="font-bold mb-4">Feedback</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  We welcome your feedback on the accessibility of SkillHub. If
                  you encounter any barriers, please let us know so we can
                  improve the experience.
                </p>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold">
                    accessibility@skillhub.com
                  </span>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
