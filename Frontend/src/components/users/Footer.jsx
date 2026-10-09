import React from 'react';
import { Mail, Phone, Instagram, Twitter, Facebook, Youtube, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="pt-12 pb-24 md:pb-10 px-4 sm:px-6 border-t border-border bg-card/40 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="font-extrabold text-lg">S</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                SkillHub
              </span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm">
              The premier hyperlocal marketplace connecting households and companies with vetted, background-checked skilled service specialists. Fully guaranteed with escrow protection.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-secondary/60 hover:bg-primary hover:text-white transition-all text-muted-foreground">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-secondary/60 hover:bg-primary hover:text-white transition-all text-muted-foreground">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-secondary/60 hover:bg-primary hover:text-white transition-all text-muted-foreground">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-secondary/60 hover:bg-primary hover:text-white transition-all text-muted-foreground">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Marketplace Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Explore Services</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  All Service Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">
                  Find Local Specialists
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  How SkillHub Works
                </Link>
              </li>
              <li>
                <Link to="/guarantee" className="hover:text-primary transition-colors">
                  $50,000 Guarantee
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-primary transition-colors">
                  Trust & Safety Standards
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company & Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About SkillHub
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Skilled Service Journal
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-primary transition-colors">
                  Provider Success Stories
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-primary transition-colors">
                  Insurance Coverage
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Help & Legal</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors font-medium text-foreground">
                  Contact Support 24/7
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ & Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-primary transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Credits */}
        <div className="border-t border-border/60 pt-6 mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SkillHub Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/cookie" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="hover:text-foreground transition-colors">Accessibility</Link>
            <Link to="/admin-login" className="hover:text-foreground transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}