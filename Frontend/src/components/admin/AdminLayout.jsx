import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Package,
  Star,
  Activity,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { useUI } from '../../contexts/ui-context';
import { logoutUser } from '../../slices/userSlice';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useUI();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Providers', to: '/admin/providers', icon: ShieldCheck, badge: 'Verification' },
    { label: 'Services', to: '/admin/services', icon: Layers },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Orders', to: '/admin/orders', icon: Package },
    { label: 'Reviews', to: '/admin/reviews', icon: Star },
    { label: 'Activity Logs', to: '/admin/activities', icon: Activity },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(logoutUser());
    toast.info('Logged out from Admin Panel');
    navigate('/admin-login');
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => location.pathname === item.to);
    return current ? current.label : 'Admin Console';
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">SkillHub</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block -mt-1">
                Admin Control
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
            PRO
          </Badge>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Shortcuts
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Go to Marketplace</span>
          </a>
        </div>

        {/* Bottom Profile & Theme */}
        <div className="p-3 border-t border-border bg-card/40">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-foreground">
                  {user?.fullName || 'Super Admin'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 justify-start"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Logout Admin
          </Button>
        </div>
      </aside>

      {/* ── Main Container ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline">Admin</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:inline" />
              <span className="font-semibold text-foreground">{getPageTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Platform System
            </div>
            <a
              href="/"
              className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Marketplace
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-md pt-16">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
