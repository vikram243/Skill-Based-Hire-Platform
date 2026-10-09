/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar.jsx";
import { LocationPickerPanel } from "./LocationPickerPanel.jsx";
import NotificationDropdown from "../ui/NotificationDropdown.jsx";
import { useSelector, useDispatch } from "react-redux";
import api from "../../lib/axiosSetup.js";
import { updateLocation } from "../../slices/userSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  MessageCircle,
  FileText,
  User,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Briefcase,
  HelpCircle,
  LayoutGrid
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "../ui/menubar.jsx";

export default function Navigation({
  searchQuery = "",
  onSearchChange,
  onSearch,
  isDarkMode,
  onToggleDarkMode,
  setIsAuthPanelOpen,
}) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userLocationFromDb = user?.location?.address || user?.location?.city || "Select Location";
  const userLocationAddress = user?.location?.address;
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
  }, [navigate, searchQuery]);

  // If user has no saved location, fetch via IP and persist
  const fetchIpLocationAndSave = useCallback(async () => {
    try {
      const res = await api.get("/api/maps/ip-lookup");
      const data = res?.data?.data || {};

      const loc = {
        source: "ip",
        pin: data.zip || data.pin || "",
        address: data.city
          ? `${data.city}, ${data.regionName || ""}`.replace(/, $/, "")
          : data.query || "Unknown",
        city: data.city || "",
        state: data.regionName || data.state || "",
        lat: data.lat ?? data.lng ?? null,
        lng: data.lng ?? data.lat ?? null,
      };

      try {
        dispatch(updateLocation(loc));
      } catch (e) {
        /* ignore */
      }
    } catch (err) {
      // IP lookup fallback
    }
  }, [dispatch]);

  const ipFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const hasLocation = Boolean(userLocationAddress);
    if (!hasLocation && !ipFetchedRef.current) {
      ipFetchedRef.current = true;
      fetchIpLocationAndSave();
    }
  }, [isAuthenticated, userLocationAddress, fetchIpLocationAndSave]);

  const navLinks = [
    { label: "Explore", to: "/search" },
    { label: "Services", to: "/services" },
    { label: "How It Works", to: "/how-it-works" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center space-x-2.5 group transition-transform active:scale-95"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-lg transition-all">
                <span className="font-extrabold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-foreground leading-none">
                  SkillHub
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase leading-tight mt-0.5">
                  Pro Network
                </span>
              </div>
            </Link>

            {/* Quick Links on Large Screens */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Bar (Visible on desktop/tablet for all users) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="flex w-full gap-2">
              {/* Location Picker Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLocationPickerOpen(true)}
                className="h-10 px-3 border border-border bg-card/60 hover:bg-card text-xs font-medium justify-between shrink-0 max-w-36 text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{userLocationFromDb}</span>
                </div>
                <ChevronDown className="w-3 h-3 ml-1 opacity-60 shrink-0" />
              </Button>

              {/* Search Input Box */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Find plumbers, electricians, tutors, cleaners..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSearch ? onSearch() : handleSearchSubmit();
                    }
                  }}
                  className="h-10 pl-9 pr-14 text-sm bg-card/60 border border-border rounded-xl focus:bg-card focus:border-primary transition-all"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Button
                  size="sm"
                  onClick={() => (onSearch ? onSearch() : handleSearchSubmit())}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2.5 bg-primary text-white hover:bg-primary/90 text-xs rounded-lg shadow-xs"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Authenticated State */}
            {isAuthenticated ? (
              <>
                {/* Real-time Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <Menubar className="border-0 bg-transparent p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="p-0 border-0 focus:bg-transparent">
                      <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-all">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user?.avatar} alt={user?.fullName || "User"} />
                          <AvatarFallback className="text-xs font-semibold bg-primary text-white">
                            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold max-w-24 truncate hidden sm:inline text-foreground">
                          {user?.fullName?.split(" ")[0] || "Account"}
                        </span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:inline" />
                      </div>
                    </MenubarTrigger>
                    <MenubarContent className="min-w-44 mr-2 mt-2 font-medium rounded-xl border-border bg-card shadow-xl">
                      <MenubarItem onClick={() => navigate("/profile")} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        My Profile
                      </MenubarItem>
                      <MenubarItem onClick={() => navigate("/orders")} className="cursor-pointer">
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        My Bookings
                      </MenubarItem>
                      <MenubarItem onClick={() => navigate("/chat")} className="cursor-pointer">
                        <MessageCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                        Messages
                      </MenubarItem>
                      
                      {user?.isProvider && (
                        <>
                          <MenubarSeparator />
                          <MenubarItem onClick={() => navigate("/provider/dashboard")} className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Provider Dashboard
                          </MenubarItem>
                        </>
                      )}

                      {user?.isAdmin && (
                        <>
                          <MenubarSeparator />
                          <MenubarItem onClick={() => navigate("/admin/dashboard")} className="text-purple-600 dark:text-purple-400 font-bold cursor-pointer">
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Admin Console
                          </MenubarItem>
                        </>
                      )}
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthPanelOpen(true)}
                  className="text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAuthPanelOpen(true)}
                  className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs cursor-pointer hidden sm:flex"
                >
                  Join as Pro
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar in sub-header */}
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-border/40 bg-card/40">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLocationPickerOpen(true)}
              className="h-9 px-2 text-xs border border-border shrink-0 max-w-28 text-muted-foreground"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" />
              <span className="truncate">{userLocationFromDb}</span>
            </Button>
            <div className="relative flex-1">
              <Input
                placeholder="Search services or pros..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
                className="h-9 text-xs pl-8 pr-3 bg-background border-border rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-border bg-card px-4 py-4 space-y-3"
            >
              <div className="space-y-1">
                <Link
                  to="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
                >
                  <Search className="w-4 h-4 text-primary" />
                  Explore All Providers
                </Link>
                <Link
                  to="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
                >
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  Service Categories
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
                >
                  <HelpCircle className="w-4 h-4 text-primary" />
                  How SkillHub Works
                </Link>
                <Link
                  to="/safety"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  Safety & Guarantee
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthPanelOpen(true);
                    }}
                    className="w-full text-xs font-semibold bg-primary text-white"
                  >
                    Sign In / Sign Up
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Location Picker Modal */}
      <LocationPickerPanel
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocationFromDb}
        onLocationSelect={() => {}}
      />

      {/* Mobile Bottom Floating Nav for quick access */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border px-6 py-2 flex items-center justify-between">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              location.pathname.startsWith("/search") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Explore
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              location.pathname === "/orders" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            Bookings
          </Link>
          <Link
            to="/chat"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              location.pathname === "/chat" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </nav>
      )}
    </>
  );
}
