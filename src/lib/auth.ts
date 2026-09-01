export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'customer' | 'logistics' | 'admin';
  location?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'kissan_connect_user';
const TOKEN_KEY = 'kissan_connect_token';

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser, token?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.error('Error saving user to localStorage', e);
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error removing user from localStorage', e);
  }
}

export const DEMO_ACCOUNTS = {
  farmer: {
    name: 'Ravi Kumar',
    email: 'ravi@farm.in',
    phone: '9876543210',
    role: 'farmer' as const,
    location: 'Nashik, Maharashtra',
  },
  customer: {
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    phone: '9123456789',
    role: 'customer' as const,
    location: 'Pune, Maharashtra',
  },
  logistics: {
    name: 'Amit Logistics Hub',
    email: 'amit@logistics.in',
    phone: '9001234567',
    role: 'logistics' as const,
    location: 'Mumbai, Maharashtra',
  },
};
