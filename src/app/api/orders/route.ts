/**
 * GET  /api/orders           — Get all orders (optionally filter by customerId)
 * POST /api/orders           — Place a new order
 * 
 * SUPABASE SWAP:
 *   GET:  supabase.from('orders').select('*').eq('customerId', customerId)
 *   POST: supabase.from('orders').insert(newOrder)
 */
import { NextRequest } from 'next/server';
import { orders, listings } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');
  const status = searchParams.get('status');

  let filtered = [...orders];
  if (customerId) filtered = filtered.filter(o => o.customerId === customerId);
  if (status) filtered = filtered.filter(o => o.status === status);

  return ok(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerId, listingId, quantityKg } = body;

  if (!customerId || !listingId || !quantityKg) {
    return err('customerId, listingId, and quantityKg are required.', 422);
  }

  const listing = listings.find(l => l.id === listingId);
  if (!listing) return err('Listing not found.', 404);
  if (listing.status !== 'available') return err('Listing is not available.', 409);
  if (quantityKg > listing.quantity) return err(`Only ${listing.quantity}kg available.`, 409);

  const newOrder = {
    id: `o${Date.now()}`,
    customerId,
    listingId,
    produce: listing.produce,
    quantityKg: Number(quantityKg),
    totalPrice: Number(quantityKg) * listing.pricePerKg,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // Mark listing as reserved
  listing.status = 'reserved';

  return ok(newOrder, 201);
}
