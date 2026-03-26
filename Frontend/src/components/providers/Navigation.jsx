import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUI } from '../../contexts/ui-context';
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
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { mockAuth } from '../../data/authMockData';
import api from '../../lib/axiosSetup';
import { useDispatch } from 'react-redux';
import { setProviderMode } from '../../slices/userSlice.js';
import { toast } from '../ui/toast-sonner.jsx';
export default function ProviderNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [providerName, setProviderName] = useState('Provider');
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useUI();

  useEffect(() => {
    fetchProviderInfo();
  }, []);

  const fetchProviderInfo = async () => {
    try {
      const { user } = await mockAuth.getUser();
      if (user?.name) {
        setProviderName(user.name);
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/users/logout");
      if (res.status === 200) {
        try { delete api.defaults.headers.common.Authorization } catch (e) {}
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const dispatch = useDispatch();

  const handleSwitchToUserMode = async () => {
    try {
      const resp = await api.post('/api/users/provider-mode/off');
      const enabled = Boolean(resp?.data?.data?.isProviderMode);

      if (enabled) {
        const msg = 'Unable to switch to user mode';
        toast.error(msg);
        return;
      }

      dispatch(setProviderMode(false));
      toast.success('Switched to user mode');
      navigate('/');
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Switch failed';
      toast.error(msg);
    }
  };

  const navItems = [
    { id: 'provider-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'provider-orders', label: 'Orders', icon: ShoppingBag },
    { id: 'provider-history', label: 'History', icon: History },
    { id: 'provider-analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'provider-reviews', label: 'Reviews', icon: Star },
    { id: 'provider-profile', label: 'Profile', icon: User },
  ];

  const handleNavigate = (id) => {
    switch (id) {
      case 'provider-dashboard':
        navigate('/provider/dashboard');
        break;
      case 'provider-orders':
        navigate('/provider/orders');
        break;
      case 'provider-history':
        navigate('/provider/history');
        break;
      case 'provider-analytics':
        navigate('/provider/analytics');
        break;
      case 'provider-reviews':
        navigate('/provider/reviews');
        break;
      case 'provider-profile':
        navigate('/provider/profile');
        break;
      case 'home':
        navigate('/');
        break;
      default:
        break;
    }
  };

  const currentPage = (() => {
    const p = location.pathname.replace('/provider/', 'provider-');
    if (p === '/provider' || p === '/provider/') return 'provider-dashboard';
    return p.replace('/', '');
  })();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border p-6 z-50">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-sidebar-foreground text-2xl">SkillHub</h1>
            <p className="text-sidebar-foreground/70 text-sm">Provider Panel</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active
                    ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-(--shadow-mid)'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="bg-sidebar-accent rounded-xl p-4 border border-sidebar-border">
            <p className="text-sidebar-foreground/60 text-xs mb-1">Logged in as</p>
            <p className="text-sidebar-foreground text-sm truncate">{providerName}</p>
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-xl border border-sidebar-border">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-sidebar-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-sidebar-foreground" />
              )}
              <span className="text-sidebar-foreground text-sm">Dark mode</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Switch to User Mode */}
          <Button
            onClick={handleSwitchToUserMode}
            variant="outline"
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Switch to User Mode
          </Button>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar/80 backdrop-blur-md border-b border-sidebar-border/50 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-3'>
          <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-sidebar-foreground text-xl">SkillHub</h1>
            <p className="text-sidebar-foreground/60 text-xs">Provider Panel</p>
          </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavigate(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-(--shadow-mid)'
                      : 'text-sidebar-foreground/80 bg-sidebar-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-xl border border-sidebar-border mt-4">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-sidebar-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-sidebar-foreground" />
                )}
                <span className="text-sidebar-foreground text-sm">Dark mode</span>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSwitchToUserMode();
              }}
              variant="outline"
              className="w-full gap-2 mt-4"
            >
              <Home className="h-4 w-4" />
              Switch to User Mode
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Spacer for mobile */}
      <div className="lg:hidden h-20" />
    </>
  );
}
