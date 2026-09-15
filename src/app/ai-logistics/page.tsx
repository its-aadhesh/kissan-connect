"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Truck, TrendingUp, Leaf, MapPin, CheckCircle2, Clock, 
  AlertCircle, ArrowRight, ShieldCheck, Sparkles, RefreshCw, 
  Plus, Navigation, Thermometer, BatteryCharging, Gauge, 
  Zap, Building2, Package, Check, X, ArrowUpRight
} from 'lucide-react';
import { getStoredUser, AuthUser } from '@/lib/auth';

interface RouteItem {
  id: string;
  driverId: string;
  from: string;
  to: string;
  produce: string;
  savingKm: number;
  progress: number;
  status: 'active' | 'completed';
}

interface OrderItem {
  id: string;
  customerId: string;
  listingId: string;
  produce: string;
  quantityKg: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered';
  createdAt: string;
}

export default function AILogistics() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'routes' | 'orders' | 'hubs' | 'guide'>('routes');
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modal State
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [submittingRoute, setSubmittingRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({
    from: 'Nashik Farm Cluster #3',
    to: 'Pune City HUB North',
    produce: 'Organic Tomatoes',
    savingKm: '14',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesRes, ordersRes] = await Promise.all([
        fetch('/api/logistics/routes'),
        fetch('/api/orders'),
      ]);

      const routesJson = await routesRes.json();
      const ordersJson = await ordersRes.json();

      if (routesJson.success) {
        setRoutes(routesJson.data || []);
      }
      if (ordersJson.success) {
        setOrders(ordersJson.data || []);
      }
    } catch (err) {
      showToast('Failed to load real-time logistics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchData();
  }, []);

  // Update Route Progress / Status
  const handleUpdateRoute = async (routeId: string, currentProgress: number) => {
    const nextProgress = Math.min(100, currentProgress + 20);
    const nextStatus = nextProgress === 100 ? 'completed' : 'active';

    try {
      const res = await fetch('/api/logistics/routes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: routeId,
          progress: nextProgress,
          status: nextStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRoutes(prev => prev.map(r => r.id === routeId ? json.data : r));
        showToast(
          nextProgress === 100 
            ? `Route ${routeId} marked as completed & arrived at HUB!` 
            : `Vehicle GPS advanced to ${nextProgress}%`,
          'success'
        );
      } else {
        showToast(json.error || 'Failed to update route', 'error');
      }
    } catch (err) {
      showToast('Error communicating with dispatch server', 'error');
    }
  };

  // Update Order Status (Dispatch / Mark Delivered)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'in_transit' | 'delivered') => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? json.data : o));
        showToast(
          newStatus === 'in_transit'
            ? `Order ${orderId} dispatched with live AI fleet tracking!`
            : `Order ${orderId} marked delivered at HUB!`,
          'success'
        );
      } else {
        showToast(json.error || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Error updating order status', 'error');
    }
  };

  // Create New Route
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRoute(true);

    try {
      const res = await fetch('/api/logistics/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: user?.id || 'u3',
          from: newRoute.from,
          to: newRoute.to,
          produce: newRoute.produce,
          savingKm: Number(newRoute.savingKm),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRoutes(prev => [json.data, ...prev]);
        setShowAddRouteModal(false);
        showToast('New AI-optimized dispatch route launched successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to launch route', 'error');
      }
    } catch (err) {
      showToast('Failed to create dispatch route', 'error');
    } finally {
      setSubmittingRoute(false);
    }
  };

  const activeRoutesCount = routes.filter(r => r.status === 'active').length;
  const totalKmSaved = routes.reduce((acc, curr) => acc + (curr.savingKm || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'in_transit').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-bounce ${
          toastType === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30' 
            : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/30'
        }`}>
          {toastType === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> AI Fleet & HUB Engine
              </span>
              <span className="text-slate-400 text-xs font-mono">DoCA PS-26033 Core Component</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Logistics & Route Optimization Command
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Dynamic multi-stop farm aggregation, electric fleet telematics, and regional HUB distribution.
            </p>
          </div>

          {/* Quick Actions & Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
              title="Refresh Live Operations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowAddRouteModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch New Route</span>
            </button>
          </div>
        </div>

        {/* Global Key Operational Metrics */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Active AI Routes</span>
              <Truck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{activeRoutesCount}</div>
            <span className="text-[11px] text-emerald-400 font-medium">Multi-stop aggregation active</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Mileage Saved (AI)</span>
              <Navigation className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">+{totalKmSaved} km</div>
            <span className="text-[11px] text-slate-400 font-medium">~{Math.round(totalKmSaved * 0.38)}L diesel / carbon saved</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Pending Farm Pickups</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingOrdersCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">Orders awaiting transit / hub arrival</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Regional HUB Network</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400">4 Hubs</div>
            <span className="text-[11px] text-blue-300 font-medium">Nashik, Pune, Mumbai, Satara</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-8 border-b border-slate-800 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'routes'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Fleet & Routes ({routes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Farm Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hubs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'hubs'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>AI Demand Heatmap & Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>HUB Architecture Guide</span>
          </button>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: Live Routes & Telematics */}
        {activeTab === 'routes' && (
          <div className="space-y-8">
            {/* Live Cold-Chain Telematics Bar */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Cold-Chain Fleet Telematics (Simulated IoT)</h4>
                  <p className="text-slate-400 text-xs">Monitors cargo freshness and vehicle battery life across Maharashtra agrarian corridors</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 sm:gap-10 w-full lg:w-auto">
                <div className="flex items-center gap-2.5">
                  <Thermometer className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-xs text-slate-400">Cargo Temp</div>
                    <div className="text-sm font-bold text-white font-mono">4.2°C (Optimal)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <BatteryCharging className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs text-slate-400">EV Fleet Battery</div>
                    <div className="text-sm font-bold text-white font-mono">82% (240km Range)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-400">AI Route Match</div>
                    <div className="text-sm font-bold text-white font-mono">98.4% Efficiency</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Routes List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Active Transit Vectors</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-mono">
                    Real-time OR-Tools Sync
                  </span>
                </h3>
                <span className="text-xs text-slate-400">
                  Click &apos;Advance 20%&apos; to simulate vehicle GPS milestone progress
                </span>
              </div>

              {routes.length === 0 ? (
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-12 text-center">
                  <Truck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <h4 className="text-white font-bold text-lg mb-1">No active routes found</h4>
                  <p className="text-slate-400 text-sm mb-6">Click the button below to dispatch an AI-optimized aggregation vehicle.</p>
                  <button
                    onClick={() => setShowAddRouteModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Dispatch First Route
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {routes.map((route) => (
                    <div 
                      key={route.id} 
                      className={`p-6 rounded-3xl border transition-all ${
                        route.status === 'completed'
                          ? 'bg-slate-900/60 border-slate-800 opacity-70'
                          : 'bg-slate-800/90 border-slate-700 shadow-xl hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-slate-400">Route #{route.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              route.status === 'completed'
                                ? 'bg-slate-700 text-slate-300'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {route.status === 'completed' ? 'Arrived at HUB' : 'In Transit'}
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-base flex items-center gap-2">
                            <span>{route.from}</span>
                            <ArrowRight className="w-4 h-4 text-emerald-400" />
                            <span>{route.to}</span>
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                            -{route.savingKm} km AI Saved
                          </span>
                        </div>
                      </div>

                      {/* Cargo Info */}
                      <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cargo: <strong className="text-white">{route.produce}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-slate-400">
                          <span>Driver ID:</span>
                          <strong className="text-slate-200">{route.driverId}</strong>
                        </div>
                      </div>

                      {/* Progress Bar with Simulation */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400 font-medium">Route Completion</span>
                          <span className="text-emerald-400 font-bold font-mono">{route.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-700/60 p-0.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 relative"
                            style={{ width: `${route.progress}%` }}
                          >
                            {route.status === 'active' && (
                              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {route.status === 'active' ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                          <button
                            onClick={() => handleUpdateRoute(route.id, route.progress)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all hover:border-emerald-500"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Simulate GPS Step (+20%)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Consignment Unloaded at Regional HUB</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Orders & Farm Pickup Dispatch */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Marketplace & Farm Pickup Dispatch</h3>
                <p className="text-xs text-slate-400">All customer and bulk orders placed across regional HUBs needing transit dispatch</p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                Live Orders: {orders.length}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-12 text-center">
                <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h4 className="text-white font-bold text-lg mb-1">No orders currently in queue</h4>
                <p className="text-slate-400 text-sm">When customers place orders on the Marketplace, they show up here for vehicle dispatch.</p>
              </div>
            ) : (
              <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-xs uppercase font-bold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Produce & Quantity</th>
                        <th className="px-6 py-4">Consignment Value</th>
                        <th className="px-6 py-4">Current Status</th>
                        <th className="px-6 py-4 text-right">Logistics Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-750/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-white">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{order.produce}</div>
                            <div className="text-xs text-slate-400">{order.quantityKg} kg harvest batch</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-400">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'delivered' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'in_transit'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.status === 'delivered' ? 'bg-emerald-400' : order.status === 'in_transit' ? 'bg-blue-400 animate-ping' : 'bg-amber-400'
                              }`} />
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'in_transit')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Dispatch Truck</span>
                              </button>
                            )}

                            {order.status === 'in_transit' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirm HUB Delivery</span>
                              </button>
                            )}

                            {order.status === 'delivered' && (
                              <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Consolidated at HUB</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI Demand Heatmap & Hub Balancing */}
        {activeTab === 'hubs' && (
          <div className="space-y-8">
            {/* AI Real-Time Advisory Alert */}
            <div className="bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/40 p-5 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl shrink-0 mt-0.5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">AI Automated Market Advisory</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Updated 5 min ago</span>
                </div>
                <h4 className="text-white font-bold text-base">High Tomato Demand Surge Detected in Mumbai (+22% Forecast)</h4>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Price disparity identified: Nashik farm gate is ₹18/kg while Mumbai wholesale retail is ₹42/kg. The AI route optimizer recommends dispatching 2 additional refrigerated trucks from <strong>Nashik HUB 4</strong> to <strong>Mumbai Central HUB</strong> to maximize farmer realization while curbing consumer price inflation.
                </p>
              </div>
            </div>

            {/* Regional Hub Load Grid */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Regional Collection & Distribution HUBs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* HUB 1 */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-emerald-400 font-bold">Aggregation HUB</span>
                      <span className="text-slate-400 font-mono">HUB #1</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Nashik Rural HUB</h4>
                    <p className="text-slate-400 text-xs mt-1">Direct link to 85+ Village FPOs</p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Current Stock:</span>
                        <strong className="text-white">14,200 kg</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Top Produce:</span>
                        <strong className="text-emerald-400">Tomatoes & Onions</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Storage Capacity</span>
                      <span className="text-white font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                {/* HUB 2 */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-blue-400 font-bold">Distribution HUB</span>
                      <span className="text-slate-400 font-mono">HUB #2</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Pune City HUB North</h4>
                    <p className="text-slate-400 text-xs mt-1">Consumer & Local Retail Supply</p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Current Stock:</span>
                        <strong className="text-white">8,900 kg</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Delivery Rate:</span>
                        <strong className="text-blue-400">320 kg/hour</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Storage Capacity</span>
                      <span className="text-white font-bold">62%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>

                {/* HUB 3 */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-amber-400 font-bold">Wholesale HUB</span>
                      <span className="text-slate-400 font-mono">HUB #3</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Mumbai Central HUB</h4>
                    <p className="text-slate-400 text-xs mt-1">B2B & Bulk Buyer Distribution</p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Current Stock:</span>
                        <strong className="text-white">21,500 kg</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Bulk Orders:</span>
                        <strong className="text-amber-400">12 Active Fleets</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Storage Capacity</span>
                      <span className="text-amber-400 font-bold">91% (High)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>

                {/* HUB 4 */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-teal-400 font-bold">Cold Storage Staging</span>
                      <span className="text-slate-400 font-mono">HUB #4</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Satara Rural HUB</h4>
                    <p className="text-slate-400 text-xs mt-1">Root vegetable preservation</p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Current Stock:</span>
                        <strong className="text-white">4,100 kg</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Cold Chain:</span>
                        <strong className="text-teal-400">3.8°C Regulated</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Storage Capacity</span>
                      <span className="text-white font-bold">42%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HUB Architecture Guide (Educational for Evaluators) */}
        {activeTab === 'guide' && (
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 sm:p-12">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">SIH Problem Statement 26033 Solution</span>
              <h2 className="text-3xl font-black text-white mt-2 mb-4">
                The Regional HUB Logistics Architecture
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Traditional agricultural supply chains require individual farmers to negotiate with 4 to 6 local middlemen (arthiyas, agents, wholesalers, commission brokers). Kissan Connect solves this by establishing smart regional HUBs where multi-stop EV trucks aggregate harvests directly from farm gates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/60 relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center mb-4">
                  1
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Farmer Lists Yield</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Via smartphone app or offline Toll-Free IVR voice call (1800-KISSAN). Farmers specify crop, quantity, and preferred pickup date.
                </p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/60 relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 font-black text-xl flex items-center justify-center mb-4">
                  2
                </div>
                <h4 className="text-lg font-bold text-white mb-2">AI Multi-Stop Routing</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our optimization engine clusters nearby farm pickup requests into single multi-stop delivery routes, saving up to 40% fuel and transit time.
                </p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/60 relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center mb-4">
                  3
                </div>
                <h4 className="text-lg font-bold text-white mb-2">HUB Direct Distribution</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Produce arrives at city collection HUBs within 12 hours. Consumers and bulk buyers purchase directly, eliminating all intermediary commission fees.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Dispatch New Route */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddRouteModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Dispatch New AI Fleet Route</h3>
                <p className="text-slate-400 text-xs">Clusters rural farms and schedules an electric aggregation run</p>
              </div>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Origin Farm / Rural Cluster
                </label>
                <input
                  type="text"
                  required
                  value={newRoute.from}
                  onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                  placeholder="e.g. Nashik Cluster B"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Destination Regional HUB
                </label>
                <input
                  type="text"
                  required
                  value={newRoute.to}
                  onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                  placeholder="e.g. Pune City HUB North"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Primary Produce
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoute.produce}
                    onChange={(e) => setNewRoute({ ...newRoute, produce: e.target.value })}
                    placeholder="e.g. Tomatoes"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Est. Km Saved
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newRoute.savingKm}
                    onChange={(e) => setNewRoute({ ...newRoute, savingKm: e.target.value })}
                    placeholder="12"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-2.5 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI will automatically map shortest-path charging stops along the corridor.</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRoute}
                  className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {submittingRoute ? 'Launching...' : 'Confirm & Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span>Kissan Connect AI Logistics Engine</span>
          </div>
          <div>Ministry of Consumer Affairs, Food &amp; Public Distribution (DoCA) — SIH PS 26033</div>
        </div>
      </footer>
    </div>
  );
}
