"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, Menu, X, ShoppingBag, LayoutDashboard, Truck, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { getStoredUser, clearStoredUser, AuthUser } from '@/lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    const handleStorage = () => setUser(getStoredUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const handleSignOut = () => {
    clearStoredUser();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag, badge: 'Fresh' },
    { name: 'Farmer Hub', href: '/farmer', icon: LayoutDashboard },
    { name: 'AI Logistics', href: '/ai-logistics', icon: Truck },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Impact', href: '/impact' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Kissan Connect
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 -mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> SIH 26033
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop User Status & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200/60">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-emerald-600 font-medium capitalize">{user.role}</p>
                  </div>
                </div>

                {user.role === 'farmer' && pathname !== '/farmer' && (
                  <Link
                    href="/farmer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    My Dashboard
                  </Link>
                )}

                {user.role === 'customer' && pathname !== '/marketplace' && (
                  <Link
                    href="/marketplace"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Shop Produce
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-slate-600 hover:text-emerald-600 font-medium text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/join"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transform"
                >
                  Join Platform
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-3 duration-200">
          {user && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-xs text-emerald-700 font-medium capitalize">{user.role} · {user.location || 'India'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="text-xs text-rose-600 font-medium px-2.5 py-1 bg-white rounded-lg border border-rose-200 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {!user ? (
            <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2.5">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/join"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
              >
                Join Platform
              </Link>
            </div>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/farmer"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Farmer Dashboard
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold"
              >
                Marketplace
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
