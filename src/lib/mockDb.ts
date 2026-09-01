/**
 * lib/mockDb.ts
 * 
 * Central in-memory mock database.
 * 
 * SCALABILITY NOTE: To swap this for Supabase:
 * 1. Install: npm install @supabase/supabase-js
 * 2. Replace each function body with the equivalent Supabase query.
 * 3. The API route handlers (app/api/**) require NO changes at all.
 * 
 * Example swap for getListings():
 *   const { data } = await supabase.from('listings').select('*');
 *   return data;
 */

export type Role = 'farmer' | 'customer' | 'logistics' | 'admin';
export type ListingStatus = 'available' | 'reserved' | 'sold';
export type OrderStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  location?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  produce: string;
  quantity: number; // in kg
  pricePerKg: number; // in INR
  location: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  listingId: string;
  produce: string;
  quantityKg: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Route {
  id: string;
  driverId: string;
  from: string;
  to: string;
  produce: string;
  savingKm: number;
  progress: number; // 0-100
  status: 'active' | 'completed';
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: 'u1', name: 'Ravi Kumar', email: 'ravi@farm.in', phone: '9876543210', role: 'farmer', location: 'Nashik, MH', createdAt: '2026-01-10T00:00:00Z' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9123456789', role: 'customer', location: 'Pune, MH', createdAt: '2026-02-01T00:00:00Z' },
  { id: 'u3', name: 'Amit Logistics', email: 'amit@logistics.in', phone: '9001234567', role: 'logistics', location: 'Mumbai, MH', createdAt: '2026-02-15T00:00:00Z' },
];

export const listings: Listing[] = [
  { id: 'l1', farmerId: 'u1', farmerName: 'Ravi Kumar', produce: 'Tomatoes', quantity: 200, pricePerKg: 18, location: 'Nashik, MH', status: 'available', createdAt: '2026-08-20T08:00:00Z' },
  { id: 'l2', farmerId: 'u1', farmerName: 'Ravi Kumar', produce: 'Onions', quantity: 500, pricePerKg: 22, location: 'Nashik, MH', status: 'available', createdAt: '2026-08-21T09:00:00Z' },
  { id: 'l3', farmerId: 'u1', farmerName: 'Sunita Patil', produce: 'Potatoes', quantity: 300, pricePerKg: 15, location: 'Satara, MH', status: 'reserved', createdAt: '2026-08-22T07:30:00Z' },
];

export const orders: Order[] = [
  { id: 'o1', customerId: 'u2', listingId: 'l3', produce: 'Potatoes', quantityKg: 10, totalPrice: 150, status: 'in_transit', createdAt: '2026-08-23T10:00:00Z' },
];

export const routes: Route[] = [
  { id: 'r1', driverId: 'u3', from: 'Farm A (Nashik)', to: 'City HUB North (Pune)', produce: 'Tomatoes', savingKm: 12, progress: 60, status: 'active' },
  { id: 'r2', driverId: 'u3', from: 'HUB North (Pune)', to: 'Bulk Buyer Corp', produce: 'Onions', savingKm: 5, progress: 25, status: 'active' },
];
