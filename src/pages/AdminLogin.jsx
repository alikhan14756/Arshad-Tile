import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { authManager } from '../firebase/authManager';
import SEO from '../components/SEO';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    const user = authManager.getCurrentUser();
    if (user) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authManager.login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <SEO title="Admin Login" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo/Icon Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary">Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1">Authorized Showroom Personnel Only</p>
        </div>


        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-primary font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent-dark transition-all disabled:opacity-50 mt-2 shadow-lg shadow-accent/25"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Authenticate Securely'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
