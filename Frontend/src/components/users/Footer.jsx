import React from 'react';
import { Mail, Phone, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUI } from '../../contexts/ui-context';

export default function Footer() {
  const { setIsAuthPanelOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.user);
  return (
    <footer className="pt-8 pb-25 md:pb-8 px-6 border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1 cursor-pointer group" onClick={() => { if (location.pathname !== '/') navigate('/'); }}>
              <img
              className="w-15 -mr-2 rounded-full transition-all duration-200 group-hover:scale-105"
              src="https://res.cloudinary.com/drivnx6ia/image/upload/v1771413526/ChatGPT-removebg-preview_dbpqrl.png"
              alt=""
            />
            <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
              SkillHub
            </h1>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Empowering local talent and connecting communities through skilled services. The most trusted platform for professional help.
            </p>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-secondary/50 hover:bg-(--primary-gradient-start) hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-secondary/50 hover:bg-(--primary-gradient-start) hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-secondary/50 hover:bg-(--primary-gradient-start) hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-secondary/50 hover:bg-(--primary-gradient-start) hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* For Customers */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">For Customers</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/how-it-works') navigate('/how-it-works'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  How it works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => isAuthenticated ? (location.pathname !== '/search' && navigate('/search')) : setIsAuthPanelOpen(true)}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Browse services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/safety') navigate('/safety'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Safety & Trust
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/guarantee') navigate('/guarantee'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  SkillHub Guarantee
                </button>
              </li>
            </ul>
          </div>
          
          {/* For Providers */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">For Providers</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => isAuthenticated ? (location.pathname !== '/profile' && navigate('/profile')) : setIsAuthPanelOpen(true)}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Become a provider
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/success-stories') navigate('/success-stories'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Provider success stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/guidelines') navigate('/guidelines'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Community guidelines
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support & Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-(--primary-gradient-start)" />
                <span className="text-base">support@skillhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-(--primary-gradient-start)" />
                <span className="text-base">+1 (555) 000-0000</span>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/help') navigate('/help'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (location.pathname !== '/privacy') navigate('/privacy'); }}
                  className="text-muted-foreground hover:text-(--primary-gradient-start) transition-colors text-base cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-2 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
          <p className="text-sm font-medium">
            &copy; 2026 SkillHub Technologies Inc. All rights reserved.
          </p>
            <div className="flex gap-8 text-sm">
            <button onClick={() => { if (location.pathname !== '/terms') navigate('/terms'); }} className="hover:text-foreground transition-colors">Terms of Service</button>
            <button onClick={() => { if (location.pathname !== '/cookie') navigate('/cookie'); }} className="hover:text-foreground transition-colors">Cookie Policy</button>
            <button onClick={() => { if (location.pathname !== '/accessibility') navigate('/accessibility'); }} className="hover:text-foreground transition-colors">Accessibility</button>
          </div>
        </div>
      </div>
    </footer>
  );
}