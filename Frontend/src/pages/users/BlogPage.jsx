import React, { useState } from "react";
import { Calendar, Clock, ArrowRight, BookOpen, Tag, Sparkles, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "../../components/seo/SEOHead";

export const BLOG_POSTS = [
  {
    slug: "hiring-licensed-electrician-guide",
    title: "The Homeowner's Guide to Hiring a Licensed Electrician in 2026",
    excerpt: "Everything you need to check before letting an electrical technician touch your panel: licenses, insurance limits, and safety permits.",
    category: "Home Safety",
    readTime: "5 min read",
    date: "October 4, 2026",
    author: "Marcus Vance, Master Electrician",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    serviceTarget: "Electrician",
    content: `
When it comes to electrical work in your home, there is zero margin for error. A poor plumbing job causes a puddle; a poor electrical job can burn your house down or cause fatal electric shocks.

### 1. Always Verify General Liability & Worker's Comp
Before any work begins, request proof of insurance. A reputable electrician should carry at least $1,000,000 in general liability insurance. On SkillHub, every active electrician's certificate of insurance is digitally verified and archived before they can accept bookings.

### 2. Upfront Hourly vs. Flat-Rate Pricing
Minor fixes like replacing an outlet or installing a GFCI breaker are typically charged hourly ($45 to $85/hr). Larger projects like a 200-amp main panel upgrade should always be quoted with a clear scope and equipment fee upfront.

### 3. Warning Signs You Need an Immediate Electrician
* Frequent breaker trips when running appliances
* Flickering or dimming lights during heavy loads
* Burning plastic smell or warm wall switch plates
* Lack of GFCI outlets near sinks and outdoor areas

Ready to find a certified technician? Browse vetted local electricians on SkillHub with verified credentials and satisfaction guarantees.
    `
  },
  {
    slug: "emergency-plumbing-what-to-do-before-pro-arrives",
    title: "Burst Pipe or Major Leak? What to Do in the First 10 Minutes",
    excerpt: "Don't panic. Follow these four crucial steps to shut off your water main, protect your floors, and minimize water damage while your plumber is en route.",
    category: "Emergency Guides",
    readTime: "4 min read",
    date: "September 28, 2026",
    author: "Elena Rostova, Emergency Coordinator",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    serviceTarget: "Plumber",
    content: `
Water damage compounds by the second. If you hear rushing water or spot water pooling from a ceiling, take immediate action before your SkillHub emergency plumber arrives.

### Step 1: Shut Off the Main Water Valve
Every adult in your household should know the exact location of the main water shutoff valve. In single-family homes, it is usually located in the basement, garage, or near the street meter. Turn the valve clockwise to stop the water supply completely.

### Step 2: Open Cold Water Faucets to Relieve Pressure
Once the main valve is shut, open an outdoor hose bib or the lowest faucet in the house to drain remaining water out of the lines rather than through the leak.

### Step 3: Turn Off Power to Affected Areas
If water is leaking near electrical outlets, baseboard heaters, or appliances, immediately shut off the corresponding circuits at your main electrical breaker. Never walk through standing water near energized outlets.

### Step 4: Dispatch an Insured Plumber via SkillHub
Through SkillHub's hyperlocal dispatch, nearby plumbers can be at your door within 45 minutes to diagnose, seal, and repair the pipe with transparent emergency rates.
    `
  },
  {
    slug: "how-to-scale-freelance-trade-business",
    title: "How Independent Tradespeople Are Scaling Their Business on SkillHub",
    excerpt: "Learn how independent contractors and freelancers are booking full schedules, automating invoicing, and keeping 90%+ of their earnings.",
    category: "Provider Insights",
    readTime: "6 min read",
    date: "September 15, 2026",
    author: "David Chen, Operations Director",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    serviceTarget: "Become a Provider",
    content: `
For decades, independent service providers have wasted thousands of dollars per month on lead-generation sites that sell the same lead to six competitors.

SkillHub was built to solve this problem:
1. **Direct Dispatch:** Customers book you directly based on your proximity, skills, and rating.
2. **Escrow Guarantee:** You never have to chase clients for unpaid invoices. Payment is pre-authorized before you pick up your tools.
3. **Instant Mobile Invoicing:** Add approved materials or adjustments directly in the app.
4. **Flexible Availability:** Toggle between online and offline with a single tap.

If you are a licensed technician, carpenter, or trainer, sign up today to access thousands of local clients.
    `
  }
];

export default function BlogPage() {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SkillHub Resources & Home Improvement Blog",
    "description": "Expert advice, safety checklists, and trade guides for homeowners and skilled service providers.",
    "url": "https://skillhub.local/blog"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title="Resources, Home Guides & Trade Insights | SkillHub Blog"
        description="Read expert home maintenance tips, safety guides, pricing benchmarks, and contractor advice from vetted professionals on SkillHub."
        canonical="https://skillhub.local/blog"
        schema={structuredData}
      />

      <section className="border-b border-border bg-card/40 py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            SkillHub Knowledge & Industry Insights
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            The Skilled Service Journal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical advice from licensed contractors, master plumbers, electricians, and independent pros to help you hire smart and care for your home.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Card
              key={post.slug}
              className="border-border bg-card shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-foreground text-[11px] font-bold px-2.5 py-1 rounded-full border border-border shadow-xs">
                    {post.category}
                  </span>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-border/40 mt-4 pt-4">
                <span className="text-xs text-muted-foreground font-medium">
                  By {post.author.split(",")[0]}
                </span>
                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
