import { ArrowUpRight, ArrowDownRight, Leaf, Users, Truck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Impact() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Real Impact for <span className="text-emerald-600">Real People</span>
          </h1>
          <p className="text-xl text-slate-600">
            By eliminating intermediaries and utilizing AI-driven logistics, Kissan Connect dramatically reshapes the agricultural economy.
          </p>
        </div>

        {/* CSS-based visual stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-900">Farmer Earnings</h3>
              <div className="bg-emerald-200 text-emerald-800 p-2 rounded-full">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-5xl font-bold text-emerald-600 mb-2">+40%</p>
            <p className="text-slate-600">Increase in average take-home pay by bypassing middlemen.</p>
            
            {/* Visual Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Traditional</span>
                <span>$10/unit</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs font-medium text-emerald-700 pt-2">
                <span>Kissan Connect</span>
                <span>$14/unit</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Consumer Prices</h3>
              <div className="bg-blue-200 text-blue-800 p-2 rounded-full">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-5xl font-bold text-blue-600 mb-2">-20%</p>
            <p className="text-slate-600">Reduction in grocery costs due to direct supply chains.</p>
            
            {/* Visual Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Traditional</span>
                <span>$20/unit</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs font-medium text-blue-700 pt-2">
                <span>Kissan Connect</span>
                <span>$16/unit</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-900">Food Wastage</h3>
              <div className="bg-amber-200 text-amber-800 p-2 rounded-full">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-5xl font-bold text-amber-600 mb-2">-35%</p>
            <p className="text-slate-600">Less spoilage thanks to AI demand forecasting & fast routing.</p>
            
            {/* Visual Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Traditional</span>
                <span>High Spoilage</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs font-medium text-amber-700 pt-2">
                <span>Kissan Connect</span>
                <span>Optimized</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative section */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">The Cycle of Inefficiency</h2>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Traditionally, produce passes through 4 to 6 intermediaries before reaching a consumer. Each layer adds a markup and increases transit time, leading to lower margins for farmers and older produce for buyers.
              </p>
              <h2 className="text-3xl font-bold mb-6 mt-4 text-emerald-400">The Kissan Solution</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                By utilizing a digital marketplace, intelligent HUBs, and AI-driven logistics, we compress the supply chain to a single step. Farmers list. AI routes. Customers buy.
              </p>
              <Link href="/join" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-full font-semibold w-fit transition-colors">
                Start Trading <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-slate-800 p-12 flex items-center justify-center relative overflow-hidden">
               {/* Abstract visualization of the network */}
               <div className="absolute w-full h-full opacity-20">
                 <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
               </div>
               
               <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                 <div className="w-full flex items-center justify-between bg-slate-700 p-4 rounded-xl border border-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-lg"><Leaf className="text-emerald-400 w-5 h-5"/></div>
                      <span>Farmer</span>
                    </div>
                 </div>
                 
                 <div className="h-12 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500 relative">
                   <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-slate-800 p-2 border border-slate-600 rounded-full">
                     <Truck className="w-4 h-4 text-slate-300" />
                   </div>
                 </div>
                 
                 <div className="w-full flex items-center justify-between bg-slate-700 p-4 rounded-xl border border-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg"><Users className="text-blue-400 w-5 h-5"/></div>
                      <span>Customer</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
