import React, { useState, useEffect } from 'react';
import SkillCard from '../../components/users/SkillCard';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Filter, X, SlidersHorizontal, Star, Search, Sparkles, TrendingUp, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';
import { Provider, getProvidersBySkill, getProvidersByCategory,Skills } from '../../data/mockData';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { useSelector } from 'react-redux';

export default function SearchPage({ onNavigate, initialSearchQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredProviders, setFilteredProviders] = useState(Provider);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const { user } = useSelector((state) => state.user);
  const [openToggle, setOpenToggle] = useState('skill');

  // Filter and sort providers
  useEffect(() => {
    let filtered = [...Provider];

    // Category filter
    if (selectedSkill !== 'all') {
      filtered = getProvidersByCategory(selectedSkill);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = getProvidersBySkill(searchQuery);
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(provider => {
        const price = provider.hourlyRate;
        switch (priceRange) {
          case 'low': return price < 50;
          case 'medium': return price >= 50 && price < 100;
          case 'high': return price >= 100;
          default: return true;
        }
      });
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(provider => provider.rating >= ratingFilter);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setFilteredProviders(filtered);
  }, [searchQuery, selectedSkill, priceRange, ratingFilter, sortBy]);


  const handleSkills = (skills) => {
    setSelectedSkill(skills);
  };

  const handleSkillCardClick = (providerId) => {
    onNavigate('skill-detail', { selectedProviderId: providerId });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSkill('all');
    setPriceRange('all');
    setRatingFilter(0);
    setSortBy('relevance');
  };

  const activeFiltersCount =
    (selectedSkill !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (sortBy !== 'relevance' ? 1 : 0);

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

      {/* Category Filter */}
      <div className="mb-8">
        <button
          onClick={() => toggleFilter("Skill")}
          className="flex items-center gap-6 mb-4 cursor-pointer"
        >
          <h4 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
            Skill
          </h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openToggle === "category" ? "rotate-180" : ""
              }`}
          />
        </button>

        {openToggle === "skills" && (
          <div className="flex flex-wrap gap-2">
            {Skills.map((skill) => (
              <button
                key={Skills}
                onClick={() => {
                  handleSkills(skill);
                  setOpenToggle(null); // 🔥 close after select
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedSkill === skill
                  ? "bg-blue-600 text-white"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {skill.name === "all" ? "All" : skill.name}
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
              { value: "low", label: "Budget ($0-$50)" },
              { value: "medium", label: "Mid-range ($50-$100)" },
              { value: "high", label: "Premium ($100+)" },
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
              <option value="reviews" className='bg-secondary'>Most Reviewed</option>
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
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSection />
          </aside>

          {/* Main Results Area */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex gap-2 mb-6">
              <Button
                variant={showFilters ? "default" : "outline"}
                className={`flex-1 h-14 rounded-2xl border-2 font-bold transition-all ${showFilters ? 'bg-blue-600 border-blue-600' : 'border-border/60'
                  }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-white text-blue-600 rounded-full text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-8"
                >
                  <Card className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/30 bg-secondary/10">
                    <FilterSection isMobile />
                    <Button
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black">
                  {filteredProviders.length} Providers Found
                </h2>
                {searchQuery && (
                  <p className="text-muted-foreground text-sm mt-1">Showing results for "{searchQuery}"</p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-sm font-medium bg-secondary/30 px-4 py-2 rounded-full border border-border/40">
                <MapPin className="w-4 h-4 text-blue-500" />
                {user?.location?.city || 'Everywhere'}
              </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="popLayout">
              {filteredProviders.length === 0 ? (
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
                  className="grid gap-8 md:grid-cols-2"
                >
                  {filteredProviders.map((provider) => (
                    <motion.div
                      key={provider.id}
                      variants={itemVariants}
                      layout
                    >
                      <SkillCard
                        provider={provider}
                        onClick={() => handleSkillCardClick(provider.id)}
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
    </div>
  );
}