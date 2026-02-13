/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { LocationPickerPanel } from './LocationPickerPanel.jsx';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../lib/axiosSetup';
import { updateLocation } from '../../slices/userSlice';
import {
  Search,
  Home,
  MessageCircle,
  FileText,
  User,
  Map,
  MapPin,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from '../ui/menubar.jsx';

export default function Navigation({
  searchQuery = '',
  onSearchChange,
  onSearch,
  isDarkMode,
  onToggleDarkMode,
  setIsAuthPanelOpen
}) {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const userLocationFromDb = user?.location?.address || 'Select location';
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1];

  const handleNavigate = (id) => {
    let target = '/';
    switch (id) {
      case 'orders':
        target = '/orders';
        break;
      case 'chat':
        target = '/';
        break;
      case 'search':
        target = '/search';
        break;
      case 'profile':
        target = '/profile';
        break;
      default:
        target = '/';
    }

    if (location.pathname === target) return;

    navigate(target);
  };

  const handleSearch = () => {
    if (!isAuthenticated) {
      setIsAuthPanelOpen(true);
      return;
    }

    navigate('/search');
  };

  const navItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'search', label: 'Search', icon: Search },
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
        lat: data.lat ?? data.lng ?? null,
        lng: data.lng ?? data.lat ?? null,
      };

      try { dispatch(updateLocation(loc)); } catch (e) { /* ignore */ }
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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-2xl supports-backdrop-filter:bg-background/40">
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
                  variant="ghost"
                  onClick={() => setIsLocationPickerOpen(true)}
                  className="h-11 px-4 border-2 border-border/60 hover:border-(--primary-gradient-start) transition-all duration-200 min-w-40 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-sm truncate max-w-22">{userLocationFromDb}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Input
                    placeholder="Search skills or services..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (onSearch ? onSearch() : handleSearch());
                    }}
                    className="pr-16 h-11 bg-input-background border-2 border-border/60 shadow-sm focus:shadow-md focus:border-(--primary-gradient-start) transition-all duration-200"
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
                  onClick={() => (onSearch ? onSearch() : handleSearch())}
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
              className="p-2 cursor-pointer flex items-center text-amber-400 dark:text-blue-500 transition-colors"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <>
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>
                      <div className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-secondary/30 border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-indigo-800 flex items-center border justify-center text-white text-sm font-bold">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full" />
                          ) : (
                            user?.fullName
                              ? user.fullName.charAt(0).toUpperCase()
                              : "U"
                          )}
                        </div>
                        <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName?.split(' ')[0]}</span>
                      </div>
                    </MenubarTrigger>
                    <MenubarContent className='min-w-36 mr-1 mt-2 font-semibold'>
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

            <LocationPickerPanel
              isOpen={isLocationPickerOpen}
              onClose={() => setIsLocationPickerOpen(false)}
              currentLocation={userLocationFromDb}
              onLocationSelect={() => { }}
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
              className="p-2 cursor-pointer flex items-center md:hidden text-amber-400 dark:text-blue-500 transition-colors"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-2xl border-t border-border">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              let targetPath = '/';
              switch (item.id) {
                case 'orders':
                  targetPath = '/orders';
                  break;
                case 'chat':
                  targetPath = '/chats';
                  break;
                case 'profile':
                  targetPath = '/profile';
                  break;
                case 'search':
                  targetPath = '/search';
                  break;
                case 'home':
                  targetPath = '/';
                  break;
                default:
                  targetPath = '/';
              }

              const isActive = location.pathname === targetPath;

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