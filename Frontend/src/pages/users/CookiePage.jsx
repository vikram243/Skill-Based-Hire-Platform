import { useEffect } from "react";
import { Cookie, Settings, ShieldCheck, CheckCircle2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function CookiePage() {
  useEffect(() => {
    document.title = "Cookies | SkillHub";
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
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/20">
                <Cookie className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Cookie Policy
                </h1>
                <p className="text-muted-foreground mt-2">
                  Managing your digital experience
                </p>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
              <section>
                <h2 className="text-2xl font-bold">What are Cookies?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cookies are small text files stored on your device that help
                  us provide a seamless experience. They allow us to remember
                  your preferences, keep you logged in, and understand how you
                  interact with our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold">Types of Cookies We Use</h2>
                <div className="grid md:grid-cols-2 gap-8 not-prose mt-8">
                  <Card className="p-8 border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg mb-3">
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Required for the platform to function properly, such as
                      authentication and security features.
                    </p>
                  </Card>
                  <Card className="p-8 border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg mb-3">
                      Preference Cookies
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Allow us to remember your settings like language,
                      location, and dark mode preferences.
                    </p>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold">Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Most web browsers allow you to control cookies through their
                  settings. However, disabling certain cookies may limit your
                  ability to use some features of the SkillHub platform.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 not-prose">
                  <Button
                    variant="outline"
                    className="h-12 px-8 rounded-xl font-bold border-2"
                  >
                    Cookie Settings
                  </Button>
                  <Button className="h-12 px-8 rounded-xl font-bold bg-amber-600 hover:bg-amber-700">
                    Accept All Cookies
                  </Button>
                </div>
              </section>

              <section className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold mb-4">Questions?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  If you have any questions about our use of cookies, please
                  contact our support team.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
                    Transparent tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure
                    data storage
                  </li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
