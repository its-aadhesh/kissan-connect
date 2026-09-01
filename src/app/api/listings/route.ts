/**
 * GET  /api/listings        — Get all available listings (marketplace)
 * POST /api/listings        — Create a new produce listing (farmer only)
 * 
 * SUPABASE SWAP:
 *   GET:  supabase.from('listings').select('*').eq('status', 'available')
 *   POST: supabase.from('listings').insert(newListing)
 */
import { NextRequest } from 'next/server';
import { listings } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');   // ?status=available
  const produce = searchParams.get('produce'); // ?produce=Tomatoes

  let filtered = [...listings];

  if (status) filtered = filtered.filter(l => l.status === status);
  if (produce) filtered = filtered.filter(l => l.produce.toLowerCase().includes(produce.toLowerCase()));

  return ok(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { farmerId, farmerName, produce, quantity, pricePerKg, location } = body;

  if (!farmerId || !produce || !quantity || !pricePerKg || !location) {
    return err('farmerId, produce, quantity, pricePerKg, and location are required.', 422);
  }

  const newListing = {
    id: `l${Date.now()}`,
    farmerId,
    farmerName: farmerName ?? 'Unknown Farmer',
    produce,
    quantity: Number(quantity),
    pricePerKg: Number(pricePerKg),
    location,
    status: 'available' as const,
    createdAt: new Date().toISOString(),
  };

  listings.push(newListing);
  return ok(newListing, 201);
}
