import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, X, Info } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';
import SEO from '../components/SEO';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProds = await dataManager.getProducts();
        setProducts(allProds);

        const allCats = await dataManager.getCategories();
        setCategories(allCats);
      } catch (e) {
        console.error("Error fetching product page data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update category if query param changes
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Derived filter options from products list
  const sizes = ['All', ...new Set(products.map(p => p.size).filter(Boolean))];
  const finishes = ['All', ...new Set(products.map(p => p.finish).filter(Boolean))];
  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))];
  const statuses = ['All', ...new Set(products.map(p => p.status).filter(Boolean))];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'All' || product.size === selectedSize;
    const matchesFinish = selectedFinish === 'All' || product.finish === selectedFinish;
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesSize && matchesFinish && matchesBrand && matchesStatus;
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedFinish('All');
    setSelectedBrand('All');
    setSelectedStatus('All');
    setSearchParams({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited Stock': return 'bg-amber-100 text-amber-800';
      case 'Best Seller': return 'bg-blue-100 text-blue-800';
      case 'New Arrival': return 'bg-purple-100 text-purple-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <SEO 
        title="Product Catalog" 
        description="Browse wall tiles, floor tiles, sanitary fittings, and PVC wall panels at Arshad Tiles."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-left mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Showroom Collections</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-2">Explore 1000+ top designs. Check prices, specifications, and inventory levels.</p>
        </div>

        {/* Search & Filters Action Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-grow w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tiles, brands, color or category (e.g. White Marble)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-primary border border-gray-200 px-5 py-3 rounded-2xl font-bold text-sm w-full md:w-auto md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent-dark" />
              Filters
            </button>
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-red-500 font-bold text-sm px-4 py-3 rounded-2xl border border-dashed border-gray-200 hover:border-red-200 transition-colors w-full md:w-auto flex items-center justify-center gap-1.5"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm text-left">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent-dark" />
                Refine Search
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-gray-700 bg-slate-50"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Brand Partner</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-gray-700 bg-slate-50"
                >
                  {brands.map((brand, i) => (
                    <option key={i} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Dimensions / Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-gray-700 bg-slate-50"
                >
                  {sizes.map((size, i) => (
                    <option key={i} value={size}>{size === 'All' ? 'All Sizes' : size}</option>
                  ))}
                </select>
              </div>

              {/* Finish Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Surface Finish</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-gray-700 bg-slate-50"
                >
                  {finishes.map((finish, i) => (
                    <option key={i} value={finish}>{finish === 'All' ? 'All Finishes' : finish}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Stock Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-gray-700 bg-slate-50"
                >
                  {statuses.map((status, i) => (
                    <option key={i} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Product Cards Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-200/50"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Showing {filteredProducts.length} results
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <Link 
                      to={`/products/${prod.slug}`} 
                      key={prod.id} 
                      className="bg-white rounded-3xl overflow-hidden border border-gray-200/60 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full text-left"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                        <img 
                          src={prod.images && prod.images.length > 0 ? prod.images[0] : '/logo-icon.png'} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-accent text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {prod.brand}
                        </span>
                        <span className={`absolute bottom-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(prod.status)}`}>
                          {prod.status}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-[10px] uppercase font-bold text-accent-dark mb-1">{prod.category}</span>
                        <h3 className="font-serif text-base font-bold text-primary group-hover:text-accent transition-colors line-clamp-1 mb-2">
                          {prod.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                          <div>
                            <span className="block font-semibold text-gray-400 text-[8px] uppercase">Size</span>
                            <span className="font-medium text-gray-700">{prod.size}</span>
                          </div>
                          <div>
                            <span className="block font-semibold text-gray-400 text-[8px] uppercase">Finish</span>
                            <span className="font-medium text-gray-700">{prod.finish}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-16 rounded-3xl border border-gray-200/60 text-center flex flex-col items-center justify-center gap-4">
                <Info className="w-12 h-12 text-gray-300" />
                <h4 className="font-serif text-lg font-bold text-primary">No products found</h4>
                <p className="text-sm text-gray-400 max-w-xs">
                  We couldn't find any products matching your active filters. Try adjusting your query or resetting filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-primary-light transition-all mt-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col gap-6 text-left relative animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent-dark" />
                Refine Search
              </h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setShowMobileFilters(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-slate-50"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Brand Partner</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setShowMobileFilters(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-slate-50"
              >
                {brands.map((brand, i) => (
                  <option key={i} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Dimensions / Size</label>
              <select
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setShowMobileFilters(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-slate-50"
              >
                {sizes.map((size, i) => (
                  <option key={i} value={size}>{size === 'All' ? 'All Sizes' : size}</option>
                ))}
              </select>
            </div>

            {/* Finish Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Surface Finish</label>
              <select
                value={selectedFinish}
                onChange={(e) => {
                  setSelectedFinish(e.target.value);
                  setShowMobileFilters(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-slate-50"
              >
                {finishes.map((finish, i) => (
                  <option key={i} value={finish}>{finish === 'All' ? 'All Finishes' : finish}</option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Stock Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setShowMobileFilters(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-slate-50"
              >
                {statuses.map((status, i) => (
                  <option key={i} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                clearFilters();
                setShowMobileFilters(false);
              }}
              className="mt-4 bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl text-center text-sm hover:bg-red-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
