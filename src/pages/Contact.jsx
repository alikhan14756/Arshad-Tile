import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { dataManager } from '../firebase/dataManager';
import SEO from '../components/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    city: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.city || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await dataManager.addInquiry({
        customerName: formData.customerName,
        phone: formData.phone,
        city: formData.city,
        productId: 'general',
        productName: 'General Inquiry',
        message: formData.message
      });
      setSuccess(true);
      setFormData({ customerName: '', phone: '', city: '', message: '' });
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Arshad Tiles & Sanitary. Request a custom quote, get directions to our showroom, or call our customer support."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-left mb-12 border-b border-gray-200/50 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark mb-2">Get in Touch</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Contact Us</h1>
          <p className="text-sm text-gray-500 mt-2">Request custom quotes, ask about product stocks, or get directions to the showroom.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Showroom Coordinates & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-6">
              
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Our Address</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Main Shabqadar Bazar, Near Flying Coach Adda, Shabqadar, KP, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-4">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Business Hours</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Monday - Saturday: 9:00 AM - 8:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-4">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent-dark flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Call & WhatsApp Support</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Phone: <a href="tel:+923411239009" className="text-accent-dark hover:underline font-bold">+92 341 1239009</a>
                  </p>
                  <a 
                    href="https://wa.me/923411239009" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25d366] text-white text-[10px] font-bold px-3 py-1 rounded-md mt-2 hover:bg-[#20ba5a] transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="h-72 rounded-3xl overflow-hidden shadow-sm border border-gray-200 relative">
              <iframe
                title="Arshad Tiles Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.26123456789!2d71.5543210!3d34.2187654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCDE0nMDcuNiJOIDcxwrAzMycxNS42IkU!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Contact Lead Intake Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm text-left">
            <h3 className="font-serif text-xl font-bold text-primary mb-6">Send an Inquiry</h3>
            
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-accent mb-4 animate-bounce" />
                <h4 className="font-serif text-xl font-bold text-primary mb-2">Message Sent!</h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  We have logged your query in our Customer CRM. Our manager will follow up with you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 bg-primary text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-primary-light transition-all"
                >
                  Send Another Message
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe what tiles, sanitary ware or PVC panels you are looking for..."
                    required
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
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
