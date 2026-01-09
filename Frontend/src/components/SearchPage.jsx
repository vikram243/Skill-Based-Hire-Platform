import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import SkillCard from './SkillCard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Filter, X, SlidersHorizontal, Star } from 'lucide-react';
import { Skills, Provider, getProvidersBySkill, Categories, getProvidersByCategory } from '../data/mockData';

export default function SearchPage({ onNavigate, user, initialSearchQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredProviders, setFilteredProviders] = useState(Provider);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  // Filter and sort providers
  useEffect(() => {
    let filtered = [...Provider];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = getProvidersByCategory(selectedCategory);
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
  }, [searchQuery, selectedCategory, priceRange, ratingFilter, sortBy]);

  const handleSearch = () => {
    // Search is already handled by useEffect
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleSkillCardClick = (providerId) => {
    onNavigate('skill-detail', { selectedProviderId: providerId });
  };

  const handleLogout = () => {
    onNavigate('landing');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setRatingFilter(0);
    setSortBy('relevance');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (sortBy !== 'relevance' ? 1 : 0);

  return (
    <div className="min-h-screen bg-linear-to-br pb-16 from-background via-surface/30 to-background">
      <Navigation 
        onNavigate={onNavigate}
        onSearch={handleSearch}
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartItemCount={2}
        isAuthenticated={!!user}
        currentPage="search"
      />
      
      <div className="container mx-auto px-4 py-6">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Find Your Perfect Provider</h1>
          <p className="text-muted-foreground">Browse skilled professionals ready to help</p>
        </div>

        {/* Quick Skills */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl mb-2">Popular Skills</h2>
            <p className="text-sm text-muted-foreground">Quick search by skill</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {Skills.slice(0, 8).map((skill) => (
              <Card
                key={skill.id}
                className="group p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden"
                onClick={() => {
                  setSearchQuery(skill.name);
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-(--primary-gradient-start)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                  <p className="text-xs">{skill.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {Categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                  className={selectedCategory === category ? 
                    "bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white" : 
                    ""
                  }
                >
                  {category === 'all' ? 'All Services' : category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-(--primary-gradient-start) text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="mb-6 p-6 border-2 border-(--primary-gradient-start)/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">Advanced Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="text-sm mb-2 block">Price Range</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under $50/hr' },
                    { value: 'medium', label: '$50-$100/hr' },
                    { value: 'high', label: '$100+/hr' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={priceRange === option.value ? "default" : "outline"}
                      size="sm"
                      className={`w-full justify-start ${priceRange === option.value ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white' : ''}`}
                      onClick={() => setPriceRange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm mb-2 block">Minimum Rating</label>
                <div className="space-y-2">
                  {[
                    { value: 0, label: 'All Ratings' },
                    { value: 4, label: '4+ Stars' },
                    { value: 4.5, label: '4.5+ Stars' },
                    { value: 5, label: '5 Stars Only' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={ratingFilter === option.value ? "default" : "outline"}
                      size="sm"
                      className={`w-full justify-start ${ratingFilter === option.value ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white' : ''}`}
                      onClick={() => setRatingFilter(option.value)}
                    >
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm mb-2 block">Sort By</label>
                <div className="space-y-2">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'reviews', label: 'Most Reviews' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? "default" : "outline"}
                      size="sm"
                      className={`w-full justify-start ${sortBy === option.value ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white' : ''}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Providers'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredProviders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No providers found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((provider) => (
                <div key={provider.id}>
                  <SkillCard
                    provider={provider}
                    onClick={() => handleSkillCardClick(provider.id)}
                    variant="default"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
