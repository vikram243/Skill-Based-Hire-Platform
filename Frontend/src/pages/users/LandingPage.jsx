import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import api from "../../lib/axiosSetup";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Star,
  Sparkles,
  Award,
  ChevronRight,
  Lock,
  DollarSign,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { Skills } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useUI } from "../../contexts/ui-context";
import SEOHead from "../../components/seo/SEOHead";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { setIsAuthPanelOpen } = useUI();
  const [heroSearch, setHeroSearch] = useState("");
  const [popularSkills, setPopularSkills] = useState(Skills);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: "1,200+",
    totalProviders: "350+",
    totalCompletedOrders: "2,400+",
    citiesCovered: "50+",
    avgRating: "4.9/5",
  });

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await api.get("/api/skills/getSkills/popular");
        const list = data.data || data || [];
        if (Array.isArray(list) && list.length > 0) {
          const formatted = list.map((s, idx) => ({
            id: s._id || s.id || idx,
            name: s.name || s.title,
            icon: s.icon || "⚡",
            description: s.description || "Verified local service specialist",
          }));
          setPopularSkills(formatted);
        }
      } catch (err) {
        // use fallback Skills
      }
    };

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/users/stats");
        const s = data.data || {};
        setPlatformStats({
          totalUsers: `${(s.totalUsers || 250).toLocaleString()}+`,
          totalProviders: `${(s.totalProviders || 45).toLocaleString()}+`,
          totalCompletedOrders: `${(s.totalCompletedOrders || 850).toLocaleString()}+`,
          citiesCovered: `${s.citiesCovered || 50}+`,
          avgRating: `${s.avgRating || 4.9}/5`,
        });
      } catch (err) {
        // keep fallback
      }
    };

    fetchPopular();
    fetchStats();
  }, []);

  const handleHeroSearch = (e) => {
    e?.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SkillHub",
    "url": "https://skillhub.local",
    "description": "On-demand marketplace connecting clients with verified local skilled professionals.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://skillhub.local/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const quickPills = ["Electrician", "Plumber", "House Cleaning", "Carpenter", "Tutor", "Personal Trainer"];

  const comparisonRows = [
    {
      feature: "Identity & Criminal Background Vetting",
      skillhub: "100% Verified with photo ID & reference audit",
      others: "Unverified / Self-reported"
    },
    {
      feature: "Payment Protection & Escrow",
      skillhub: "Funds held safely in escrow until you approve",
      others: "Cash on hand with no buyer recourse"
    },
    {
      feature: "Property Damage Insurance Guarantee",
      skillhub: "Backed by $50,000 SkillHub Guarantee",
      others: "Zero coverage or mediator support"
    },
    {
      feature: "Real-Time Local Matching",
      skillhub: "Sub-minute dispatch based on real coordinates",
      others: "Waiting days for unverified callbacks"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="SkillHub | Hire Verified Local Skilled Professionals In Minutes"
        description="Connect with background-checked local specialists for electrical, plumbing, carpentry, cleaning, and wellness. Transparent rates, escrow protection, and satisfaction guaranteed."
        canonical="https://skillhub.local/"
        schema={structuredData}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 border-b border-border bg-linear-to-b from-card/60 via-background to-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Verified On-Demand Skilled Talent Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.12]"
            >
              Hire top-rated skilled pros in your neighborhood.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              From emergency repairs to recurring services, connect with verified electricians, plumbers, carpenters, and tutors with upfront rates and escrow protection.
            </motion.p>

            {/* Interactive Search Box */}
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleHeroSearch}
              className="pt-4 max-w-2xl mx-auto"
            >
              <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border-2 border-border bg-card shadow-xl hover:border-primary/50 transition-all flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2.5 flex-1 w-full px-3">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Input
                    type="text"
                    placeholder="What service do you need? (e.g. plumber, electrician)..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="border-0 shadow-none text-sm sm:text-base bg-transparent focus-visible:ring-0 p-0 h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl sm:rounded-2xl shadow-md shrink-0 cursor-pointer text-sm"
                >
                  Find Specialists
                </Button>
              </div>

              {/* Fast Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-muted-foreground font-medium">Popular:</span>
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(pill)}`)}
                    className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground text-xs font-medium border border-border/50 transition-colors cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS BAR ─── */}
      <section className="border-b border-border bg-card/40 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-border/60">
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-foreground">{platformStats.totalProviders}</span>
              <p className="text-xs text-muted-foreground font-medium">Vetted Providers</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-foreground">{platformStats.totalCompletedOrders}</span>
              <p className="text-xs text-muted-foreground font-medium">Completed Bookings</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-foreground">{platformStats.citiesCovered}</span>
              <p className="text-xs text-muted-foreground font-medium">Service Cities</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-500" />
                {platformStats.avgRating}
              </span>
              <p className="text-xs text-muted-foreground font-medium">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="py-20 px-4 sm:px-6 container mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block">Seamless Experience</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How SkillHub Works
          </h2>
          <p className="text-sm text-muted-foreground">
            Get your job done in three clear, transparent steps backed by escrow protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Discover Nearby Specialists",
              text: "Search by trade or task. Inspect transparent hourly rates, verified licenses, photo portfolios, and authentic client reviews."
            },
            {
              step: "02",
              title: "Book with Escrow Protection",
              text: "Choose your preferred time slot. Your payment is held safely in escrow—funds are only released when you approve the job."
            },
            {
              step: "03",
              title: "Inspect & Confirm Completion",
              text: "The provider arrives and completes the work. Inspect the finished job, approve the milestone, and rate your experience."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <span className="text-5xl font-black text-muted/30 absolute top-4 right-6 pointer-events-none">
                {item.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POPULAR SERVICES GRID ─── */}
      <section className="py-16 border-t border-border bg-card/30 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Marketplace Directory</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Explore Popular Categories
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/services")}
              className="text-xs font-bold rounded-xl self-start sm:self-auto"
            >
              View Full Directory
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSkills.slice(0, 8).map((skill) => (
              <Card
                key={skill.id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(skill.name)}`)}
                className="border-border bg-card shadow-xs hover:shadow-lg hover:border-primary/50 transition-all p-5 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Browse Providers</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON: SKILLHUB VS CLASSIFIEDS ─── */}
      <section className="py-20 px-4 sm:px-6 container mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Why Homeowners Choose SkillHub
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A comparison against traditional unmoderated ad directories and contractor lead brokers.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-secondary/50 p-4 font-bold text-xs sm:text-sm border-b border-border">
            <div className="col-span-5 text-foreground">Standard & Protection</div>
            <div className="col-span-4 text-primary font-extrabold">SkillHub Platform</div>
            <div className="col-span-3 text-muted-foreground">Classified Ads</div>
          </div>
          <div className="divide-y divide-border/60 text-xs sm:text-sm">
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 p-4 items-center gap-2">
                <div className="col-span-5 font-semibold text-foreground">{row.feature}</div>
                <div className="col-span-4 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {row.skillhub}
                </div>
                <div className="col-span-3 text-muted-foreground">{row.others}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROVIDER ONBOARDING BANNER ─── */}
      {!user?.isProvider && (
        <section className="py-16 px-4 sm:px-6 container mx-auto max-w-5xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-br from-blue-600 via-indigo-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200 block">
                Independent Pro Growth
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Are you a skilled service provider?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Connect directly with paying local clients. Set your own schedule, control your rates, and get paid with automatic escrow releases.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Button
                onClick={() => (isAuthenticated ? navigate("/profile") : setIsAuthPanelOpen(true))}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold h-12 px-6 rounded-xl shadow-md text-sm"
              >
                Apply as Provider
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/success-stories")}
                className="border-white/30 text-white hover:bg-white/10 font-bold h-12 px-6 rounded-xl text-sm"
              >
                Read Stories
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}