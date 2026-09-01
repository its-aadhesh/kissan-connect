"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, ShoppingCart, Briefcase, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, MapPin, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { setStoredUser } from '@/lib/auth';

export default function Join() {
  const router = useRouter();
  const [role, setRole] = useState<'farmer' | 'customer' | 'logistics'>('farmer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const roleDetails = {
    farmer: {
      title: 'Farmer / FPO Producer',
      badge: '+40% Higher Margin',
      desc: 'Sell direct to consumers & bulk buyers. Eliminate commission agents and get guaranteed fair MSP.',
      icon: Leaf,
      color: 'emerald',
      placeholderLocation: 'e.g. Nashik, Maharashtra',
    },
    customer: {
      title: 'Direct Consumer',
      badge: '20% Lower Prices',
      desc: 'Buy farm-fresh vegetables and fruits within 12 hours of harvest directly from local village HUBs.',
      icon: ShoppingCart,
      color: 'blue',
      placeholderLocation: 'e.g. Pune, Maharashtra',
    },
    logistics: {
      title: 'Logistics / Bulk Buyer',
      badge: 'AI Route Optimized',
      desc: 'Connect your transport fleet or bulk food business with consolidated rural distribution channels.',
      icon: Briefcase,
      color: 'amber',
      placeholderLocation: 'e.g. Mumbai, Maharashtra',
    },
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role,
          location: formData.location || 'Maharashtra, India',
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Registration failed. Please try again.');
      }

      const newUser = json.data;
      setStoredUser(newUser, `mock-jwt-token-for-${newUser.id}`);
      setSuccess(true);

      setTimeout(() => {
        if (role === 'farmer') {
          router.push('/farmer');
        } else if (role === 'customer') {
          router.push('/marketplace');
        } else {
          router.push('/ai-logistics');
        }
      }, 800);

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = roleDetails[role].icon;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 mb-4 group">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Leaf className="h-7 w-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">Kissan Connect</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-semibold text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Direct Farmer-Consumer Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
            Choose your role to get started with direct agricultural trade and AI-optimized distribution.
          </p>
        </div>

        {/* Step 1: Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['farmer', 'customer', 'logistics'] as const).map((r) => {
            const isSelected = role === r;
            const details = roleDetails[r];
            const Icon = details.icon;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError(null);
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-all relative ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-lg shadow-emerald-600/10 ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  r === 'farmer' ? 'bg-emerald-100 text-emerald-700' :
                  r === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                  {details.badge}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{details.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{details.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Step 2: Interactive Registration Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10">
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Register as {roleDetails[role].title}
              </h2>
              <p className="text-xs text-slate-500">
                Connected directly to the DoCA unified market API
              </p>
            </div>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Account successfully created! Logging you in now...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'farmer' ? 'e.g. Ramesh Patel' : role === 'customer' ? 'e.g. Anita Desai' : 'e.g. Apex Agri Logistics'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number (IVR / SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Primary Location / District
                </label>
                <input
                  type="text"
                  placeholder={roleDetails[role].placeholderLocation}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero commission fee · DoCA Verified Security Standard</span>
              </div>
              <span className="font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                100% Direct Settlement
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/signin" className="font-bold text-emerald-600 hover:text-emerald-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
