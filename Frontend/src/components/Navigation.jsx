import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { 
  Search, 
  Home, 
  ShoppingCart, 
  File, 
  User, 
  Map,
  MapPin,
  Menu
} from 'lucide-react'

export function Navigation({ 
  currentPage, 
  onNavigate, 
  user, 
  searchQuery = '', 
  onSearchChange,
  onSearch 
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'orders', label: 'Orders', icon: File },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'profile', label: 'Profile', icon: null },
    { id: 'history', label: 'History', icon: File}, 
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-18 items-center justify-between px-4 mx-auto py-3">
          {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <span className="font-bold text-lg">S</span>
              </div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] bg-clip-text text-transparent">
                SkillHub
              </h1>
            </div>
          
          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="flex w-full gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search skills or services..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                  className="pl-12 h-11 bg-input-background border-2 border-border/60 shadow-sm focus:shadow-md focus:border-[var(--primary-gradient-start)] transition-all duration-200"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onSearch}
                className="h-11 w-11 border-2 hover:border-[var(--primary-gradient-start)] hover:bg-[var(--primary-gradient-start)]/10 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('map')}
              >
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">Near you</span>
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('orders')}>
              Orders
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('history')}>
              History
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('cart')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
            <Avatar className="w-8 h-8 cursor-pointer" onClick={() => onNavigate('profile')}>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-6 pb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills or services"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                className="pl-10 bg-input-background"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onSearch}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t">
  <div className="flex justify-around items-center py-2">
    {navItems.map((item) => {
      const Icon = item.icon;
      const isActive = currentPage === item.id;

      return (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
            isActive ? 'text-[var(--primary-gradient-start)]' : 'text-muted-foreground'
          }`}
        >
          {item.id === "profile" ? (
            <Avatar className="w-6 h-6">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-xs">
                {user?.name
                  ? user.name.split(" ").map((n) => n[0]).join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            Icon && <Icon className="w-5 h-5" />
          )}
          <span className="text-xs">{item.label}</span>
        </Button>
      );
    })}
  </div>
</nav>
    </>
  )
}
