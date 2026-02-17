import React, { useState, useEffect, lazy, Suspense } from "react";
import SkillCard from "../../components/users/SkillCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useDebounce from "../../hooks/Debounce";
import {
  Filter,
  X,
  SlidersHorizontal,
  Star,
  Search,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import api from "../../lib/axiosSetup";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";
import { useSelector } from "react-redux";
import { useUI } from "../../contexts/ui-context";

const SkillDetailPage = lazy(() => import("./SkillDetailPage"));

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useUI();
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [locationFilter, setLocationFilter] = useState("all");
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [openToggle, setOpenToggle] = useState("category");
  const [showFilters, setShowFilters] = useState(false);
  const lastFetchedPageRef = React.useRef(0);
  const queryKeyRef = React.useRef("");
  const previousLengthRef = React.useRef(0);

  useEffect(() => {
    document.title = "Search | SkillHub";
  }, []);

  useEffect(() => {
    previousLengthRef.current = filteredProviders.length;
  }, [filteredProviders.length]);

  const fetchProviders = React.useCallback(async (pageToLoad = 1, reset = false, queryKey) => {
    try {
      if (!reset && pageToLoad === lastFetchedPageRef.current) return;

      const keyAtCall = queryKey ?? queryKeyRef.current;

      if (pageToLoad === 1) setIsLoading(true);
      else setLoadingMore(true);

      const params = {
        q: debouncedSearch || undefined,
        priceRange: priceRange !== "all" ? priceRange : undefined,
        rating: ratingFilter > 0 ? ratingFilter : undefined,
        sortBy:
          locationFilter !== "all"
            ? locationFilter === "far-to-close"
              ? "distance-far"
              : "nearest"
            : sortBy !== "relevance"
              ? sortBy
              : undefined,
        page: pageToLoad,
        limit: 10,
      };

      const { data } = await api.get("/api/providers/filter", { params });

      if (keyAtCall !== queryKeyRef.current) return;

      lastFetchedPageRef.current = pageToLoad;

      const raw = data?.data?.providers || [];
      const total = data?.data?.total || 0;

      const normalized = raw.map((p) => ({
        id: p._id,
        name: p.name,
        avatar: p.avatar || "",
        skills: p.skills,
        hourlyRate: p.price,
        rating: p.rating,
        reviewCount: p.reviewCount ?? 0,
        distance: p.distanceText,
        bio: p.bio || "",
        isVerified: p.isVerified || false,
        completedJobs: p.completedJobs || 0,
        estimatedTime: p.estimatedTimeText,
        location: p.location,
        rateType: p.rateType,
      }));

      setFilteredProviders((prev) => {
        if (reset) return normalized;

        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = normalized.filter((p) => !existingIds.has(p.id));

        return [...prev, ...newUnique];
      });

      const loadedCount = (pageToLoad - 1) * 10 + normalized.length;
      setHasMore(loadedCount < total);
      if (loadedCount >= total && observer.current) {
        observer.current.disconnect();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [
    debouncedSearch,
    priceRange,
    ratingFilter,
    sortBy,
    locationFilter,
  ]);

  useEffect(() => {
    queryKeyRef.current = [
      debouncedSearch,
      priceRange,
      ratingFilter,
      sortBy,
      locationFilter,
      user?.location?.lat,
      user?.location?.lng,
    ].join("|");

    setPage(1);
    setHasMore(true);
    lastFetchedPageRef.current = 0;
    setFilteredProviders([]);
    fetchProviders(1, true, queryKeyRef.current);
  }, [
    fetchProviders,
    setPage,
    debouncedSearch,
    priceRange,
    ratingFilter,
    sortBy,
    locationFilter,
    user?.location?.lat,
    user?.location?.lng,
  ]);

  const observer = React.useRef();
  const lastProviderRef = React.useCallback(
    (node) => {
      if (loadingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            setPage((prev) => {
              const next = prev + 1;
              fetchProviders(next, false, queryKeyRef.current);
              return next;
            });
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -400px 0px",
          threshold: 0,
        },
      );

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, fetchProviders],
  );

  const selectedProvider = providerId
    ? filteredProviders.find((p) => String(p.id || p._id) === providerId)
    : null;

  const handleSkillCardClick = (id) => {
    navigate(`/search/${id}`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setRatingFilter(0);
    setSortBy("relevance");
    setLocationFilter("all");
  };

  const activeFiltersCount =
    (priceRange !== "all" ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const toggleFilter = (name) => {
    setOpenToggle((prev) => (prev === name ? null : name));
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? "" : "sticky top-27"}`}>
      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-xl flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* LOCATION FILTER */}
      <div className="mb-8">
        <button
          onClick={() => toggleFilter("location")}
          className="flex items-center gap-6 mb-4 cursor-pointer"
        >
          <h4 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
            Distance
          </h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openToggle === "location" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openToggle === "location" && (
          <div className="space-y-2">
            {[
              { value: "all", label: "All Locations" },
              { value: "close-to-far", label: "Close to Far" },
              { value: "far-to-close", label: "Far to Close" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setLocationFilter(option.value);
                  setOpenToggle(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border-2 ${
                  locationFilter === option.value
                    ? "border-blue-600 bg-blue-50/50 text-blue-600"
                    : "border-transparent bg-secondary/30 text-muted-foreground"
                }`}
              >
                {option.label}
                {locationFilter === option.value && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <button
          onClick={() => toggleFilter("price")}
          className="flex items-center gap-6 mb-4 cursor-pointer"
        >
          <h4 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
            Price Range
          </h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openToggle === "price" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openToggle === "price" && (
          <div className="space-y-2">
            {[
              { value: "all", label: "All Prices" },
              { value: "low", label: "Budget (₹0-₹50)" },
              { value: "medium", label: "Mid-range (₹50-₹100)" },
              { value: "high", label: "Premium (₹100+)" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setPriceRange(option.value);
                  setOpenToggle(null); // 🔥 auto close
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border-2 ${
                  priceRange === option.value
                    ? "border-blue-600 bg-blue-50/50 text-blue-600"
                    : "border-transparent bg-secondary/30 text-muted-foreground"
                }`}
              >
                {option.label}
                {priceRange === option.value && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-8">
        <button
          onClick={() => toggleFilter("sort")}
          className="flex items-center gap-6 mb-4 cursor-pointer"
        >
          <h4 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
            Sort By
          </h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openToggle === "sort" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openToggle === "sort" && (
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setOpenToggle(null);
              }}
              className="w-full bg-secondary/30 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 font-bold outline-none appearance-none cursor-pointer group-hover:bg-secondary/50 transition-colors"
            >
              <option value="relevance" className="bg-secondary">
                Recommended
              </option>
              <option value="rating" className="bg-secondary">
                Top Rated
              </option>
              <option value="price-low" className="bg-secondary">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-secondary">
                Price: High to Low
              </option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
          </div>
        )}
      </div>

      {activeFiltersCount > 0 && isMobile && (
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-blue-600 text-blue-600 font-bold"
          onClick={clearAllFilters}
        >
          Reset All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background mb-15">
      {selectedProvider ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <SkillDetailPage
            provider={selectedProvider}
            onClose={() => navigate("/search")}
          />
        </Suspense>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-52 shrink-0">
              <FilterSection />
            </aside>

            <div className="flex-1">
              {/* Mobile Filter Toggle amd Search */}
              <div className="lg:hidden flex gap-2 mb-6">
                {isAuthenticated && (
                  <div className="md:hidden w-full">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search skills or services"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                          className="pl-10 bg-input-background"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                  <DialogTrigger asChild>
                    <Button
                      className={`flex-1 rounded-2xl border-2 font-bold transition-all ${showFilters ? "bg-blue-600 border-blue-600 text-white" : "border-border/60"}`}
                      variant={showFilters ? "default" : "outline"}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                      {activeFiltersCount > 0 && (
                        <span className="text-blue-500 rounded-full text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg w-[90%] p-4">
                    <DialogTitle className="text-lg font-black mb-4">
                      Filters
                    </DialogTitle>
                    <div className="overflow-auto max-h-[70vh]">
                      <FilterSection isMobile />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button
                        className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply Filters
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline" className="h-12 rounded-xl">
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black">
                    {filteredProviders.length} Providers Found
                  </h2>
                  {searchQuery && (
                    <p className="text-muted-foreground text-sm mt-1">
                      Showing results for "{searchQuery}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-secondary/30 px-2 py-2 rounded-full border border-border/40">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <p className="truncate max-w-30">
                    {user?.location?.city || "Everywhere"}
                  </p>
                </div>
              </div>

              {/* Results Grid */}
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <div className="py-24 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Loading providers...
                    </p>
                  </div>
                ) : filteredProviders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">
                      No experts found
                    </h3>
                    <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                      We couldn't find any providers matching your specific
                      filters. Try expanding your search criteria or resetting
                      filters or refresh page.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      size="lg"
                      className="h-16 px-10 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform"
                    >
                      Reset All Filters
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial={false}
                    animate="visible"
                    className="grid gap-8 md:grid-cols-2"
                  >
                    {filteredProviders.map((provider, index) => {
                      const isNew = index >= previousLengthRef.current;

                      const card = (
                        <SkillCard
                          provider={provider}
                          onClick={() => handleSkillCardClick(provider.id)}
                        />
                      );

                      if (index === filteredProviders.length - 1) {
                        return (
                          <motion.div
                            ref={lastProviderRef}
                            key={provider.id}
                            variants={itemVariants}
                            initial={isNew ? "hidden" : false}
                            animate="visible"
                            layout
                          >
                            {card}
                          </motion.div>
                        );
                      }

                      return (
                        <motion.div
                          key={provider.id}
                          variants={itemVariants}
                          initial={isNew ? "hidden" : false}
                          animate="visible"
                          layout
                        >
                          {card}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              {loadingMore && (
                <div className="py-24 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-blue-200 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Loading more providers...
                  </p>
                </div>
              )}

              {!hasMore && !isLoading && (
                <div className="py-10 text-center text-muted-foreground font-semibold">
                  No more providers
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
