import React, { useState } from 'react'
import { Navigation } from './Navigation.jsx'
import { SkillCard } from './SkillCard.jsx'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Filter } from 'lucide-react'
import { skills, providers, getProvidersBySkill, categories, getProvidersByCategory } from '../data/mockData.js'

export function HomeFeed({ onNavigate, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProviders, setFilteredProviders] = useState(providers)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = getProvidersBySkill(query)
      setFilteredProviders(filtered)
    } else {
      setFilteredProviders(providers)
    }
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    const filtered = getProvidersByCategory(category)
    setFilteredProviders(filtered)
    setSearchQuery('')
  }

  const handleSkillCardClick = (providerId) => {
    onNavigate('skill-detail', { selectedProviderId: providerId })
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      onNavigate('landing')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pb-8 from-background via-surface/30 to-background authenticated-page">
      <Navigation 
        onNavigate={onNavigate}
        onSearch={handleSearch}
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        cartItemCount={2}
        isAuthenticated={!!user}
        currentPage="home"
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Quick Skills */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Popular Skills</h2>
            <p className="text-muted-foreground">Tap any skill to find providers instantly</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {skills.slice(0, 8).map((skill) => (
              <Card
                key={skill.id}
                className="group p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center bg-card border-2 border-border/40 hover:border-[var(--primary-gradient-start)]/30 relative overflow-hidden"
                onClick={() => {
                  setSearchQuery(skill.name)
                  const filtered = getProvidersBySkill(skill.name)
                  setFilteredProviders(filtered)
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-gradient-start)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                  <p className="font-semibold text-sm">{skill.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                  className={selectedCategory === category ? 
                    "bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white" : 
                    ""
                  }
                >
                  {category === 'all' ? 'All Services' : category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : 'Available Providers'}
            </h2>
            <p className="text-muted-foreground">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredProviders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No providers found for your search.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setFilteredProviders(providers)
                  setSelectedCategory('all')
                }}
              >
                Clear filters
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

        {/* Quick Actions */}
        <section className="mt-16 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group p-8 bg-gradient-to-br from-[var(--primary-gradient-start)]/10 to-[var(--primary-gradient-end)]/5 border-2 border-[var(--primary-gradient-start)]/20 hover:border-[var(--primary-gradient-start)]/40 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-gradient-start)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-3">Become a Provider</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Share your skills and earn money by helping others in your community.
                </p>
                <Button 
                  onClick={() => onNavigate('register-provider')}
                  className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            </Card>

            <Card className="group p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-3">Emergency Services</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Need urgent help? Find providers available for emergency services.
                </p>
                <Button 
                  variant="outline"
                  className="border-2 border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-200"
                >
                  Find Emergency Help
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
