import { useEffect } from "react";

/**
 * Reusable SEO Head component that sets document title, meta description,
 * OpenGraph, Twitter tags, canonical URL, and structured JSON-LD schema.
 */
export default function SEOHead({
  title = "SkillHub | Local Skill-Based Hire Platform & Expert On-Demand Services",
  description = "Connect with verified local professionals for plumbing, electrical, carpentry, tutoring, personal care, and home improvement. Instant booking with transparent pricing and guarantee.",
  canonical,
  ogType = "website",
  ogImage = "https://skillhub.local/og-image.png",
  schema
}) {
  useEffect(() => {
    // 1. Set title
    document.title = title.includes("SkillHub") ? title : `${title} | SkillHub`;

    // Helper to update or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        if (selector.startsWith('meta[name="')) {
          element.setAttribute("name", selector.match(/meta\[name="([^"]+)"\]/)[1]);
        } else if (selector.startsWith('meta[property="')) {
          element.setAttribute("property", selector.match(/meta\[property="([^"]+)"\]/)[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Meta Description
    setMetaTag('meta[name="description"]', "content", description);

    // OpenGraph
    setMetaTag('meta[property="og:title"]', "content", title);
    setMetaTag('meta[property="og:description"]', "content", description);
    setMetaTag('meta[property="og:type"]', "content", ogType);
    setMetaTag('meta[property="og:image"]', "content", ogImage);
    setMetaTag('meta[property="og:site_name"]', "content", "SkillHub");
    const currentUrl = canonical || window.location.href;
    setMetaTag('meta[property="og:url"]', "content", currentUrl);

    // Twitter
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "content", title);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:image"]', "content", ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // Structured JSON-LD Data
    let schemaScript = document.getElementById("skillhub-schema-jsonld");
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "skillhub-schema-jsonld";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonical, ogType, ogImage, schema]);

  return null;
}
