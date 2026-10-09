import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axiosSetup";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Phone,
  Mail,
  Heart,
  Share2,
  Loader2,
  ExternalLink,
  Briefcase,
} from "lucide-react";

const MotionButton = motion.create(Button);
const MotionCard = motion.create(Card);
const MotionP = motion.p;

const ProviderAvatar = memo(function ProviderAvatar({ src, name }) {
  const initial = (name || "?").trim().charAt(0) || "?";

  return (
    <Avatar className="h-20 w-20 ring-4 ring-(--primary-gradient-start)/20">
      <AvatarImage src={src} alt={name || "Provider"} />
      <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white text-xl">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
});

export default function SkillDetailPage({ provider, providerId, onClose }) {
  const params = useParams();
  const effectiveProviderId =
    providerId || provider?.id || provider?._id || params?.providerId;

  const [isFavorited, setIsFavorited] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [providerData, setProviderData] = useState(provider || null);
  const [loadingDetails, setLoadingDetails] = useState(!provider);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  const navigate = useNavigate();

  // Fetch full provider details (portfolio, experience, certifications, etc.)
  useEffect(() => {
    if (!effectiveProviderId) return;

    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/api/providers/${effectiveProviderId}/details`);
        if (isMounted && res.data?.data) {
          setProviderData((prev) => ({
            ...(prev || {}),
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch full provider details:", err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [effectiveProviderId]);

  // Fetch real reviews from backend
  useEffect(() => {
    if (!effectiveProviderId) return;

    let isMounted = true;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await api.get(`/api/reviews/provider/${effectiveProviderId}`);
        if (isMounted && res.data?.data) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch provider reviews:", err);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [effectiveProviderId]);

  useEffect(() => {
    if (providerData?.name) {
      document.title = `${providerData.name} | SkillHub`;
    }
  }, [providerData?.name]);

  const providerName = providerData?.name || providerData?.businessName || "Service Provider";
  const providerAvatarSrc = providerData?.avatar || "";

  const sectionVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14, scale: 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }),
    [],
  );

  const listVariants = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: 0.06 } },
    }),
    [],
  );

  const listItem = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0 },
    }),
    [],
  );

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/search/${effectiveProviderId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: providerName,
          text: `Hire "${providerName}" on SkillHub.`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  }, [effectiveProviderId, providerName]);

  const portfolioImages = useMemo(() => {
    if (!providerData) return [];
    const list = providerData.portfolio || providerData.galleryImages || [];
    return Array.isArray(list) ? list : [];
  }, [providerData]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // Loading state
  if (loadingDetails && !providerData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!providerData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center max-w-md mx-auto">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-1">Provider Not Found</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              The provider you are looking for might have changed their profile or is no longer available.
            </p>
            <Button onClick={handleBack} className="w-full">
              Back to Search
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const startingRate =
    providerData.hourlyRate ||
    providerData.price ||
    providerData.pricing?.serviceRate ||
    0;

  const rateUnit =
    providerData.rateType === "hourly"
      ? "hr"
      : providerData.rateType === "perday" || providerData.rateType === "daily"
        ? "day"
        : "job";

  const formattedDistance =
    providerData.distanceText ||
    (providerData.distanceKm ? `${providerData.distanceKm} km` : providerData.distance || "Nearby");

  const formattedEstimatedTime =
    providerData.estimatedTimeText ||
    (providerData.estimatedTimeMin
      ? `${providerData.estimatedTimeMin} mins`
      : providerData.estimatedTime || "Fast response");

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 transition-all duration-200 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Info Column */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-6"
          >
            {/* Provider Header Card */}
            <MotionCard className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <ProviderAvatar src={providerAvatarSrc} name={providerName} />

                <div className="flex items-center space-x-2">
                  <MotionButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`border-border/40 ${isFavorited ? "bg-accent/10 text-accent" : ""}`}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.div
                      animate={isFavorited ? { scale: 1.2 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 1000 }}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                      />
                    </motion.div>
                  </MotionButton>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-border/40 relative"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedShare && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded shadow">
                        Copied!
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold truncate max-w-54 md:max-w-100">
                      {providerName}
                    </h1>
                    {providerData.isVerified && (
                      <CheckCircle className="w-6 h-6 text-(--primary-gradient-start)" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="truncate max-w-54 md:max-w-80">
                        {providerData.location || "Location on request"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span>{providerData.responseTime || "< 1 hr"} response</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-base">
                        {providerData.rating ? Number(providerData.rating).toFixed(1) : "New"}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({providerData.reviewCount || reviews.length} reviews)
                      </span>
                    </div>
                    {providerData.isOnline && (
                      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                        Online Now
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Primary Category & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-(--primary-gradient-start)/10 border-(--primary-gradient-start)/30 text-(--primary-gradient-start) px-3 py-1 font-medium text-sm"
                  >
                    {providerData.skills?.name || "Professional"}
                  </Badge>
                  {providerData.certifications?.map((cert, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">About Provider</h3>
                <MotionP
                  layout
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`text-muted-foreground leading-relaxed text-sm ${expanded ? "" : "line-clamp-4"}`}
                >
                  {providerData.bio || "No description provided yet by this provider."}
                </MotionP>
                {(providerData.bio?.length || 0) > 180 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </MotionCard>

            {/* Dynamic Tabs: Reviews | Portfolio | Experience */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="reviews" className="rounded-lg font-medium">
                    Reviews ({reviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="rounded-lg font-medium">
                    Portfolio ({portfolioImages.length})
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="rounded-lg font-medium">
                    Experience
                  </TabsTrigger>
                </TabsList>

                {/* 1. DYNAMIC REVIEWS TAB */}
                <TabsContent value="reviews" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {loadingReviews ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                          <p className="text-sm text-muted-foreground">Loading verified reviews...</p>
                        </div>
                      ) : reviews.length > 0 ? (
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="show"
                          className="space-y-5"
                        >
                          {reviews.map((review) => {
                            const reviewerName =
                              review.user?.fullName ||
                              review.customer_name ||
                              "Verified Client";
                            const reviewerAvatar =
                              review.user?.avatar || review.customer_avatar;
                            const ratingNum = review.rating || 5;
                            const reviewDate = review.createdAt || review.created_at
                              ? new Date(review.createdAt || review.created_at).toLocaleDateString(
                                  "en-IN",
                                  { day: "numeric", month: "short", year: "numeric" },
                                )
                              : "Recently";
                            const serviceLabel =
                              review.order?.description ||
                              review.skill_name ||
                              providerData.skills?.name ||
                              "Service";

                            return (
                              <motion.div
                                key={review._id || review.id}
                                variants={listItem}
                                className="pb-5 border-b border-border/30 last:border-b-0 space-y-2"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                      <AvatarImage src={reviewerAvatar} alt={reviewerName} />
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                        {reviewerName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-sm">
                                          {reviewerName}
                                        </span>
                                        <div className="flex items-center space-x-0.5">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`w-3.5 h-3.5 ${
                                                i < ratingNum
                                                  ? "text-yellow-500 fill-current"
                                                  : "text-muted-foreground/30"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {serviceLabel} • {reviewDate}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {review.comment && (
                                  <p className="text-sm text-foreground/90 leading-relaxed pl-13">
                                    {review.comment}
                                  </p>
                                )}

                                {review.reply?.comment && (
                                  <div className="ml-13 mt-3 p-3 rounded-lg bg-muted/60 border border-border/50 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-primary">
                                        Response from {providerName}:
                                      </span>
                                      {review.reply.repliedAt && (
                                        <span className="text-muted-foreground text-[11px]">
                                          {new Date(review.reply.repliedAt).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed">
                                      {review.reply.comment}
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      ) : (
                        <div className="py-12 px-4 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/40">
                          <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-3">
                            <Star className="w-6 h-6 fill-current" />
                          </div>
                          <h4 className="font-semibold text-base mb-1">No Reviews Yet</h4>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            This provider hasn't received any customer reviews yet. Book their service and be the first to leave feedback!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                {/* 2. DYNAMIC PORTFOLIO TAB */}
                <TabsContent value="portfolio" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="portfolio"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {portfolioImages.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {portfolioImages.map((imgUrl, idx) => (
                            <MotionCard
                              key={idx}
                              whileHover={{ y: -6, scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-border/40 group relative"
                            >
                              <div className="relative h-48 w-full overflow-hidden bg-muted">
                                <img
                                  src={imgUrl}
                                  alt={`Portfolio work ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                              <div className="p-4 bg-card">
                                <h4 className="font-semibold text-sm mb-1">
                                  Project Sample #{idx + 1}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Verified work uploaded by {providerName}
                                </p>
                              </div>
                            </MotionCard>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 px-4 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/40">
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                            <Award className="w-6 h-6" />
                          </div>
                          <h4 className="font-semibold text-base mb-1">No Portfolio Uploaded</h4>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            This service provider hasn't uploaded project samples yet. You can contact them directly or review their skills and bio.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                {/* 3. DYNAMIC EXPERIENCE TAB */}
                <TabsContent value="experience" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="space-y-4"
                    >
                      {/* Years Experience */}
                      <div className="flex items-center space-x-3">
                        <Award className="w-6 h-6 text-(--primary-gradient-start) shrink-0" />
                        <div>
                          <p className="font-semibold">
                            {(providerData.yearsExperience || 0) > 0
                              ? `${providerData.yearsExperience}+ Years Experience`
                              : "Experienced Professional"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Specialized in {providerData.skills?.name || "Professional Services"} with field expertise
                          </p>
                        </div>
                      </div>
                      <Separator />

                      {/* Verification Status */}
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-(--primary-gradient-start) shrink-0" />
                        <div>
                          <p className="font-semibold">
                            {providerData.isVerified ? "Verified Professional" : "SkillHub Registered Member"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {providerData.isVerified
                              ? "Identity verification and background review passed"
                              : "Active profile registered on the SkillHub network"}
                          </p>
                        </div>
                      </div>
                      <Separator />

                      {/* Completed Jobs */}
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-(--primary-gradient-start) shrink-0" />
                        <div>
                          <p className="font-semibold">
                            {providerData.completedJobs || 0} Completed Jobs
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(providerData.completedJobs || 0) > 0
                              ? "Successfully fulfilled service orders on SkillHub"
                              : "Ready to accept and complete service bookings"}
                          </p>
                        </div>
                      </div>

                      {/* Certifications if available */}
                      {providerData.certifications && providerData.certifications.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2 pt-1">
                            <p className="font-semibold text-sm">Certifications & Licenses</p>
                            <div className="flex flex-wrap gap-2">
                              {providerData.certifications.map((cert, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-(--primary-gradient-start)/10 text-(--primary-gradient-start) border border-(--primary-gradient-start)/20"
                                >
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Languages */}
                      {providerData.languages && providerData.languages.length > 0 && (
                        <>
                          <Separator />
                          <div className="flex items-center space-x-3">
                            <MessageCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="font-semibold text-sm">Languages Spoken</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {providerData.languages.map((lang, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Availability Hours */}
                      {providerData.availability && (
                        <>
                          <Separator />
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="font-semibold text-sm">Working Hours & Availability</p>
                              <p className="text-sm text-muted-foreground">{providerData.availability}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Contact Info Card */}
            <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {providerData.phone ? `${providerData.phone}` : "Available after booking"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Message through platform</span>
                </div>
                {providerData.website && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={providerData.website.startsWith("http") ? providerData.website : `https://${providerData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {providerData.website}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="space-y-6"
          >
            <MotionCard
              initial={false}
              className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-20"
            >
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-(--primary-gradient-start) mb-1">
                  ₹{startingRate}/{rateUnit}
                </p>
                <p className="text-muted-foreground text-sm">Starting rate</p>
              </div>

              <div className="space-y-4 mb-6">
                <MotionButton
                  size="lg"
                  className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() =>
                    navigate(`/hire/${effectiveProviderId}`, {
                      state: { selectedProviderId: effectiveProviderId },
                    })
                  }
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </MotionButton>

                <MotionButton
                  variant="ghost"
                  size="lg"
                  className="w-full border-2 border-(--primary-gradient-start)/30 text-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/5"
                  onClick={() =>
                    navigate(
                      `/chat?partnerId=${providerData.userId || providerData.id || effectiveProviderId}`
                    )
                  }
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </MotionButton>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span className="font-medium">{providerData.responseTime || "< 1 hour"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed Jobs:</span>
                  <span className="font-medium">{providerData.completedJobs || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium">{formattedDistance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Arrival:</span>
                  <span className="font-medium">{formattedEstimatedTime}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Protected by SkillHub guarantee</span>
                </div>
              </div>
            </MotionCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
