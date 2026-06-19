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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = authManager.onAuthChange((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black shadow-md py-3 md:bg-white/95 md:backdrop-blur-sm' : 'bg-black py-5 md:bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-tight text-white md:text-primary">Arshad Tiles</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 md:text-gray-500">& Sanitary</span>
              </div>
            </Link>
          </div>

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
                      : 'text-primary hover:text-accent after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a href="tel:+923411239009" className="flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent">
                <Phone className="w-4 h-4" />
                +92 341 1239009
              </a>
              {user ? (
                <Link to="/admin" className="btn btn-primary flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-accent-dark transition-all shadow-md shadow-accent/20">
                  <UserCheck className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin/login" className="text-xs font-semibold px-3 py-1.5 border border-dashed rounded-lg text-accent border-accent hover:bg-accent/10 transition-all">
                  Admin Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-white/20 bg-black text-white shadow-md transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black z-50"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-y-0 right-0 w-[min(18rem,100vw)] bg-black shadow-2xl p-6 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-[60] border-l border-white/10`}>
        <div className="flex justify-end items-center mb-8">
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-accent p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
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
              className="text-base font-semibold py-1 border-b border-white/10 drawer-link"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 flex flex-col gap-4">
            <a href="tel:+923411239009" className="flex items-center gap-2 text-white font-medium hover:text-accent">
              <Phone className="w-4 h-4 text-accent" />
              +92 341 1239009
            </a>
            {user ? (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-accent text-primary px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                <UserCheck className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="border border-accent text-accent px-4 py-2 rounded-xl text-center font-bold hover:bg-accent hover:text-primary transition-all">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
