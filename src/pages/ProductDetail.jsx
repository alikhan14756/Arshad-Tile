import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, BadgeCheck, Check, CornerDownRight, Box } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';
import InquiryModal from '../components/InquiryModal';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await dataManager.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          if (prod.images && prod.images.length > 0) {
            setActiveImage(prod.images[0]);
          }
          // Increment analytics view count
          await dataManager.trackProductView(prod.id);
        } else {
          console.warn("Product not found by slug:", slug);
        }
      } catch (e) {
        console.error("Error fetching product details:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-primary">Product Not Found</h2>
        <p className="text-gray-500 text-sm max-w-xs">We couldn't locate the specified item. It may have been removed or updated.</p>
        <button onClick={() => navigate('/products')} className="btn bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-light transition-all">
          Back to Products
        </button>
      </div>
    );
  }

  // Preformat WhatsApp inquiry message
  const whatsappUrl = `https://wa.me/923411239009?text=Hello%20Arshad%20Tiles,%20I%20need%20details%20about:%20${encodeURIComponent(product.name)}%20(${product.brand},%20${product.size})`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Limited Stock': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Best Seller': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'New Arrival': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <SEO 
        title={product.seo?.title || product.name}
        description={product.seo?.description || product.description}
        keywords={product.seo?.keywords}
        image={product.images?.[0]}
        url={`/products/${product.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/50 shadow-sm">
          
          {/* Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-gray-150 relative">
              <img 
                src={activeImage || '/logo-icon.png'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>

            {/* Thumbnail Selectors */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-accent scale-95 shadow-md shadow-accent/15' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Details */}
          <div className="lg:col-span-6 flex flex-col justify-between text-left">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-xs uppercase font-extrabold tracking-wider text-accent-dark">{product.category}</span>
                <span className="text-gray-300 text-sm">|</span>
                <span className="text-xs font-bold text-gray-500">{product.brand}</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price display (optional based on privacy) */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm font-bold text-gray-400">Estimate Price:</span>
                <span className="text-2xl font-black text-primary">PKR {product.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-semibold">/{product.priceType.replace('-', ' ')}</span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description || "Premium styling selection carried directly at Arshad Tiles showroom. Contact us for custom quotes and stock availability orders."}
              </p>

              {/* Box info widget */}
              {product.boxCoverage > 0 && (
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[9px] block">Box Coverage</span>
                      <span className="font-extrabold text-primary text-sm mt-0.5 block">{product.boxCoverage} sq ft</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[9px] block">Pieces/Box</span>
                      <span className="font-extrabold text-primary text-sm mt-0.5 block">{product.piecesPerBox} pcs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="btn bg-primary text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-light transition-all flex-grow shadow-lg shadow-primary/10"
              >
                <FileText className="w-4 h-4" />
                Request Quote
              </button>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-[#25d366] text-[#25d366] hover:bg-[#25d366] hover:text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all flex-grow"
              >
                <MessageSquare className="w-4 h-4" />
                Ask Price on WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* Technical Specs Details Block */}
        <div className="mt-12 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/50 shadow-sm text-left">
          <h3 className="font-serif text-xl font-bold text-primary mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-accent-dark" />
            Technical Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
            {[
              { label: 'Name', val: product.name },
              { label: 'Category', val: product.category },
              { label: 'Sub Category', val: product.subcategory || 'Standard' },
              { label: 'Brand Distributor', val: product.brand },
              { label: 'Tile Dimensions', val: product.size },
              { label: 'Primary Color', val: product.color || 'Standard' },
              { label: 'Surface Finish', val: product.finish },
              { label: 'Surface Structure', val: product.surface || 'Standard' },
              { label: 'Material Composition', val: product.material || 'Ceramic' }
            ].map((spec, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-gray-400 font-medium">{spec.label}</span>
                <span className="font-semibold text-primary">{spec.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <InquiryModal 
          product={product} 
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </div>
  );
}
