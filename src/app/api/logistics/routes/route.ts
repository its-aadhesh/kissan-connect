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
import { routes } from '@/lib/mockDb';
import { ok } from '@/lib/apiResponse';

export async function GET() {
  const activeRoutes = routes.filter(r => r.status === 'active');
  return ok(activeRoutes);
}
