import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-gray-300 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-tight text-white">Arshad Tiles</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">& Sanitary</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted showroom for premium tiles, luxury sanitary ware, and waterproof PVC panels in Shabqadar since 2012. Providing quality and durability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Portfolio', path: '/projects' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-accent transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3.5 h-3.5 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6">Our Categories</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/products?category=Wall+Tiles" className="hover:text-accent transition-colors">Wall Tiles</Link></li>
              <li><Link to="/products?category=Floor+Tiles" className="hover:text-accent transition-colors">Floor Tiles</Link></li>
              <li><Link to="/products?category=Sanitary+Ware" className="hover:text-accent transition-colors">Sanitary Ware</Link></li>
              <li><Link to="/products?category=Wall+Panels" className="hover:text-accent transition-colors">PVC Wall Panels</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6">Contact Info</h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Main Shabqadar Bazar,<br />Near Flying Coach Adda, Shabqadar</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+923411239009" className="hover:text-accent transition-colors">+92 341 1239009</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {currentYear} Arshad Tiles & Sanitary. All rights reserved.</p>
          <p>Designed with care for Shabqadar & surrounding areas.</p>
        </div>
      </div>
    </footer>
  );
}
