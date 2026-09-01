import { Leaf, Phone, Mail, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ContactSales() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Value Prop for B2B */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 font-medium text-sm mb-6 w-fit">
            <Building className="w-4 h-4" /> B2B Sourcing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Source fresh, quality produce at scale.
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Food processing companies, restaurant chains, and large retailers can secure reliable, transparent, and cost-effective agricultural supplies directly from HUBs through Kissan Connect.
          </p>
          
          <ul className="space-y-6">
            <li className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold">AI Quality Grading</h4>
                <p className="text-slate-600">Every batch is visually graded by our AI models upon pickup, ensuring you get the exact standard you contract for.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold">Guaranteed Logistics</h4>
                <p className="text-slate-600">Our routing algorithm manages the cold chain and transit, delivering bulk orders exactly when you need them.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold">Transparent Pricing</h4>
                <p className="text-slate-600">No hidden intermediary fees. Pay fair market value directly to the network.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200">
          <h3 className="text-2xl font-bold mb-6">Talk to our Sales Team</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Work Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="john@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Acme Foods Ltd." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expected Monthly Volume (Tons)</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                <option>Less than 5 Tons</option>
                <option>5 - 20 Tons</option>
                <option>20 - 50 Tons</option>
                <option>50+ Tons</option>
              </select>
            </div>

            <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
              Request a Callback
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg"><Phone className="w-4 h-4" /></div>
              <span className="text-sm">1800-KISSAN-B2B</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg"><Mail className="w-4 h-4" /></div>
              <span className="text-sm">bulk@kissanconnect.in</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
