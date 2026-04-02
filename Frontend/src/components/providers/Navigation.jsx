/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  User,
  TrendingUp,
  Star,
  LogOut,
  Menu,
  X,
  Home,
  Moon,
  Sun,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { mockAuth } from "../../data/authMockData";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../lib/axiosSetup.js";
import { setProviderMode, logoutUser } from "../../slices/userSlice.js";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  {
    id: "provider-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  { id: "provider-orders", label: "Orders", icon: ShoppingBag, badge: "3" },
  { id: "provider-history", label: "History", icon: History, badge: null },
  {
    id: "provider-analytics",
    label: "Analytics",
    icon: TrendingUp,
    badge: null,
  },
  { id: "provider-reviews", label: "Reviews", icon: Star, badge: null },
  { id: "provider-profile", label: "Profile", icon: User, badge: null },
];

export default function ProviderNavigation({
  currentPage: propCurrentPage,
  onNavigate: propOnNavigate,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
}) {
  const [providerName, setProviderName] = useState("Provider");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    mockAuth
      .getUser()
      .then(({ user }) => {
        if (user?.name) setProviderName(user.name);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      // Prefer server-side logout when possible
      await api.get("/api/users/logout");
    } catch (err) {
      /* ignore */
    }

    try {
      await mockAuth.signOut();
    } catch (e) {
      /* ignore */
    }

    // Clear client auth state and redirect to homepage
    try {
      dispatch(logoutUser());
    } catch (e) { /* empty */ }
    localStorage.removeItem("accessToken");
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleSwitchToUserMode = async () => {
    try {
      await api.post("/api/users/provider-mode/off");
    } catch (err) {
      /* ignore */
    }
    try {
      dispatch(setProviderMode(false));
    } catch (e) { /* empty */ }
    navigate("/");
  };

  // Internal navigation handler when parent doesn't provide one
  const handleNavigate = (id) => {
    if (propOnNavigate) return propOnNavigate(id);

    let target = "/provider/dashboard";
    switch (id) {
      case "provider-dashboard":
        target = "/provider/dashboard";
        break;
      case "provider-orders":
        target = "/provider/orders";
        break;
      case "provider-history":
        target = "/provider/history";
        break;
      case "provider-analytics":
        target = "/provider/analytics";
        break;
      case "provider-reviews":
        target = "/provider/reviews";
        break;
      case "provider-profile":
        target = "/provider/profile";
        break;
      case "home":
        target = "/";
        break;
      default:
        target = "/provider/dashboard";
    }

    if (location.pathname !== target) navigate(target);
  };

  // Determine active page from location when parent doesn't pass `currentPage`
  const computedCurrentPage = (() => {
    if (propCurrentPage) return propCurrentPage;
    const parts = location.pathname.split("/").filter(Boolean);
    // expect ['/provider', 'dashboard'] -> parts[0] === 'provider', parts[1] === 'dashboard'
    const segment = parts[1] || parts[0] || "dashboard";
    return `provider-${segment}`;
  })();

  return (
    <>
      {/* ══════════════ DESKTOP SIDEBAR ══════════════ */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border z-50">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-sidebar-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                SkillHub
              </h1>
              <p className="text-sidebar-foreground/50 text-xs">
                Provider Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = computedCurrentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${active ? "text-white" : ""}`}
                  style={{ height: 18, width: 18 }}
                />
                <span className="text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-red-500 text-white"}`}
                  >
                    {item.badge}
                  </span>
                )}
                {active && (
                  <ChevronRight className="h-3.5 w-3.5 text-white/70" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border/60 space-y-2">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0">
              {providerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs truncate">
                {providerName}
              </p>
              <p className="text-sidebar-foreground/50 text-xs">Provider</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
          </div>

          {/* Dark mode */}
          {onToggleDarkMode !== undefined ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sidebar-accent">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                )}
                <span className="text-sidebar-foreground/70 text-xs">Dark mode</span>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} className="scale-75" />
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sidebar-accent">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                )}
                <span className="text-sidebar-foreground/70 text-xs">Dark mode</span>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} className="scale-75" />
            </div>
          )}

          {/* Switch to user */}
          <button
            onClick={() => handleSwitchToUserMode()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 text-sm"
          >
            <Home style={{ height: 16, width: 16 }} className="shrink-0" />
            Switch to User Mode
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200 text-sm"
          >
            <LogOut style={{ height: 16, width: 16 }} className="shrink-0" />
            Logout
          </button>
        </div>
      </nav>
      {/* ══════════════ MOBILE TOP BAR ══════════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/50 backdrop-blur-2xl border-b border-sidebar-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-md bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                SkillHub
              </h1>
              <p className="text-sidebar-foreground/50 text-xs leading-none mt-0.5">
                Provider
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground">
              <Bell style={{ height: 16, width: 16 }} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              aria-pressed={isDarkMode}
              onClick={onToggleDarkMode}
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className="p-2 relative rounded-lg bg-sidebar-accent cursor-pointer flex items-center text-amber-400 dark:text-blue-500 transition-colors"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <button onClick={() => handleNavigate('provider-profile')} className="relative p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground">
              <User style={{ height: 16, width: 16 }} />
            </button>
          </div>
        </div>
      </div>
      {/* ══════════════ MOBILE BOTTOM NAV ══════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar/50 backdrop-blur-2xl border-t border-sidebar-border/50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = computedCurrentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all duration-200 relative ${
                  active ? "text-blue-500" : "text-sidebar-foreground/50"
                }`}
              >
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                )}
                <Icon style={{ height: 18, width: 18 }} />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="h-1 w-1 rounded-full bg-blue-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Spacers */}
      <div className="lg:hidden h-15" /> {/* top bar spacer */}
    </>
  );
}
