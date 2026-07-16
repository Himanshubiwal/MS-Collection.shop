import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate(redirect);
    }
  };

  const handleShopLoginClick = () => {
    // Simulated quick shop login or customer demo filler
    setEmail('alex@example.com');
    setPassword('customerpassword123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-logo font-normal tracking-tight">Sign in</h1>
        <p className="text-xs text-neutral-500">
          Enter your email and password to access your MS Collection account
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded text-center font-medium animate-fadeIn">
          {error}
        </div>
      )}

      {/* Shopify purple "Continue with Shop" quick pass button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleShopLoginClick}
          className="w-full bg-[#5A31F4] text-white py-3.5 rounded text-sm font-semibold hover:bg-[#4823D4] transition-colors flex items-center justify-center space-x-2 shadow-md"
        >
          <span>Continue with Shop (Auto-fill Demo Customer)</span>
        </button>
        <div className="mt-6 flex items-center justify-between">
          <span className="w-full border-t border-neutral-200" />
          <span className="px-3 text-xs text-neutral-400 uppercase tracking-widest font-semibold">Or</span>
          <span className="w-full border-t border-neutral-200" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com or admin@mscollection.com"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
        >
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-neutral-500 space-y-3 border-t border-neutral-100 pt-6">
        <p>
          Don't have an MS Collection account yet?{' '}
          <Link to={`/register?redirect=${redirect}`} className="text-black font-semibold underline">
            Create one
          </Link>
        </p>
        <div className="p-3 bg-neutral-50 rounded text-left space-y-1 text-neutral-600">
          <p className="font-semibold text-neutral-800 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Pre-seeded Demo Accounts:</span>
          </p>
          <p>• Customer: <code>rahul@example.com</code> / <code>customerpassword123</code></p>
          <p>• Admin Portal: <code>admin@mscollection.com</code> / <code>adminpassword123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
