/**
 * GET /api/logistics/routes  — Return active AI-optimized delivery routes
 * 
 * SUPABASE SWAP:
 *   supabase.from('routes').select('*').eq('status', 'active')
 * 
 * AI INTEGRATION NOTE:
 *   In production, this endpoint calls an ML model / Google OR-Tools
 *   to compute optimal routes before returning them.
 */
import { NextRequest } from 'next/server';
import { routes } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function GET() {
  return ok(routes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { driverId, from, to, produce, savingKm } = body;

  if (!from || !to || !produce) {
    return err('from, to, and produce are required.', 422);
  }

  const newRoute = {
    id: `r${Date.now()}`,
    driverId: driverId || 'u3',
    from,
    to,
    produce,
    savingKm: savingKm ? Number(savingKm) : Math.floor(Math.random() * 15) + 5,
    progress: 0,
    status: 'active' as const,
  };

  routes.unshift(newRoute);
  return ok(newRoute, 201);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, progress, status } = body;

  if (!id) {
    return err('id is required.', 422);
  }

  const route = routes.find(r => r.id === id);
  if (!route) return err('Route not found.', 404);

  if (progress !== undefined) {
    route.progress = Math.min(100, Math.max(0, Number(progress)));
    if (route.progress === 100) {
      route.status = 'completed';
    }
  }

  if (status) {
    route.status = status;
  }

  return ok(route);
}
