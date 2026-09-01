/**
 * GET /api/users             — List all users (admin use)
 * GET /api/users?role=farmer — Filter by role
 * 
 * SUPABASE SWAP:
 *   supabase.from('profiles').select('*').eq('role', role)
 */
import { NextRequest } from 'next/server';
import { users } from '@/lib/mockDb';
import { ok } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  const filtered = role ? users.filter(u => u.role === role) : users;
  return ok(filtered);
}
