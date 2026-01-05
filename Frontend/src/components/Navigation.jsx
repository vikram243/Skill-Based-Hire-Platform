import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import logo from '../assets/logo.png';

import {
  Search,
  Home,
  MessageCircle,
  FileText,
  User,
  Map,
  MapPin,
  Menu,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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


const Navigation = () => {
  return (
    <>
      <div className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60'>
        <div className='container flex h-18 items-center justify-between px-4 mx-auto py-3'>
          <div className='flex items-center cursor-pointer group'>
            <img src={logo} alt="logo" className='max-w-[35px] max-h-[35px]' />
            <h1 className="font-bold! text-xl! bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
              killHub
            </h1>
          </div>

          <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
            <div className='flex w-full gap-3'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-4 border-2 border-border/60 hover:border-(--primary-gradient-start) transition-all duration-200 min-w-[180px] justify-between"
                  >
                    <div className='flex items-center gap-2'>
                      <MapPin className="w-4 h-4 text-(--primary-gradient-start)" />
                      <span className="text-sm truncate max-w-[120px]">{ }</span>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-[200px] border-2 border-border/60'>
                  {locations.map((location) => (
                    <DropdownMenuItem
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className=''
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {location}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className='flex-1 relative group'>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search skills or services..."
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch?.();
                    // Let the global Cmd+K handler take care of opening command palette
                  }}
                  className="pl-12 pr-16 h-11 bg-input-background border-2 border-border/60 shadow-sm focus:shadow-md focus:border-[var(--primary-gradient-start)] transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick=""
                className="h-11 w-11 border-2 hover:border-(--primary-gradient-start) hover:bg-(--primary-gradient-start)/10 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className='hidden md:flex items-center gap-4'>
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
            <Button variant="ghost" onClick={() => onNavigate('chat')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Avatar className="w-8 h-8 cursor-pointer" onClick={() => onNavigate('profile')}>
              <AvatarImage src="" alt="" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className='md:hidden px-6 pb-4'>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills or services"
                className="pl-10 bg-input-background"
              />
            </div>
            <Button
              variant="outline"
              size="icon"

            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t'>
        <div className='flex justify-around items-center py-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            // const isActive = currentPage === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                // className={
                //   `flex flex-col items-center gap-1 h-auto py-2 px-3 ${isActive ? 'text-(--primary-gradient-start)' : 'text-muted-foreground'
                //   }`
                // }
                >
                {
                  (Icon && <Icon className='w-5 h-5'/>)
                }
                <span className="text-xs">{item.label}</span>
                
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Navigation;