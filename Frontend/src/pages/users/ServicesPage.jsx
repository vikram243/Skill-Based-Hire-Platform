import React, { useState, useEffect } from "react";
import { Search, ArrowRight, ShieldCheck, Clock, CheckCircle2, Star, Sparkles, Filter, Wrench, Home, Briefcase, GraduationCap, Dumbbell } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEOHead from "../../components/seo/SEOHead";
import api from "../../lib/axiosSetup";

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const serviceCategories = [
    { id: "all", label: "All Categories", icon: Sparkles },
    { id: "home", label: "Home & Repairs", icon: Home },
    { id: "wellness", label: "Health & Fitness", icon: Dumbbell },
    { id: "education", label: "Tutoring & Lessons", icon: GraduationCap },
    { id: "tech", label: "Tech & Professional", icon: Briefcase },
  ];

  const enrichedServices = [
    {
      id: "electrician",
      name: "Electrician",
      category: "home",
      icon: "⚡",
      avgRate: "$45–$85/hr",
      description: "Certified residential and commercial electrical wiring, breaker panel upgrades, lighting, and outlet repairs.",
      features: ["License verified", "Same-day emergency response", "Safety compliance checked"],
      demand: "High Demand"
    },
    {
      id: "plumber",
      name: "Plumber",
      category: "home",
      icon: "🔧",
      avgRate: "$50–$95/hr",
      description: "Leak detection, pipe repairs, faucet installation, water heater diagnostics, and drain clearing.",
      features: ["Emergency dispatch", "Insured workmanship", "Transparent parts billing"],
      demand: "High Demand"
    },
    {
      id: "carpenter",
      name: "Carpenter",
      category: "home",
      icon: "🔨",
      avgRate: "$40–$75/hr",
      description: "Custom cabinetry, door hanging, deck framing, dry rot remediation, and architectural wood trim.",
      features: ["Custom blueprint builds", "Fine finish work", "Material guidance"],
      demand: "Popular"
    },
    {
      id: "cleaner",
      name: "House Cleaning",
      category: "home",
      icon: "🧹",
      avgRate: "$30–$55/hr",
      description: "Deep home cleaning, move-out sanitization, recurring maintenance, and eco-friendly supplies.",
      features: ["Supplies included", "Background checked", "Checklist satisfaction"],
      demand: "High Demand"
    },
    {
      id: "trainer",
      name: "Personal Trainer",
      category: "wellness",
      icon: "💪",
      avgRate: "$40–$70/hr",
      description: "Custom strength programming, weight management, mobility coaching, and nutrition accountability.",
      features: ["Tailored programs", "In-home or gym sessions", "Injury-safe protocols"],
      demand: "Trending"
    },
    {
      id: "therapist",
      name: "Massage Therapist",
      category: "wellness",
      icon: "💆",
      avgRate: "$65–$110/hr",
      description: "Licensed deep tissue, Swedish, sports recovery, and restorative massage therapy at your door.",
      features: ["Table & oils provided", "Certified massage therapists", "Relaxation guarantee"],
      demand: "Popular"
    },
    {
      id: "tutor",
      name: "Academic Tutor",
      category: "education",
      icon: "📚",
      avgRate: "$35–$65/hr",
      description: "K-12 and collegiate mathematics, sciences, language arts, coding, and SAT/ACT test prep.",
      features: ["Curriculum aligned", "Diagnostic assessment", "Flexible pacing"],
      demand: "High Demand"
    },
    {
      id: "petsitter",
      name: "Pet Sitter & Walker",
      category: "wellness",
      icon: "🐕",
      avgRate: "$25–$45/visit",
      description: "Reliable dog walking, cat feeding, medication administration, and overnight pet companionship.",
      features: ["GPS walk tracking", "Photo updates", "Pet First-Aid certified"],
      demand: "Popular"
    },
    {
      id: "it-support",
      name: "Tech & IT Specialist",
      category: "tech",
      icon: "💻",
      avgRate: "$45–$80/hr",
      description: "Wi-Fi network optimization, virus removal, computer setup, printer diagnostics, and smart home setup.",
      features: ["On-site or remote", "Hardware upgrades", "Data privacy assured"],
      demand: "Growing"
    }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get("/api/skills/getAllSkills");
        const list = data.data || data || [];
        if (Array.isArray(list) && list.length > 0) {
          setSkillsList(list);
        }
      } catch (err) {
        // Fallback to enrichedServices
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filteredServices = enrichedServices.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.category === selectedCategory;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "SkillHub Verified Service Categories",
    "description": "Directory of on-demand home, wellness, educational, and technical service providers.",
    "itemListElement": enrichedServices.map((s, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": s.name,
      "description": s.description
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="Local Services Directory & Verified Trades | SkillHub"
        description="Browse all verified on-demand services on SkillHub. Electricians, plumbers, house cleaners, carpenters, tutors, and wellness specialists with upfront rates."
        canonical="https://skillhub.local/services"
        schema={structuredData}
      />

      {/* Hero */}
      <section className="border-b border-border bg-card/40 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Skill Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Skilled Local Professionals
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a service to view vetted providers in your neighborhood, compare hourly pricing, inspect reviews, and book instantly.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {serviceCategories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="border-border bg-card shadow-xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full block">
                      {service.demand}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground mt-1 block">
                      {service.avgRate}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Insured & Vetted
                </span>
                <Button
                  size="sm"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(service.name)}`)}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Find {service.name}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 mt-12">
        <div className="p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Need a custom trade or commercial quote?
            </h3>
            <p className="text-xs text-muted-foreground max-w-lg">
              Our team can dispatch specialized crews for complex multi-day construction, commercial HVAC, and enterprise renovations.
            </p>
          </div>
          <Button
            onClick={() => navigate("/contact")}
            className="bg-secondary text-foreground hover:bg-muted font-semibold text-xs px-5 h-10 rounded-xl shrink-0"
          >
            Request Custom Quote
          </Button>
        </div>
      </section>
    </div>
  );
}
