import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, Search, MapPin, Users, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Buy', href: '/listings?type=Sale' },
  { label: 'Rent', href: '/listings?type=Rent' },
  { label: 'Shortlet', href: '/listings?type=Shortlet' },
  { label: 'Agents', href: '/agents' },
  { label: 'Area Scores', href: '/areas' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800';
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-brand-800';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHome && !scrolled ? 'bg-white/20' : 'bg-brand-700'}`}>
                <Home size={16} className="text-white" />
              </div>
              <span className={`font-display font-semibold text-xl tracking-tight ${logoColor}`}>
                Nest<span className={isHome && !scrolled ? 'text-amber-400' : 'text-amber-500'}>Haven</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${textColor}
                    ${isHome && !scrolled
                      ? 'hover:bg-white/10'
                      : 'hover:bg-gray-100 hover:text-brand-700'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/listings"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${textColor}
                  ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <Search size={15} />
                Search
              </Link>
              <Link
                to="/list-property"
                className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                List Property
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden p-2 rounded-lg ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 mt-2 space-y-2">
                <Link
                  to="/listings"
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Search size={16} /> Search Properties
                </Link>
                <Link
                  to="/list-property"
                  className="flex items-center justify-center w-full px-4 py-3 bg-brand-700 text-white rounded-xl font-semibold"
                >
                  List Your Property
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
