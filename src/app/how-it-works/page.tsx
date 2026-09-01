import { PhoneCall, ShieldCheck, Cpu, MapPin, Leaf } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      <Navbar />

      {/* Features Grid (Bento style) */}
      <section className="pt-32 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">An ecosystem built for efficiency</h2>
            <p className="text-xl text-slate-600">We replace complex supply chains with a single, intelligent application that handles everything from produce listing to last-mile delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Toll-Free Feature */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 md:col-span-2 group hover:border-emerald-200 transition-all hover:shadow-md">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Toll-Free Offline Access</h3>
              <p className="text-slate-600 mb-8 max-w-lg text-lg leading-relaxed">No smartphone? Poor internet? No problem. Farmers in remote areas can simply call our toll-free IVR system to list their harvest, completely bypassing digital barriers.</p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 w-fit">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></div>
                <p className="font-mono text-base text-slate-700">"Listing 50kg of Tomatoes in District 4..."</p>
              </div>
            </div>

            {/* Direct Marketplace */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 group hover:border-emerald-200 transition-all hover:shadow-md">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">B2C & B2B Ready</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Citizens buy groceries normally. Bulk buyers and food companies lock in agreements digitally with total farm-to-table transparency.</p>
            </div>

            {/* AI Logistics */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 group hover:border-emerald-200 transition-all hover:shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Demand Forecasting</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Our machine learning models predict which HUBs need specific produce, preventing wastage and optimizing supply matching.</p>
            </div>

            {/* Route Optimization */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 md:col-span-2 group hover:border-emerald-200 transition-all hover:shadow-md overflow-hidden relative">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4 relative z-10">Dynamic Route Optimization</h3>
              <p className="text-slate-600 max-w-lg text-lg leading-relaxed relative z-10">Our logistics partners receive AI-optimized routes in real-time. Pickups from farmers and deliveries to regional HUBs are calculated to minimize fuel cost and transit time.</p>
              
              {/* Decorative map elements */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                <svg width="500" height="500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-xl">Kissan Connect</span>
          </div>
          <p>© 2026 Kissan Connect (SIH PS 26033). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
