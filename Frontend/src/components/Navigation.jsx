/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import AuthPanel from './AuthPanel';
import { LocationPickerPanel } from './LocationPickerPanel';
import { useSelector, useDispatch } from 'react-redux';
import api from '../lib/axiosSetup';
import { updateLocation } from '../slices/userSlice';
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
  onToggleDarkMode,
  isAuthPanelOpen,
  setIsAuthPanelOpen
}) {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const userLocationFromDb = user?.location?.address || 'Bhopal';
  const navigate = useNavigate();
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: null }
  ];

  // If user has no saved location, fetch via IP and persist
  const fetchIpLocationAndSave = async () => {
    try {
      const res = await api.get('/api/maps/ip-lookup');
      const data = res?.data?.data || {};

      const loc = {
        source: 'ip',
        pin: data.zip || data.pin || '',
        address: data.city ? `${data.city}, ${data.regionName || ''}`.replace(/, $/, '') : data.query || 'Unknown',
        city: data.city || '',
        state: data.regionName || data.state || '',
        lat: data.lat ?? data.lon ?? null,
        lon: data.lon ?? data.lat ?? null,
      };

      try { dispatch(updateLocation(loc)); } catch (e) { /* ignore */ }

      // backend already persisted when authenticated, but ensure fallback
      try {
        await api.put('/api/users/update-profile', { location: loc });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('IP location failed', err);
    }
  };

  const ipFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const hasLocation = Boolean(user?.location && user.location.address);
    if (!hasLocation && !ipFetchedRef.current) {
      ipFetchedRef.current = true;
      fetchIpLocationAndSave();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.location?.address]);

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
                <Button
                variant="outline"
                onClick={() => setIsLocationPickerOpen(true)}
                className="h-11 px-4 border-2 border-border/60 hover:border-(--primary-gradient-start) transition-all duration-200 min-w-45 justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-(--primary-gradient-start)" />
                  <span className="text-sm truncate max-w-20">{userLocationFromDb}</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search skills or services..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSearch?.();
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
                      <MenubarItem onClick={() => handleNavigate('orders')}><FileText className='focus:text-accent-foreground' />Orders</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem onClick={() => handleNavigate('profile')}><User className='focus:text-accent-foreground' />View Profile</MenubarItem>
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

            <LocationPickerPanel
              isOpen={isLocationPickerOpen}
              onClose={() => setIsLocationPickerOpen(false)}
              currentLocation={userLocationFromDb}
              onLocationSelect={() => {}}
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