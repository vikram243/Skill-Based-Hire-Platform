import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import SkillCard from './SkillCard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import {
  skills,
  Providers,
  getProvidersBySkill,
  categories,
  getProvidersByCategory
} from '../data/mockData';

function SearchPage({
  onNavigate,
  user,
  initialSearchQuery = ''
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredProviders, setFilteredProviders] = useState(Providers);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  // Filter and sort providers
  useEffect(() => {
    let filtered = [...Providers];

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
          case 'low':
            return price < 50;
          case 'medium':
            return price >= 50 && price < 100;
          case 'high':
            return price >= 100;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(
        provider => provider.rating >= ratingFilter
      );
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
      default:
        break;
    }

    setFilteredProviders(filtered);
  }, [searchQuery, selectedCategory, priceRange, ratingFilter, sortBy]);

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
    <div className="min-h-screen bg-linear-to-br pb-8 from-background via-surface/30 to-background">
      <Navigation
        onNavigate={onNavigate}
        onSearch={() => {}}
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartItemCount={2}
        isAuthenticated={!!user}
        currentPage="search"
      />

      <div className="container mx-auto px-4 py-6">

        <div className="mb-6">
          <h1 className="text-3xl mb-2">Find Your Perfect Provider</h1>
          <p className="text-muted-foreground">
            Browse skilled professionals ready to help
          </p>
        </div>

        {/* Popular Skills */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {skills.slice(0, 8).map(skill => (
              <Card
                key={skill.id}
                className="group p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center bg-card border-2 border-border/40 hover:border-[var(--primary-gradient-start)]/30 relative overflow-hidden"
                onClick={() => setSearchQuery(skill.name)}
              >
                <div className="relative z-10">
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <p className="text-xs">{skill.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter(category)}
                className={
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white'
                    : ''
                }
              >
                {category === 'all' ? 'All Services' : category}
              </Button>
            ))}
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map(provider => (
              <SkillCard
                key={provider.id}
                provider={provider}
                onClick={() => handleSkillCardClick(provider.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchPage;