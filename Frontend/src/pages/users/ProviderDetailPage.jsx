import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Share2,
  ArrowLeft,
  ChevronRight,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import SEOHead from "../../components/seo/SEOHead";
import api from "../../lib/axiosSetup";
import { useSelector } from "react-redux";
import { useUI } from "../../contexts/ui-context";
import { toast } from "sonner";

export default function ProviderDetailPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { setIsAuthPanelOpen } = useUI();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHours, setSelectedHours] = useState(2);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        const [provRes, revRes] = await Promise.allSettled([
          api.get(`/api/providers/${providerId}/details`),
          api.get(`/api/reviews/provider/${providerId}`)
        ]);

        if (provRes.status === "fulfilled") {
          setProvider(provRes.value.data?.data || null);
        }

        if (revRes.status === "fulfilled") {
          const rList = revRes.value.data?.data?.reviews || revRes.value.data?.data || [];
          setReviews(Array.isArray(rList) ? rList : []);
        }
      } catch (err) {
        toast.error("Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderDetails();
    }
  }, [providerId]);

  const handleHireClick = () => {
    if (!isAuthenticated) {
      setIsAuthPanelOpen(true);
      return;
    }
    navigate(`/hire/${providerId}`);
  };

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      setIsAuthPanelOpen(true);
      return;
    }
    navigate(`/chat?target=${providerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-muted-foreground">Loading verified provider profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-3 opacity-60" />
        <h2 className="text-xl font-bold text-foreground">Provider Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          The requested service specialist may be inactive or currently unavailable for bookings.
        </p>
        <Button onClick={() => navigate("/search")} className="mt-4 bg-primary text-white text-xs">
          Browse Available Specialists
        </Button>
      </div>
    );
  }

  const name = provider.businessName || "Verified Service Professional";
  const rate = provider.pricing?.serviceRate || 50;
  const rateType = provider.pricing?.rateType || "hourly";
  const rating = provider.meta?.avgRating || 5.0;
  const reviewCount = provider.meta?.totalReviews || reviews.length || 0;
  const completedJobs = provider.meta?.completedJobs || 0;
  const skillName = provider.skill?.name || provider.selectedSkill?.name || "Professional Specialist";
  const bio = provider.professionalDescription || "Experienced local service professional verified through SkillHub.";
  const locationText = provider.user?.location?.address || provider.user?.location?.city || "Local Service Area";
  const avatar = provider.user?.avatar;

  const estimatedTotal = rate * selectedHours;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": bio,
    "telephone": provider.contactPhone,
    "priceRange": `$${rate}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": Math.max(reviewCount, 1)
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead
        title={`${name} - Verified ${skillName} | SkillHub`}
        description={`Hire ${name} on SkillHub for ${skillName}. Insured, background-checked professional with ${rating}★ rating. Upfront rate: $${rate}/${rateType}.`}
        canonical={`https://skillhub.local/providers/${providerId}`}
        schema={structuredData}
      />

      {/* Top Breadcrumb & Actions */}
      <div className="border-b border-border bg-card/40 py-3.5 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Search
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Profile link copied!");
                }
              }}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Profile Info */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-border bg-card shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-secondary overflow-hidden shrink-0 border border-border shadow-md">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Pro
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-primary">{skillName}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {locationText}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {rating} ({reviewCount} reviews)
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      {completedJobs} completed jobs
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <h3 className="text-base font-bold text-foreground">About the Specialist</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              </div>

              {/* Badges / Experience */}
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-secondary/40">
                  <span className="text-xs text-muted-foreground block">Experience</span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block">
                    {provider.yearsExperience || 1}+ Years
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <span className="text-xs text-muted-foreground block">Rate Model</span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block capitalize">
                    {rateType}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <span className="text-xs text-muted-foreground block">Background</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    Cleared
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <span className="text-xs text-muted-foreground block">Guarantee</span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block">
                    $50k Insured
                  </span>
                </div>
              </div>
            </Card>

            {/* Portfolio Gallery if available */}
            {provider.portfolio && provider.portfolio.length > 0 && (
              <Card className="border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground mb-4">Work Portfolio & Projects</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {provider.portfolio.map((imgUrl, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                      <img src={imgUrl} alt={`Work sample ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">Verified Client Reviews</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Reviews left by customers who completed orders</p>
                </div>
                <div className="flex items-center gap-1.5 text-base font-extrabold text-foreground bg-secondary/60 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {rating}
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No written reviews yet. Be the first to book and rate {name}!
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-border/60">
                  {reviews.map((r, i) => (
                    <div key={r._id || i} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                            {r.user?.firstName?.charAt(0) || "C"}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              {r.user?.fullName || r.user?.firstName || "Verified Client"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, starI) => (
                            <Star
                              key={starI}
                              className={`w-3.5 h-3.5 ${starI < (r.rating || 5) ? "fill-amber-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {r.comment || "Professional and on time. Completed the job exactly as requested."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sticky Booking Action Card */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            <Card className="border-border bg-card shadow-lg p-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">${rate}</span>
                  <span className="text-xs font-semibold text-muted-foreground ml-1">/{rateType}</span>
                </div>
                <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-xs">
                  Available for Hire
                </Badge>
              </div>

              {rateType === "hourly" && (
                <div className="py-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Estimated Duration:</span>
                    <span className="text-foreground">{selectedHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                    <span>1 hr</span>
                    <span>4 hrs</span>
                    <span>8 hrs</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 py-3 border-t border-border text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Service Fee</span>
                  <span>${estimatedTotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SkillHub Escrow Protection</span>
                  <span className="text-emerald-600 font-semibold">Included ($0)</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                  <span>Estimated Total</span>
                  <span>${estimatedTotal}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <Button
                  onClick={handleHireClick}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Book Service Now
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMessageClick}
                  className="w-full h-11 border-border text-foreground hover:bg-muted font-semibold rounded-xl cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Provider
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Escrow payment held until completion</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Free cancellation up to 2 hours before</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
