"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, ArrowRight, ShieldCheck, Check, AlertCircle, Loader2, Sparkles, User, ShoppingCart, Truck } from 'lucide-react';
import { DEMO_ACCOUNTS, setStoredUser } from '@/lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [role, setRole] = useState<'farmer' | 'customer' | 'logistics'>('farmer');
  const [email, setEmail] = useState('ravi@farm.in');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectRoleDemo = (selectedRole: 'farmer' | 'customer' | 'logistics') => {
    setRole(selectedRole);
    setEmail(DEMO_ACCOUNTS[selectedRole].email);
    setPassword('demo123');
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to sign in. Please verify your credentials.');
      }

      const { user, token } = json.data;
      setStoredUser(user, token);
      setSuccess(true);

      // Redirect according to user role
      setTimeout(() => {
        if (user.role === 'farmer') {
          router.push('/farmer');
        } else if (user.role === 'customer') {
          router.push('/marketplace');
        } else {
          router.push('/ai-logistics');
        }
      }, 700);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-emerald-600 mb-6 group">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Leaf className="h-7 w-7" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">Kissan Connect</span>
        </Link>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Direct agritech commerce & logistics platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          
          {/* Quick 1-Click Demo Profiles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Select Demo Role
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                1-Click Fill
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button 
                type="button"
                onClick={() => selectRoleDemo('farmer')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'farmer' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600" />
                Farmer
              </button>
              <button 
                type="button"
                onClick={() => selectRoleDemo('customer')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'customer' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                Customer
              </button>
              <button 
                type="button"
                onClick={() => selectRoleDemo('logistics')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
                  role === 'logistics' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-4 h-4 text-amber-600" />
                Logistics
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Authentication successful! Redirecting to your portal...</span>
            </div>
          )}

          {/* Sign In Form connected to POST /api/auth/login */}
          <form className="space-y-5" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password / OTP
                </label>
                <span className="text-xs text-slate-400">Mock demo</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">Zero Middleman Guarantee</span>
              </div>
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                DoCA Certified
              </span>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              New to Kissan Connect?{' '}
              <Link href="/join" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
