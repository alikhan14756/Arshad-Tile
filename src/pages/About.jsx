import React from 'react';
import { Star, ShieldCheck, BadgePercent, Construction, Palette, Ruler } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <SEO 
        title="About Us" 
        description="Learn more about Arshad Tiles & Sanitary. Your trusted partner for premium construction finishes in Shabqadar since 2012."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-left mb-12 border-b border-gray-200/50 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Who We Are</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">About Arshad Tiles</h1>
          <p className="text-sm text-gray-500 mt-2">Providing high-grade tile, sanitary ware, and PVC panel finishes since 2012.</p>
        </div>

        {/* Brand Promise Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-gray-150">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop" 
                alt="Showroom display tiles" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stamp Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center max-w-[140px]">
              <span className="text-3xl font-extrabold text-accent">100%</span>
              <span className="text-[9px] font-bold text-center uppercase tracking-wide mt-2">Genuine Factory Stock</span>
            </div>
          </div>

          <div className="lg:col-span-7 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6">
              Our Dedication to High-Quality Tiling Finish
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Founded in 2012 in the main Shabqadar Bazar near Flying Coach Adda, Arshad Tiles & Sanitary was established to serve a key local market need: providing premium-grade construction and renovation finishes without retail inflating practices. Over the past 12+ years, we have grown to stock more than 1000 concepts in wall tiles, floor vitrified porcelain, sanitary closets, and ceiling PVC claddings.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
              We source directly from licensed brand depots, guaranteeing that the materials you build with meet correct structural specifications for moisture resistance, load capability, and long-lasting glaze shine.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col gap-1.5">
                <ShieldCheck className="w-6 h-6 text-accent-dark" />
                <h4 className="font-bold text-primary text-sm">Quality Assurance</h4>
                <p className="text-xs text-gray-500">Every box is factory packed with verified grade credentials.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <BadgePercent className="w-6 h-6 text-accent-dark" />
                <h4 className="font-bold text-primary text-sm">Direct Pricing</h4>
                <p className="text-xs text-gray-500">Competitive wholesale and distributor pricing models.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Star className="w-6 h-6 text-accent-dark" />
                <h4 className="font-bold text-primary text-sm">12+ Years Trust</h4>
                <p className="text-xs text-gray-500">Proven track record of local home building contracts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Services Section */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-8 sm:p-12 mb-20 text-left">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-1">Our Expertise</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary">Showroom Services</h3>
            <p className="text-xs text-gray-400 mt-2">Beyond catalog sales, we offer technical assistance to optimize your projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Palette className="w-6 h-6 text-primary" />, 
                title: 'Concept & Design Planning', 
                desc: 'Bring your room measurements, and our design consultants will help organize corresponding wall combinations, borders, and matching floor tiles.' 
              },
              { 
                icon: <Ruler className="w-6 h-6 text-primary" />, 
                title: 'Quantity Computations', 
                desc: 'Unsure how many boxes or panels you need? We calculate accurate square footage, account for standard cutting waste (5-10%), and estimate pieces.' 
              },
              { 
                icon: <Construction className="w-6 h-6 text-primary" />, 
                title: 'Installer Referrals', 
                desc: 'Tiling requires skilled labor. We maintain a verified roster of local masonry experts in Shabqadar to recommend for your installation.' 
              }
            ].map((srv, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-gray-200/50 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-md shadow-accent/15">
                  {srv.icon}
                </div>
                <h4 className="font-serif font-bold text-primary text-base">{srv.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showroom Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-primary text-white p-8 rounded-3xl">
            <h3 className="font-serif text-xl font-bold text-accent mb-4">Our Mission</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Our mission is to make high-quality home finishes accessible to families and builders in Shabqadar, Charsadda, and surrounding Peshawar boundaries. We believe that durability and premium design do not have to carry excessive premium prices.
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-3xl">
            <h3 className="font-serif text-xl font-bold text-primary mb-4">The Quality Promise</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We pledge to never sell mixed-grade stock or seconds as premium tile sets. Every category we sell — whether wall panels, porcelain floor tile, or bathroom sanitary suites — comes with verified brand box authenticity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
