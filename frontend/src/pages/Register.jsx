import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErr, setValidationErr] = useState('');

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErr('');
    if (password !== confirmPassword) {
      setValidationErr('Passwords do not match');
      return;
    }
    const res = await register(name, email, password);
    if (res.success) {
      navigate(redirect);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-logo font-normal tracking-tight">Create Account</h1>
        <p className="text-xs text-neutral-500">
          Join the MS Collection community and save your dispatch preferences
        </p>
      </div>

      {(error || validationErr) && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded text-center font-medium">
          {validationErr || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Runner"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full border border-neutral-300 rounded px-3.5 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 shadow-lg pt-4"
        >
          <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-neutral-500">
        Already registered?{' '}
        <Link to={`/login?redirect=${redirect}`} className="text-black font-semibold underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
