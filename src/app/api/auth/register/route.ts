/**
 * POST /api/auth/register
 * 
 * Registers a new user (farmer | customer | logistics).
 * MOCK: Pushes to in-memory array.
 * SUPABASE SWAP: supabase.auth.signUp() + insert into 'profiles' table.
 */
import { NextRequest } from 'next/server';
import { users } from '@/lib/mockDb';
import { ok, err } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, role, location } = body;

  if (!name || !email || !phone || !role) {
    return err('name, email, phone, and role are required.', 422);
  }

  const validRoles = ['farmer', 'customer', 'logistics', 'admin'];
  if (!validRoles.includes(role)) {
    return err(`role must be one of: ${validRoles.join(', ')}`, 422);
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return err('Email already registered.', 409);
  }

  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    phone,
    role,
    location: location ?? '',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Return user without any sensitive fields
  return ok(newUser, 201);
}
