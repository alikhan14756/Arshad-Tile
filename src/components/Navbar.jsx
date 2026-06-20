import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, UserCheck } from 'lucide-react';
import { authManager } from '../firebase/authManager';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = authManager.onAuthChange(setUser);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-xl font-bold leading-tight transition-colors ${
                scrolled ? 'text-primary' : 'text-white'
              }`}>
                Arshad Tiles
              </span>
              <span className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                scrolled ? 'text-gray-500' : 'text-gray-400'
              }`}>
                & Sanitary
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline space-x-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Portfolio', path: '/projects' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-200 ${
                    isActive(link.path)
                      ? 'text-accent after:w-full'
                      : `${scrolled ? 'text-primary' : 'text-white'} hover:text-accent after:w-0 hover:after:w-full`
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="tel:+923411239009" 
                className={`flex items-center gap-2 text-sm font-semibold transition-colors hover:text-accent ${
                  scrolled ? 'text-primary' : 'text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                +92 341 1239009
              </a>

              {user ? (
                <Link 
                  to="/admin" 
                  className="bg-accent text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-accent/90 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/admin/login" 
                  className={`text-xs font-semibold px-3 py-1.5 border border-dashed rounded-lg transition-all ${
                    scrolled 
                      ? 'border-accent text-accent hover:bg-accent hover:text-primary' 
                      : 'border-white text-white hover:bg-white/20'
                  }`}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-all ${
              scrolled 
                ? 'bg-white text-gray-900 border border-gray-200' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-y-0 right-0 w-[280px] max-w-[90vw] bg-white shadow-2xl p-6 transition-transform duration-300 z-[60] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-900"
        >
          <X size={28} />
        </button>

        <div className="mt-12 flex flex-col gap-6 text-gray-900">
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'Portfolio', path: '/projects' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold py-2 border-b border-gray-100 hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-6 space-y-4">
            <a href="tel:+923411239009" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-accent">
              <Phone className="text-accent" /> +92 341 1239009
            </a>

            {user ? (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block bg-accent text-primary py-3 rounded-xl text-center font-bold">
                Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block border border-accent text-accent py-3 rounded-xl text-center font-bold hover:bg-accent hover:text-primary">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
