"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  ShoppingBag, Search, Filter, Sparkles, MapPin, CheckCircle2, 
  AlertCircle, ArrowRight, ShieldCheck, Truck, RefreshCw, X, 
  Leaf, Clock, Tag, ChevronDown, User, IndianRupee, Heart
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

export default function Marketplace() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock'>('featured');
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');

  // Order / Checkout Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(5);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccessReceipt, setOrderSuccessReceipt] = useState<Order | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/listings');
      const json = await res.json();
      if (json.success) {
        setListings(json.data || []);
      }

      // Fetch customer orders
      const ordersRes = await fetch('/api/orders');
      const ordersJson = await ordersRes.json();
      if (ordersJson.success) {
        setOrders(ordersJson.data || []);
      }
    } catch {
      showToast('Error loading marketplace produce.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    fetchCatalog();
  }, []);

  const handleOpenOrder = (listing: Listing) => {
    setSelectedListing(listing);
    setOrderQuantity(Math.min(5, listing.quantity));
    setOrderSuccessReceipt(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    setOrdering(true);
    try {
      const customerId = user?.id || 'u2'; // Default demo Priya Sharma
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          listingId: selectedListing.id,
          quantityKg: Number(orderQuantity),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to place order');
      }

      setOrderSuccessReceipt(json.data);
      showToast(`Order placed for ${orderQuantity}kg of ${selectedListing.produce}!`);
      fetchCatalog(); // Refresh available stock
    } catch (err: any) {
      showToast(err.message || 'Error processing order');
    } finally {
      setOrdering(false);
    }
  };

  // Filter & sort
  const availableListings = listings.filter(l => l.status === 'available');
  
  const filteredListings = availableListings
    .filter(l => {
      const matchesSearch = l.produce.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'stock') return b.quantity - a.quantity;
      return 0;
    });

  // Calculate market savings benchmark (average retail is ~30-40% higher)
  const getMarketBenchmark = (price: number) => Math.round(price * 1.38);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl bg-slate-900 text-white border border-slate-700 flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        
        {/* Marketplace Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/20 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 font-semibold text-xs mb-3 backdrop-blur-md border border-emerald-400/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> 100% Direct From Village HUBs
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Fresh Produce Marketplace
              </h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                Harvested within 12 hours. Pay 20% less while farmers earn 40% more. Zero middlemen.
              </p>
            </div>

            {/* Switch Tabs (Shop vs My Orders) */}
            <div className="flex items-center bg-black/20 p-1.5 rounded-2xl backdrop-blur-md border border-white/10 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'shop'
                    ? 'bg-white text-emerald-950 shadow-md'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Harvest ({availableListings.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-950 shadow-md'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                My Orders ({orders.length})
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'shop' ? (
          <>
            {/* Search & Filter Controls */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search fresh tomatoes, onions, mangoes, or village location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="featured">Featured Fresh</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock">Highest Stock (Bulk)</option>
                  </select>

                  <button
                    onClick={fetchCatalog}
                    disabled={loading}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                    title="Refresh Catalog"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Popular:</span>
                {['All Produce', 'Tomatoes', 'Onions', 'Potatoes', 'Mangoes', 'Nashik HUB', 'Pune HUB'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag === 'All Produce' ? '' : tag)}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors shrink-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Produce Grid */}
            {loading ? (
              <div className="py-24 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
                <p className="font-semibold text-sm">Fetching fresh crop supply directly from farm clusters...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <Leaf className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">No produce matched your search</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search filters or check back soon as farmers continuously list new harvests.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Show All Available Produce
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((item) => {
                  const benchmark = getMarketBenchmark(item.pricePerKg);
                  const savingsPercent = Math.round(((benchmark - item.pricePerKg) / benchmark) * 100);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/60 transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-6">
                        {/* Badges Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Harvested Today
                          </span>
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                            Save {savingsPercent}% vs Retail
                          </span>
                        </div>

                        {/* Produce Title */}
                        <h3 className="font-black text-slate-900 text-xl group-hover:text-emerald-700 transition-colors">
                          {item.produce}
                        </h3>

                        {/* Farmer & Location Info */}
                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                          <p className="flex items-center gap-1.5 font-medium text-slate-700">
                            <User className="w-3.5 h-3.5 text-emerald-600" /> {item.farmerName} (Verified FPO)
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                          </p>
                        </div>

                        {/* Price & Stock Section */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl font-black text-slate-900">₹{item.pricePerKg}</span>
                              <span className="text-xs font-semibold text-slate-500">/ kg</span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-through">
                              Market Retail: ₹{benchmark}/kg
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {item.quantity} kg stock
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buy Action Footer */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenOrder(item)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Buy Direct from Farmer</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* My Orders Tab */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Your Orders & Deliveries</h2>
                <p className="text-xs text-slate-500">Live AI route tracking directly from village hubs</p>
              </div>
              <button
                onClick={fetchCatalog}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 text-sm">No orders yet</p>
                <p className="text-xs text-slate-400 mt-1">Browse the marketplace and place your first direct farm order.</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Shop Available Produce
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                        {ord.produce.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{ord.produce}</h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            ord.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Order #{ord.id} • {ord.quantityKg} kg • Total: <strong className="text-emerald-700 font-bold">₹{ord.totalPrice}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ⚡ AI Route Assigned
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Checkout / Buy Order Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccessReceipt ? (
              /* Success Receipt View */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">Order Confirmed!</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Dispatched to smart logistics network for direct delivery.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order ID:</span>
                    <strong className="text-slate-800">{orderSuccessReceipt.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Produce:</span>
                    <strong className="text-slate-800">{orderSuccessReceipt.produce}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <strong className="text-slate-800">{orderSuccessReceipt.quantityKg} kg</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-800">Total Paid:</span>
                    <strong className="font-bold text-emerald-700">₹{orderSuccessReceipt.totalPrice}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedListing(null);
                    setActiveTab('orders');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm"
                >
                  Track in My Orders
                </button>
              </div>
            ) : (
              /* Order Quantity & Payment Form */
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Direct Farm Purchase</h3>
                    <p className="text-xs text-slate-500">No intermediary fees · Guaranteed fresh</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-5 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{selectedListing.produce}</p>
                    <p className="text-slate-600 mt-0.5">Farmer: {selectedListing.farmerName} • {selectedListing.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-lg text-emerald-800">₹{selectedListing.pricePerKg}</span>
                    <span className="text-[10px] block text-slate-500">per kg</span>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Order Quantity (kg)
                      </label>
                      <span className="text-xs text-slate-500">
                        Available: <strong>{selectedListing.quantity} kg</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedListing.quantity}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.min(selectedListing.quantity, Math.max(1, Number(e.target.value) || 1)))}
                        className="flex-1 text-center font-black text-lg py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(prev => Math.min(selectedListing.quantity, prev + 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Produce Cost ({orderQuantity} kg @ ₹{selectedListing.pricePerKg}/kg):</span>
                      <span className="font-semibold text-slate-900">₹{orderQuantity * selectedListing.pricePerKg}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Consolidated AI Logistics Fee:</span>
                      <span className="font-semibold text-emerald-700">₹0 (Subsidized DoCA)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                      <span className="font-bold text-slate-900">Total Payable:</span>
                      <span className="font-black text-emerald-700 text-base">
                        ₹{(orderQuantity * selectedListing.pricePerKg).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ordering}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      {ordering ? 'Placing Order...' : 'Confirm & Buy'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
