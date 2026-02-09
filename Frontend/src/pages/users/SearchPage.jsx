import React, { useState, useEffect } from 'react';
import SkillCard from '../../components/users/SkillCard';
import SkillDetailPage from './SkillDetailPage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';
import api from '../../lib/axiosSetup';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '../../components/ui/dialog';
import { useSelector } from 'react-redux';

export default function SearchPage({ searchQuery = '', setSearchQuery }) {
  console.log('SearchPage rendered with query:', searchQuery);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [locationFilter, setLocationFilter] = useState('all');
  const { providerId } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [openToggle, setOpenToggle] = useState('category');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const params = {
          q: searchQuery || undefined,
          priceRange: priceRange !== 'all' ? priceRange : undefined,
          rating: ratingFilter > 0 ? ratingFilter : undefined,
          sortBy: sortBy !== 'relevance' ? sortBy : undefined,
          locationFilter: locationFilter !== 'all' ? locationFilter : undefined,
          page: 1,
          limit: 20,
        };

        // include lat/lng if available on user
        if (user?.location?.lat && user?.location?.lng) {
          params.lat = user.location.lat;
          params.lng = user.location.lng;
        }

        const { data } = await api.get('/api/providers/filter', {
          params,
          signal: controller.signal,
        });

        const raw = data?.data?.providers || [];

        console.log('Raw providers from API:', raw);

        const formatDistance = (d) => {
          if (d == null) return undefined;
          // distance from backend (meters). format to km/m
          const meters = Number(d);
          if (Number.isNaN(meters)) return undefined;
          if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
          return `${Math.round(meters)} m`;
        };

        const normalized = raw.map((p) => {
          const id = p._id || p.id || (p.user && p.user._id) || Math.random().toString(36).slice(2);
          const name = p.businessName || p.user?.fullName || [p.user?.firstName, p.user?.lastName].filter(Boolean).join(' ') || 'Unknown';
          const avatar = p.user?.avatar || p.avatar || '';
          const skills = (p.selectedSkills || []).map(s => s.name).filter(Boolean);
          const hourlyRate = Array.isArray(p.pricing) ? (p.pricing[0]?.serviceRate || 0) : (p.pricing?.serviceRate || 0);
          const rating = p.meta?.avgRating ?? 0;
          const reviewCount = p.meta?.totalReviews ?? 0;
          const distance = p.distance != null ? formatDistance(p.distance) : undefined;
          const bio = p.professionalDescription || p.user?.bio || '';
          const isVerified = p.verification?.isVerified || false;
          const completedJobs = p.meta?.completedJobs || 0;
          const availability = p.isOnline ? 'available' : 'offline';

          return {
            id,
            _id: id,
            name,
            avatar,
            skills,
            hourlyRate,
            rating,
            reviewCount,
            distance,
            bio,
            isVerified,
            completedJobs,
            availability,
            // keep raw payload for anything else
            raw: p,
          };
        });

        setFilteredProviders(normalized);
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setFilteredProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();

    return () => controller.abort();
  }, [
    searchQuery,
    priceRange,
    ratingFilter,
    sortBy,
    locationFilter,
    user?.location?.lat,
    user?.location?.lng
  ]);

  const selectedProvider = providerId
    ? filteredProviders.find(p => String(p.id || p._id) === providerId)
    : null;

  const handleSkillCardClick = (id) => {
    navigate(`/search/${id}`);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    setRatingFilter(0);
    setSortBy('relevance');
    setLocationFilter('all');
  };

  const activeFiltersCount =
    (priceRange !== 'all' ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (sortBy !== 'relevance' ? 1 : 0) +
    (locationFilter !== 'all' ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const toggleFilter = (name) => {
    setOpenToggle((prev) => (prev === name ? null : name));
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? '' : 'sticky top-24'}`}>
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
            className={`w-4 h-4 transition-transform ${openToggle === "location" ? "rotate-180" : ""
              }`}
          />
        </button>

        {openToggle === "location" && (
          <div className="space-y-2">
            {[
              { value: "all", label: "All Locations" },
              { value: "close-to-far", label: "Close to Far" },
              { value: "far-to-close", label: "Far to Close" },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setLocationFilter(option.value);
                  setOpenToggle(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border-2 ${locationFilter === option.value
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
            className={`w-4 h-4 transition-transform ${openToggle === "price" ? "rotate-180" : ""
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border-2 ${priceRange === option.value
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
            className={`w-4 h-4 transition-transform ${openToggle === "sort" ? "rotate-180" : ""
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
              <option value="relevance" className='bg-secondary'>Recommended</option>
              <option value="rating" className='bg-secondary'>Top Rated</option>
              <option value="price-low" className='bg-secondary'>Price: Low to High</option>
              <option value="price-high" className='bg-secondary'>Price: High to Low</option>
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
        <SkillDetailPage provider={selectedProvider} onClose={() => navigate('/search')} />
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
                          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                          className="pl-10 bg-input-background"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                  <DialogTrigger asChild>
                    <Button
                      className={`flex-1 rounded-2xl border-2 font-bold transition-all ${showFilters ? 'bg-blue-600 border-blue-600 text-white' : 'border-border/60'}`}
                      variant={showFilters ? 'default' : 'outline'}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                      {activeFiltersCount > 0 && (
                        <span className="text-blue-500 rounded-full text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg w-[90%] p-4">
                    <DialogTitle className="text-lg font-black mb-4">Filters</DialogTitle>
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
                        <Button variant="outline" className="h-12 rounded-xl">Close</Button>
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
                    <p className="text-muted-foreground text-sm mt-1">Showing results for "{searchQuery}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-secondary/30 px-2 py-2 rounded-full border border-border/40">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <p className='truncate max-w-30'>{user?.location?.city || 'Everywhere'}</p>
                </div>
              </div>

              {/* Results Grid */}
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <div className="py-24 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">Loading providers...</p>
                  </div>
                ) : filteredProviders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-24 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">No experts found</h3>
                    <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                      We couldn't find any providers matching your specific filters. Try expanding your search criteria or resetting filters.
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
                    initial="hidden"
                    animate="visible"
                    key={`providers-${filteredProviders.length}`}
                    className="grid gap-8 md:grid-cols-2"
                  >
                    {filteredProviders.map((provider) => (
                      <motion.div
                        key={provider.id || provider._id}
                        variants={itemVariants}
                        layout
                      >
                        <SkillCard
                          provider={provider}
                          onClick={() => handleSkillCardClick(provider.id || provider._id)}
                          variant="default"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}