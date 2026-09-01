/**
 * POST /api/auth/login
 * 
 * Authenticates a user by email.
 * MOCK: Looks up in-memory array, returns user object.
 * SUPABASE SWAP: supabase.auth.signInWithPassword({ email, password })
 * JWT SWAP: Sign a JWT here with jose/jsonwebtoken and return as cookie or header.
 */
import { NextRequest } from 'next/server';
import { users } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return err('email is required.', 422);
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return err('No account found with that email.', 404);
  }

  // In production: verify password hash here, then issue JWT
  return ok({
    user,
    token: `mock-jwt-token-for-${user.id}`, // Replace with real JWT
  });
}
