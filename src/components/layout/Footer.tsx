import React from 'react';
import { Link } from 'react-router';
import { Home, Phone, Mail, MapPin, Shield, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  Properties: [
    { label: 'Buy a Home', href: '/listings?type=Sale' },
    { label: 'Rent a Home', href: '/listings?type=Rent' },
    { label: 'Shortlet', href: '/listings?type=Shortlet' },
    { label: 'New Developments', href: '/listings?tag=new' },
    { label: 'Commercial', href: '/listings?tag=commercial' },
  ],
  Company: [
    { label: 'About NestHaven', href: '/about' },
    { label: 'Our Agents', href: '/agents' },
    { label: 'Area Intelligence', href: '/areas' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Support: [
    { label: 'Help Centre', href: '/help' },
    { label: 'Anti-Scam Guide', href: '/anti-scam' },
    { label: 'Report a Listing', href: '/report' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white">
      {/* Trust Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-400" />
              Anti-Scam Protected
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-400" />
              Anti-Double-Sell Verified
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-400" />
              Verified Agent Network
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-400" />
              Escrow Protection Available
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <span className="font-display font-semibold text-2xl">
                Nest<span className="text-amber-400">Haven</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-6">
              Nigeria's most trust-focused real estate platform. Find verified properties, connect with agents, and move into your perfect home — safely.
            </p>
            <div className="space-y-3 text-sm text-white/55">
              <a href="tel:+2348012345678" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> +234 801 234 5678
              </a>
              <a href="mailto:hello@nesthaven.ng" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> hello@nesthaven.ng
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> Port Harcourt, Nigeria
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-brand-700 hover:text-white transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35">
          <p>© 2026 NestHaven. All rights reserved. Built with care in Port Harcourt, Nigeria.</p>
          <p>Protecting Nigerian homebuyers since 2024.</p>
        </div>
      </div>
    </footer>
  );
}
