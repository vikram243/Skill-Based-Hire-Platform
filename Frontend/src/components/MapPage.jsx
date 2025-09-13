import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Badge } from './ui/badge.jsx';
import { Input } from './ui/input.jsx';
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  Navigation as NavigationIcon,
  Layers,
  Filter,
  List
} from 'lucide-react';
import { providers } from '../data/mockData.js';

export function MapPage({ onNavigate, onBack }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState('map');
  const [showList, setShowList] = useState(false);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleProviderClick = (providerId) => {
    onNavigate('skill-detail', { selectedProviderId: providerId });
  };

  const getProviderPosition = (index) => {
    const positions = [
      { top: '25%', left: '30%' },
      { top: '40%', left: '60%' },
      { top: '60%', left: '45%' },
      { top: '35%', left: '75%' },
      { top: '70%', left: '25%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="min-h-screen bg-background relative">
      <header className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <h1 className="font-semibold">Providers Near You</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowList(!showList)}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="absolute top-20 left-4 right-4 z-40">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute top-46 right-4 z-40 space-y-2">
        <Card>
          <CardContent className="p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant={mapView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapView('map')}
              >
                Map
              </Button>
              <Button
                variant={mapView === 'satellite' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapView('satellite')}
              >
                Satellite
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <Button variant="ghost" size="icon">
              <NavigationIcon className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <Button variant="ghost" size="icon">
              <Layers className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="absolute inset-0 pt-16">
        <div
          className={`w-full h-full relative ${
            mapView === 'satellite'
              ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-700'
              : 'bg-gradient-to-br from-blue-100 via-blue-50 to-green-50'
          }`}
        >
          <div className="absolute inset-0">
            {mapView === 'map' ? (
              <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,20 Q25,10 50,20 T100,25 L100,100 L0,100 Z" fill="#e5e7eb" />
                <path d="M0,40 Q30,35 60,40 T100,45 L100,100 L0,100 Z" fill="#f3f4f6" />
                <path d="M10,0 L15,100 M30,0 L35,100 M50,0 L55,100 M70,0 L75,100 M90,0 L95,100" stroke="#d1d5db" strokeWidth="0.5" />
                <path d="M0,15 L100,20 M0,35 L100,40 M0,55 L100,60 M0,75 L100,80" stroke="#d1d5db" strokeWidth="0.5" />
              </svg>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 opacity-60" />
            )}
          </div>

          {filteredProviders.map((provider, index) => {
            const position = getProviderPosition(index);
            return (
              <div
                key={provider.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                style={{ top: position.top, left: position.left }}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <div
                  className={`relative ${
                    selectedProvider === provider.id ? 'scale-125' : 'hover:scale-110'
                  } transition-transform`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-[var(--primary-gradient-start)] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">${provider.pricePerHour}</span>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--primary-gradient-start)]" />
                  </div>

                  {selectedProvider === provider.id && (
                    <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={provider.avatar} alt={provider.name} />
                            <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{provider.name}</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {provider.skills.slice(0, 2).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{provider.rating}</span>
                                <span className="text-muted-foreground">({provider.reviewCount})</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{provider.distance}mi</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                              <div className="font-bold">${provider.pricePerHour}/hr</div>
                              <Button
                                size="sm"
                                onClick={() => handleProviderClick(provider.id)}
                                className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showList && (
        <div className="absolute bottom-0 left-0 right-0 z-41 bg-background border-t max-h-80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Providers ({filteredProviders.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowList(false)}
              >
                Hide List
              </Button>
            </div>

            <div className="space-y-3">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProviderClick(provider.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{provider.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{provider.rating}</span>
                          </div>
                          <span></span>
                          <span>{provider.distance}mi away</span>
                          <span></span>
                          <span>${provider.pricePerHour}/hr</span>
                        </div>
                      </div>

                      {provider.isAvailable && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Available
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-40">
        <Card>
          <CardContent className="p-3">
            <div className="text-sm">
              <span className="font-medium">{filteredProviders.length}</span>
              <span className="text-muted-foreground"> providers nearby</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
