import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import AuthPanel from './AuthPanel';
import { useSelector } from 'react-redux';
import {
  Search,
  Home,
  MessageCircle,
  FileText,
  User,
  Map,
  MapPin,
  Menu,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from './ui/menubar.jsx';

export default function Navigation({
  searchQuery = '',
  onSearchChange,
  onSearch,
  isDarkMode,
  onToggleDarkMode
}) {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const currentPage = window.location.pathname.split('/')[1] || 'home';

  const handleNavigate = (id) => {
    switch (id) {
      case 'home': return navigate('home');
      case 'map': return navigate('home');
      case 'orders': return navigate('orders');
      case 'chat': return navigate('home');
      case 'profile': return navigate('profile');
      default: return navigate('home');
    }
  };
  const [selectedLocation, setSelectedLocation] = useState('Location');

  const locations = [
    'Current Location',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX'
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: null }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/40">
        <div className="container flex h-18 items-center justify-between px-4 mx-auto py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => handleNavigate('home')}>
            <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
            </div>
            <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
              SkillHub
            </h1>
          </div>

          {/* Desktop Search */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="flex w-full gap-3">
                {/* Location Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-11 px-4 border-2 border-border cursor-pointer hover:border-(--primary-gradient-start) transition-all duration-200 min-w-[60px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-sm truncate max-w-[120px]">{selectedLocation}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {locations.map((location) => (
                      <DropdownMenuItem
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={selectedLocation === location ? 'bg-secondary' : ''}
                      >
                        <MapPin className="w-4 h-4 mr-2 text-accent" />
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search skills or services..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSearch?.();
                      // Let the global Cmd+K handler take care of opening command palette
                    }}
                    className="pl-12 pr-16 h-11 bg-input-background border-2 border-border/60 shadow-sm focus:shadow-md focus:border-(--primary-gradient-start) transition-all duration-200"
                  />
                  {/* Keyboard Shortcut Hint */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onSearch}
                  className="h-11 w-11 border-2 border-border hover:border-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/10 transition-all duration-200"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button
              aria-pressed={isDarkMode}
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded cursor-pointer flex items-center"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate('map')}
                  className='cursor-pointer'
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Near you</span>
                </Button>
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger><Avatar className="w-6 h-6 cursor-pointer">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback className="text-xs">
                        {user?.firstName
                          ? user.firstName.split(" ").map((n) => n[0]).join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    </MenubarTrigger>
                    <MenubarContent className='min-w-36 mr-1 mt-4 font-semibold'>
                      <MenubarItem onClick={() => handleNavigate('chat')}><MessageCircle />Chat</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem onClick={() => handleNavigate('orders')}><FileText />Orders</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem onClick={() => handleNavigate('profile')}><User />View Profile</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" className='cursor-pointer' onClick={() => setIsAuthPanelOpen(true)}>Sign In</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin-login')} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Admin</Button>
              </div>
            )}
            {/* Auth Panel */}
            <AuthPanel
              isOpen={isAuthPanelOpen}
              onClose={() => setIsAuthPanelOpen(false)}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className='flex gap-2 md:hidden'>
            {!isAuthenticated && (
              <div className="md:hidden flex items-center justify-center gap-2">
                <Button variant="ghost" className='cursor-pointer' onClick={() => setIsAuthPanelOpen(true)}>Sign In</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin-login')} className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">Admin</Button>
              </div>
            )}
            <button
              aria-pressed={isDarkMode}
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded cursor-pointer flex items-center md:hidden"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isAuthenticated && (
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
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-t border-border">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${isActive ? 'text-(--primary-gradient-start)' : 'text-muted-foreground'
                    }`}
                >
                  {item.id === "profile" ? (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback className="text-xs">
                        {user?.firstName
                          ? user.firstName.split(" ").map((n) => n[0]).join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )
                    : (
                      Icon && <Icon className="w-5 h-5" />
                    )}
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}