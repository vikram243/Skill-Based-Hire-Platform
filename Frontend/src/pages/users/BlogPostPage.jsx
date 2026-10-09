import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import SEOHead from "../../components/seo/SEOHead";
import { BLOG_POSTS } from "./BlogPage";

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-foreground">Article Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">The requested guide may have moved or been updated.</p>
        <Button onClick={() => navigate("/blog")} className="mt-4 bg-primary text-white">
          Back to Journal
        </Button>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.image],
    "datePublished": "2026-09-15T08:00:00+00:00",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkillHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skillhub.local/logo.png"
      }
    },
    "description": post.excerpt
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title={`${post.title} | SkillHub Guide`}
        description={post.excerpt}
        canonical={`https://skillhub.local/blog/${post.slug}`}
        ogImage={post.image}
        schema={structuredData}
      />

      <article className="container mx-auto max-w-3xl px-4 sm:px-6 py-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Resources
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-border py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{post.author}</p>
                <p className="text-[11px] text-muted-foreground">{post.date}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="text-xs text-muted-foreground"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="my-8 rounded-2xl overflow-hidden aspect-video bg-muted border border-border shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base space-y-4">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-bold text-foreground pt-4">
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("* ")) {
              const items = para.split("\n* ").map((it) => it.replace("* ", ""));
              return (
                <ul key={i} className="list-disc pl-5 space-y-1.5 text-foreground">
                  {items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        {/* Internal Link CTA to Related Service */}
        <div className="my-10 p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Need an insured {post.serviceTarget} right now?
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Connect with vetted local specialists on SkillHub with upfront pricing and escrow protection.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/search?q=${encodeURIComponent(post.serviceTarget)}`)}
            className="bg-primary text-white hover:bg-primary/90 text-xs font-semibold rounded-xl shrink-0"
          >
            Find {post.serviceTarget}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </article>
    </div>
  );
}
