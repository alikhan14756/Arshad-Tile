import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';

export default function InquiryModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    city: '',
    message: `Hello Arshad Tiles, I am interested in ${product.name}. Please provide price details and availability.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.city) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await dataManager.addInquiry({
        customerName: formData.customerName,
        phone: formData.phone,
        city: formData.city,
        productId: product.id,
        productName: product.name,
        message: formData.message
      });
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-primary text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold">Request a Quote</h3>
            <p className="text-xs text-gray-300 mt-1">Product: {product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-accent mb-4 animate-bounce" />
              <h4 className="font-serif text-xl font-bold text-primary mb-2">Inquiry Submitted!</h4>
              <p className="text-sm text-gray-500 max-w-xs">
                Thank you for contacting Arshad Tiles. Our team will review your request and get in touch with you shortly.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Ali Khan"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 03451234567"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Shabqadar"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 shadow-lg shadow-accent/20"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
