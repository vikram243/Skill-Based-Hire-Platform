/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  MapPin,
  Search,
  Navigation as GpsIcon,
  Check,
  Loader2,
  ChevronRight,
  Globe,
  Compass
} from 'lucide-react';
import api from '../../lib/axiosSetup';
import { useDispatch } from 'react-redux';
import { updateLocation } from '../../slices/userSlice';

export function LocationPickerPanel({
  isOpen,
  onClose,
  onLocationSelect,
  currentLocation = 'Current Location'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [, setUserCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [panelError, setPanelError] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = React.useRef(null)
  const dispatch = useDispatch();

  const resolveAddress = async (address) => {
    if (!address) return;
    setIsLoading(true);
    setPanelError('');
    try {
      const res = await api.get('/api/maps/coordinates', { params: { address } });
      const info = res?.data?.data;
      const display = info?.address || address;
      setSearchQuery(display);
      try {
        dispatch(updateLocation({
          source: 'search',
          pin: info?.pin || '',
          address: info?.address || display,
          city: info?.city || '',
          state: info?.state || '',
          lat: info?.lat || null,
          lon: info?.lng || null
        }));
      } catch (e) { /* empty */ }
      onLocationSelect(display);
      onClose();
    } catch (err) {
      console.error('Failed to resolve address', err);
      setPanelError(err?.response?.data?.message || err?.message || 'Failed to resolve address');
      setTimeout(() => setPanelError(''), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  const resolveByLatLng = async (lat, lng) => {
    setIsLoading(true);
    setPanelError('');
    try {
      const res = await api.get('/api/maps/reverse', { params: { lat, lng } });
      const info = res?.data?.data;
      const display = info?.address || `${lat}, ${lng}`;
      setSearchQuery(display);
      try {
        dispatch(updateLocation({
          source: 'gps',
          pin: info?.pin || '',
          address: info?.address || display,
          city: info?.city || '',
          state: info?.state || '',
          lat: info?.lat || Number(lat),
          lon: info?.lng || Number(lng)
        }));
      } catch (e) { /* empty */ }
      onLocationSelect(display);
      onClose();
    } catch (err) {
      console.error('Failed to reverse geocode', err);
      setPanelError(err?.response?.data?.message || err?.message || 'Failed to get location from coordinates');
      setTimeout(() => setPanelError(''), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    setPanelError('')
    try {
      const res = await api.get('/api/maps/suggestions', { params: { input } });
      const payload = res?.data?.data ?? [];
      setSuggestions(payload);
      setActiveIndex(-1);
      setPanelError('');
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions', error?.response?.data?.message, error?.message);
      setSuggestions([]);
      setShowSuggestions(false);
      setPanelError(error?.response?.data?.message || error?.message || 'Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      fetchSuggestions(searchQuery.trim());
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  const popularCities = [
    {
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462011'
    },
    {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    {
      city: 'Delhi',
      state: 'NCR',
      pincode: '110001'
    },
    {
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    {
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001'
    },
    {
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    }
  ];

  const handleEnableGps = () => {
    setIsLocating(true);

    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoords({ lat: latitude, lng: longitude });
            setIsLocating(false);
            setShowMap(true);
            resolveByLatLng(latitude, longitude);
          },
          (error) => {
            console.error(error);
            setIsLocating(false);
            setPanelError('Allow the location access');
            setTimeout(() => setPanelError(''), 4000);
          }
        );
      } else {
        setIsLocating(false);
        setPanelError('Geolocation not supported in this browser.');
        setTimeout(() => setPanelError(''), 4000);
      }
    }, 1500);
  };

  const handleSearch = (cityObj) => {
    const fullAddress = `${cityObj.pincode}, ${cityObj.city}, ${cityObj.state}`;
    resolveAddress(fullAddress);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl backdrop-blur-2xl bg-linear-to-br from-card/95 to-blue-50/30 dark:to-blue-950/20 border-2 border-blue-200/40 dark:border-blue-800/40 shadow-2xl p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <DialogHeader className="px-6 pt-8 pb-4">
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            Set Your Location
          </DialogTitle>
          <DialogDescription className="text-base">
            Find services and providers near you by setting your current area.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-8 space-y-6">
          {/* Search Box */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search for your city, area or pincode..."
              className="pl-12 pr-4 h-14 bg-blue-50/50 dark:bg-blue-950/20 border-2 border-transparent focus:border-blue-500/50 focus:ring-0 transition-all rounded-2xl text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={inputRef}
              onMouseEnter={() => {
                setShowSuggestions(true);
              }}
              onMouseLeave={() => {
                setShowSuggestions(false);
              }}
            />
            {/* Suggestions dropdown */}
            {(showSuggestions || isLoading) && (
              <div onMouseEnter={() => setShowSuggestions(true)} onMouseLeave={() => setShowSuggestions(false)} className="absolute left-0 border-t-blue-500 right-0 z-40 bg-white dark:bg-slate-800 border border-border rounded-xl shadow-2xl overflow-hidden">
                {isLoading ? (
                  <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                  </div>
                ) : (
                  <div className="max-h-64 overflow-auto">
                    {suggestions.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">No suggestions</div>
                    ) : (
                      suggestions.map((s, idx) => (
                        <button
                          key={s.place_id || s.description}
                          onMouseDown={(ev) => {
                            // prevent input blur before click
                            ev.preventDefault();
                            resolveAddress(s.description);
                            setActiveIndex(-1);
                            setShowSuggestions(false);
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`w-full text-left p-3 transition-colors ${idx === activeIndex ? 'bg-blue-50 dark:bg-slate-900/30' : 'hover:bg-blue-50 dark:hover:bg-slate-900/20'}`}
                        >
                          <div className="font-medium text-sm">{s.description}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel error / message area */}
          {panelError && (
            <div className="mt-3 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700">
              {panelError}
            </div>
          )}

          {!showMap ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={handleEnableGps}
                disabled={isLocating}
                className="w-full h-16 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-3 text-lg font-semibold group"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Locating you...
                  </>
                ) : (
                  <>
                    <GpsIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Use Current Location (GPS)
                  </>
                )}
              </Button>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                  <Globe className="w-4 h-4" />
                  Popular Cities
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {popularCities.map((city) => (
                    <button
                      key={city.pincode}
                      onClick={() => handleSearch(city)}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 group-hover:scale-110 transition-transform">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">
                          {city.city}, {city.state}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in zoom-in-95 fade-in duration-500">
              {/* Map UI untouched */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 shadow-inner bg-slate-100 dark:bg-slate-900">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(#3b82f6 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="absolute w-16 h-16 bg-blue-500/30 rounded-full animate-pulse" />
                  <div className="relative w-8 h-8 bg-blue-600 rounded-full border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 p-3 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 rounded-xl border border-white/50 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-blue-600 dark:text-blue-400">
                    <Compass className="w-3 h-3 animate-spin-slow" />
                    GPS Signal Active
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border--800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                      Detected Location
                    </p>
                    <p className="font-bold text-blue-900 dark:text-blue-100">
                      {currentLocation}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg h-9"
                >
                  Confirm
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setShowMap(false);
                  setUserCoords(null);
                }}
                className="w-full text-sm text-muted-foreground hover:text-blue-600"
              >
                Change location manually
              </Button>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-border flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <Check className="w-3 h-3 text-green-500" />
            Verified Areas
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <Check className="w-3 h-3 text-green-500" />
            24/7 Support
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <Check className="w-3 h-3 text-green-500" />
            Secure Access
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
