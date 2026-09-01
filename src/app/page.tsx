import { Leaf, ShoppingCart, ArrowRight, Cpu, PhoneCall, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      {/* Universal Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
          <div className="w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
          <div className="w-[30rem] h-[30rem] bg-amber-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SIH Problem Statement 26033 · Ministry of Consumer Affairs
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Eliminating the Middleman.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Empowering the Farmer.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            The next-generation digital marketplace connecting farmers directly to consumers and bulk buyers. Powered by AI demand forecasting and smart logistics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/farmer" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transform">
              <Leaf className="w-5 h-5" />
              Farmer Portal
            </Link>
            <Link href="/marketplace" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:-translate-y-0.5 transform">
              <ShoppingCart className="w-5 h-5" />
              Shop Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Sections — preview cards that link to separate pages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to know</h2>
            <p className="text-lg text-slate-600">From how the platform works to its economic impact — explore each pillar of Kissan Connect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* How it Works Card */}
            <Link href="/how-it-works" className="group block bg-amber-50 border border-amber-100 rounded-3xl p-8 hover:shadow-lg hover:border-amber-300 transition-all hover:-translate-y-1">
              <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">How it Works</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Toll-free IVR for rural farmers, a B2C marketplace for citizens, and a B2B portal for food companies — all in one platform.
              </p>
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* AI Logistics Card */}
            <Link href="/ai-logistics" className="group block bg-blue-50 border border-blue-100 rounded-3xl p-8 hover:shadow-lg hover:border-blue-300 transition-all hover:-translate-y-1">
              <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">AI Logistics</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our ML models predict demand, optimize routes in real-time, and route drivers to the right HUBs — cutting waste and transit time.
              </p>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Our Impact Card */}
            <Link href="/impact" className="group block bg-emerald-50 border border-emerald-100 rounded-3xl p-8 hover:shadow-lg hover:border-emerald-300 transition-all hover:-translate-y-1">
              <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Our Impact</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                +40% farmer earnings. −20% consumer prices. −35% food wastage. See the data behind the mission.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Leaf className="w-96 h-96 -translate-y-1/4 translate-x-1/4" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to revolutionize agriculture?</h2>
          <p className="text-emerald-100 text-lg md:text-xl mb-10">Join Kissan Connect today. Whether you're a farmer looking for fair wages or a customer seeking fresh produce, we bring the farm to your fingertips.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join" className="inline-block bg-white text-emerald-700 hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg transition-colors hover:-translate-y-0.5 transform">
              Get Started Now
            </Link>
            <Link href="/contact-sales" className="inline-block bg-emerald-700 text-white hover:bg-emerald-800 border border-emerald-500 px-8 py-4 rounded-full font-bold text-lg transition-colors hover:-translate-y-0.5 transform">
              Contact Sales for Bulk
            </Link>
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
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
