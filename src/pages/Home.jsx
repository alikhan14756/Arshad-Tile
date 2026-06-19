import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, MapPin, Phone, Clock, BadgeCheck } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';
import SEO from '../components/SEO';

const brandLogos = [
  { name: 'Master Tiles', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' },
  { name: 'Shabbir Tiles', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' },
  { name: 'Stile', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' },
  { name: 'Porta', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' },
  { name: 'Sonex', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' },
  { name: 'Faisal Sanitary', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop' }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProds = await dataManager.getProducts();
        setFeaturedProducts(allProds.filter(p => p.featured).slice(0, 4));

        const allProjects = await dataManager.getProjects();
        setProjects(allProjects.slice(0, 3));

        const allReviews = await dataManager.getReviews();
        setReviews(allReviews.filter(r => r.approved).slice(0, 3));
      } catch (e) {
        console.error("Error fetching homepage data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-primary text-white overflow-hidden pt-24">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&auto=format&fit=crop" 
            alt="Modern Showroom" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent text-primary mb-6 shadow-md shadow-accent/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Since 2012
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium Tiles & <br />
              <span className="text-accent">Sanitary Solutions</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              Transform your spaces with our high-end tile collections, premium sanitary ware, and waterproof PVC panels. 12+ years of design excellence serving Shabqadar Bazar and surrounding areas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn bg-accent text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent-dark transition-all flex items-center gap-2 shadow-lg shadow-accent/20">
                Explore Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn border border-white hover:bg-white hover:text-primary transition-all px-8 py-3.5 rounded-xl font-bold">
                Visit Showroom
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10 w-full max-w-md">
              <div>
                <h4 className="text-2xl sm:text-3xl font-bold text-accent">12+</h4>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Years Experience</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-bold text-accent">5k+</h4>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Happy Homes</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-bold text-accent">1000+</h4>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Designs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8 opacity-60 hover:opacity-85 transition-opacity duration-300">
            {brandLogos.map((brand, i) => (
              <span key={i} className="text-sm font-serif font-black tracking-wider uppercase text-primary">
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Business Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop" 
                alt="Showroom display" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10"></div>
            </div>
            {/* Overlay Experience Badge */}
            <div className="absolute -bottom-6 -right-6 bg-accent text-primary p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center max-w-[150px]">
              <span className="text-4xl font-extrabold leading-none">12+</span>
              <span className="text-[10px] font-bold text-center uppercase tracking-wide mt-2">Years of Showroom Excellence</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Our Story</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-6">
              Complete Home Tiles & Sanitary Fittings Under One Roof
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Located in the heart of Shabqadar Bazar, Arshad Tiles & Sanitary has been the trusted supplier of premium construction finishes since 2012. We carry everything from elegant double-loaded porcelain tiles to premium concept wall cladding, bathroom toilets, and state-of-the-art PVC wall panels.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We specialize in assisting homeowners, architects, and building contractors in identifying exactly the materials they need. We help compute accurate box coverages to prevent excess inventory costs and organize swift delivery directly to your building site.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[
                { title: 'Top Brands', desc: 'Direct distributor pricing from Master, Shabbir, Porta, and Stile.' },
                { title: 'Wide Selection', desc: 'Over 1000 sizes, colors, and finishes to browse.' },
                { title: 'Exact Estimates', desc: 'Free computation of pieces/box coverage limits.' },
                { title: 'Reliable Delivery', desc: 'Site transport organized throughout Shabqadar & Peshawar.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent-dark mt-1 flex-shrink-0">
                    <Star className="w-3 h-3 fill-accent-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Curated Collection</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Featured Products</h2>
            </div>
            <Link to="/products" className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1.5 transition-colors mt-3 sm:mt-0">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((prod) => (
                <Link to={`/products/${prod.slug}`} key={prod.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {prod.brand}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow text-left">
                    <span className="text-[10px] uppercase font-bold text-accent-dark mb-1">{prod.category}</span>
                    <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors line-clamp-1 mb-2">{prod.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                      <div>
                        <span className="block font-semibold text-gray-400 text-[9px] uppercase">Size</span>
                        <span className="font-medium text-gray-700">{prod.size}</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-400 text-[9px] uppercase">Finish</span>
                        <span className="font-medium text-gray-700">{prod.finish}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No featured products found.</p>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Product Ranges</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">Browse by Categories</h2>
            <p className="text-sm text-gray-500">Discover premium selections optimized for structural integrity and visual aesthetics.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Wall Tiles', img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&auto=format&fit=crop' },
              { name: 'Floor Tiles', img: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&auto=format&fit=crop' },
              { name: 'Sanitary Ware', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop' },
              { name: 'Wall Panels', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop' }
            ].map((cat, i) => (
              <Link 
                to={`/products?category=${encodeURIComponent(cat.name)}`} 
                key={i} 
                className="aspect-square rounded-3xl overflow-hidden relative group shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex items-end p-6">
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-white mb-1">{cat.name}</h3>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Browse Range <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Projects Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Our Portfolio</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Completed Projects</h2>
            </div>
            <Link to="/projects" className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1.5 transition-colors mt-3 sm:mt-0">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md flex flex-col">
                  <div className="aspect-[3/2] w-full overflow-hidden bg-gray-100">
                    <img 
                      src={proj.afterImages[0]} 
                      alt={proj.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-accent-dark mb-1">
                      {proj.customerType} - {proj.area}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-primary mb-2">{proj.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{proj.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>{proj.location}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Default fallback if no project uploaded
              <div className="col-span-3 text-center text-gray-500 py-12">
                No recent portfolio projects found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Testimonials</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">Client Feedback</h2>
            <p className="text-sm text-gray-500">Real customer ratings regarding product durability and showroom services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50 p-8 rounded-3xl border border-gray-100 relative text-left flex flex-col justify-between">
                  <div>
                    <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed mb-6">"{rev.text}"</p>
                  </div>
                  <div className="border-t border-gray-200/50 pt-4 mt-auto">
                    <h4 className="font-bold text-primary text-sm">{rev.author}</h4>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Homeowner</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-8">No customer reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Showroom & Map Section */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Showroom Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Visit Showroom</span>
                <h2 className="font-serif text-3xl font-bold text-primary mb-4">Arshad Tiles & Sanitary</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Come explore our premium tiles and sanitary wear displays in person. Conveniently located on the main road in Shabqadar Bazar.
                </p>
              </div>

              <div className="flex flex-col gap-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">Location</h4>
                    <p className="text-xs text-gray-500 mt-1">Main Shabqadar Bazar, Near Flying Coach Adda, Shabqadar, KP, Pakistan</p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">Working Hours</h4>
                    <p className="text-xs text-gray-500 mt-1">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">Contact Number</h4>
                    <a href="tel:+923411239009" className="text-xs text-accent-dark hover:underline font-bold mt-1 block">+92 341 1239009</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="lg:col-span-7 h-96 lg:h-auto min-h-[350px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative">
              <iframe
                title="Arshad Tiles Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.26123456789!2d71.5543210!3d34.2187654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCDE0nMDcuNiJOIDcxwrAzMycxNS42IkU!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Have an upcoming construction project?</h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Get in touch with us today for a free price calculation, custom color matching advice, or distributor discount packages.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/contact" className="btn bg-accent text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent-dark transition-all">
              Request Quote
            </Link>
            <a href="https://wa.me/923411239009" target="_blank" rel="noopener noreferrer" className="btn border border-white hover:bg-white hover:text-primary transition-all px-8 py-3.5 rounded-xl font-bold flex items-center gap-2">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
      </section>
    </div>
  );
}
