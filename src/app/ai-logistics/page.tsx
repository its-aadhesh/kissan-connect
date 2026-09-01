import { TrendingUp, Leaf } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AILogistics() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      <Navbar />

      {/* Dashboard Preview / Hub Model */}
      <section className="pt-32 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">The HUB Model in Action</h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                By establishing regional HUBs, we create an efficient bridge. Produce is picked up from farms, transported to the nearest HUB, and delivered to local customers.
              </p>
              
              <ul className="space-y-8">
                <li className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Farmer Lists Yield</h4>
                    <p className="text-slate-600 text-lg">Via App or Toll-Free number.</p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">AI Logistics Dispatch</h4>
                    <p className="text-slate-600 text-lg">System finds the nearest driver & optimal route.</p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">HUB Distribution</h4>
                    <p className="text-slate-600 text-lg">Produce arrives at city HUB, ready for direct purchase by customers and bulk buyers.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2">
              {/* Mock Dashboard UI */}
              <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 transform transition-transform hover:scale-105 duration-500">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-4 text-xs font-mono text-slate-400">admin-dashboard / route-optimization</span>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h5 className="text-white font-semibold text-lg">Active Logistics Routes</h5>
                    <span className="bg-emerald-500/20 text-emerald-400 text-sm font-medium px-3 py-1.5 rounded-full">Live AI Tracking</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Mock Route 1 */}
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-300 font-medium text-base">Farm A → City HUB North</span>
                        <span className="text-emerald-400 font-semibold">Saving 12km</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div className="bg-emerald-500 h-3 rounded-full relative" style={{ width: '60%' }}>
                           <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/30 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    {/* Mock Route 2 */}
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-300 font-medium text-base">HUB North → Bulk Buyer Corp</span>
                        <span className="text-emerald-400 font-semibold">Optimal</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div className="bg-emerald-500 h-3 rounded-full relative" style={{ width: '25%' }}>
                           <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/30 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-700">
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-500/20 p-4 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Demand Forecast (Next 48h)</p>
                        <p className="text-white font-bold text-lg">High Demand: Tomatoes @ South HUB</p>
                      </div>
                    </div>
                  </div>
                </div>
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
