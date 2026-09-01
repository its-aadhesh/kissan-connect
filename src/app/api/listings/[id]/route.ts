/**
 * GET  /api/listings/[id]   — Get a single listing by ID
 * PATCH /api/listings/[id]  — Update listing status (e.g., mark as reserved/sold)
 * 
 * SUPABASE SWAP:
 *   GET:   supabase.from('listings').select('*').eq('id', id).single()
 *   PATCH: supabase.from('listings').update({ status }).eq('id', id)
 */
import { NextRequest } from 'next/server';
import { listings } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = listings.find(l => l.id === id);
  if (!listing) return err('Listing not found.', 404);
  return ok(listing);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) return err('Listing not found.', 404);

  const validStatuses = ['available', 'reserved', 'sold'];
  if (status && !validStatuses.includes(status)) {
    return err(`status must be one of: ${validStatuses.join(', ')}`, 422);
  }

  if (status) listings[idx].status = status;

  return ok(listings[idx]);
}
