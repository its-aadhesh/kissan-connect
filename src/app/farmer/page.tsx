"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Leaf, Plus, Package, TrendingUp, IndianRupee, Clock, CheckCircle2, 
  AlertCircle, PhoneCall, Sparkles, Filter, RefreshCw, X, ChevronRight,
  MapPin, Scale, Tag, ArrowUpRight, BarChart2, ShieldCheck
} from 'lucide-react';
import { getStoredUser, AuthUser } from '@/lib/auth';

interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  produce: string;
  quantity: number;
  pricePerKg: number;
  location: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
}

interface Order {
  id: string;
  customerId: string;
  listingId: string;
  produce: string;
  quantityKg: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered';
  createdAt: string;
}

export default function FarmerDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // New Listing Form State
  const [newProduce, setNewProduce] = useState({
    produce: 'Fresh Organic Tomatoes',
    quantity: '250',
    pricePerKg: '24',
    location: 'Nashik HUB 4, Maharashtra',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, ordersRes] = await Promise.all([
        fetch('/api/listings'),
        fetch('/api/orders'),
      ]);

      const listingsJson = await listingsRes.json();
      const ordersJson = await ordersRes.json();

      if (listingsJson.success) {
        setListings(listingsJson.data || []);
      }
      if (ordersJson.success) {
        setOrders(ordersJson.data || []);
      }
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    fetchData();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const farmerId = user?.id || 'u1';
      const farmerName = user?.name || 'Ravi Kumar';

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId,
          farmerName,
          produce: newProduce.produce,
          quantity: Number(newProduce.quantity),
          pricePerKg: Number(newProduce.pricePerKg),
          location: newProduce.location || user?.location || 'Nashik, Maharashtra',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create listing');
      }

      showToast(`Successfully listed ${newProduce.quantity}kg of ${newProduce.produce}!`);
      setShowAddModal(false);
      // Reset form
      setNewProduce({
        produce: '',
        quantity: '',
        pricePerKg: '',
        location: user?.location || 'Nashik HUB, Maharashtra',
      });
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to list produce', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'available' | 'reserved' | 'sold') => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Listing status updated to ${newStatus}`);
        setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      } else {
        showToast(json.error || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Error updating status', 'error');
    }
  };

  // Quick Voice IVR Simulation for SIH judges demo
  const handleSimulateVoiceListing = async () => {
    const demoItems = [
      { produce: 'Alphonso Mangoes', quantity: 300, pricePerKg: 120, location: 'Ratnagiri HUB' },
      { produce: 'Organic Red Onions', quantity: 600, pricePerKg: 28, location: 'Nashik HUB' },
      { produce: 'Green Capsicum', quantity: 180, pricePerKg: 45, location: 'Pune Rural HUB' },
    ];
    const pick = demoItems[Math.floor(Math.random() * demoItems.length)];

    try {
      setLoading(true);
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user?.id || 'u1',
          farmerName: user?.name || 'Ravi Kumar (IVR Voice)',
          produce: pick.produce,
          quantity: pick.quantity,
          pricePerKg: pick.pricePerKg,
          location: pick.location,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`[Voice IVR 1800-KISSAN] Auto-transcribed & listed: ${pick.quantity}kg ${pick.produce}!`);
        fetchData();
      }
    } catch {
      showToast('Voice simulation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSearch = l.produce.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalKg = listings.reduce((acc, l) => acc + (l.status === 'available' ? l.quantity : 0), 0);
  const activeCount = listings.filter(l => l.status === 'available').length;
  const potentialRevenue = listings.reduce((acc, l) => acc + (l.quantity * l.pricePerKg), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold transition-all animate-in slide-in-from-bottom-5 duration-200 ${
          toastType === 'success' ? 'bg-emerald-900 text-emerald-100 border border-emerald-700' : 'bg-rose-900 text-rose-100 border border-rose-700'
        }`}>
          {toastType === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        
        {/* Header / Profile Hero */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/20 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 font-medium text-xs mb-3 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> DoCA Direct Farmer Portal
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {user?.name ? `${user.name}'s Farm Portal` : 'Farmer Produce Dashboard'}
              </h1>
              <p className="text-emerald-100 text-sm mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user?.location || 'Nashik Region, Maharashtra'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified Producer FPO</span>
                <span>•</span>
                <span className="bg-emerald-500/30 px-2 py-0.5 rounded-md text-xs font-semibold">+40% Higher Margin Active</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSimulateVoiceListing}
                title="Demonstrates voice toll-free listing for farmers without smartphones"
                className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Simulate Toll-Free IVR</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm px-5 py-3 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>+ List Produce</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Advisory Ticker */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">AI Market Intelligence (DoCA Feed)</p>
              <p className="text-xs text-slate-700">
                High demand projected in Pune & Mumbai HUBs for <span className="font-bold text-emerald-800">Tomatoes (+14%)</span> and <span className="font-bold text-emerald-800">Capsicum (+8%)</span> this week. Recommended MSP: ₹22-26/kg.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
              ⚡ Instant HUB Dispatch
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Available Stock</span>
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalKg} <span className="text-base font-normal text-slate-500">kg</span></div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Ready for direct purchase
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Listings</span>
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeCount} <span className="text-base font-normal text-slate-500">active</span></div>
            <p className="text-xs text-slate-500 mt-1">
              {listings.length} total historical crops
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Crop Value</span>
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹{potentialRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Guaranteed direct payment
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Orders Received</span>
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{orders.length} <span className="text-base font-normal text-slate-500">orders</span></div>
            <p className="text-xs text-purple-700 font-semibold mt-1">
              Automated HUB logistics
            </p>
          </div>
        </div>

        {/* Listings & Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Listings Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Manage Produce Listings</h2>
                  <p className="text-xs text-slate-500">Real-time marketplace sync with DoCA smart hubs</p>
                </div>
                
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-5">
                <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
                  {['all', 'available', 'reserved', 'sold'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                        statusFilter === tab
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search crop or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Listings List */}
              {loading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading harvest catalog...
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                  <Leaf className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">No produce listings found</p>
                  <p className="text-xs text-slate-400 mt-1">Click "+ List Produce" to publish your first batch.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredListings.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-md transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                          {item.produce.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.produce}</h3>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Scale className="w-3.5 h-3.5 text-slate-400" /> {item.quantity} kg
                            </span>
                            <span>•</span>
                            <span className="font-bold text-emerald-700">₹{item.pricePerKg}/kg</span>
                            <span>•</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {item.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Status Toggle buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[11px] text-slate-400 font-medium mr-1">Status:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusUpdate(item.id, e.target.value as any)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Recent Orders & Fulfillment (1/3) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Direct Customer Orders</h3>
                  <p className="text-xs text-slate-500">Live order stream from marketplace</p>
                </div>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {orders.length} Total
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No orders placed yet. Orders made on the Marketplace will appear here automatically.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900">{ord.produce}</span>
                        <span className="font-bold text-emerald-700">₹{ord.totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Quantity: <strong className="text-slate-800">{ord.quantityKg} kg</strong></span>
                        <span className={`capitalize font-bold text-[10px] px-2 py-0.5 rounded-md ${
                          ord.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Order ID: {ord.id}</span>
                        <span>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Logistics Route Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Dynamic Routing
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md">Live</span>
              </div>
              <h4 className="font-bold text-base mb-1">Nashik HUB 4 → Pune Metro</h4>
              <p className="text-xs text-slate-300 mb-4">
                Your produce is aggregated into multi-stop electric transport nodes, cutting 18km of deadhead transport.
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div className="bg-emerald-400 h-2 rounded-full w-3/4 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-300 font-semibold text-right">75% Route Optimized</p>
            </div>

          </div>

        </div>

      </main>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">List New Harvest Batch</h3>
                <p className="text-xs text-slate-500">Publish crop directly to consumer marketplace</p>
              </div>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Produce / Crop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Tomatoes, Fresh Spinach, Red Onions"
                  value={newProduce.produce}
                  onChange={(e) => setNewProduce({ ...newProduce, produce: e.target.value })}
                  className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 100"
                    value={newProduce.quantity}
                    onChange={(e) => setNewProduce({ ...newProduce, quantity: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price per kg (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25"
                    value={newProduce.pricePerKg}
                    onChange={(e) => setNewProduce({ ...newProduce, pricePerKg: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Collection HUB Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik HUB 4, Maharashtra"
                  value={newProduce.location}
                  onChange={(e) => setNewProduce({ ...newProduce, location: e.target.value })}
                  className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span>Calculated Batch Yield:</span>
                <span className="font-extrabold text-sm text-emerald-900">
                  ₹{((Number(newProduce.quantity) || 0) * (Number(newProduce.pricePerKg) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'Publishing...' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
