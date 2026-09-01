# Kissan Connect — Project Context & Handoff Document

> **SIH Problem Statement ID:** 26033  
> **Theme:** Agriculture, FoodTech & Rural Development  
> **Organization:** Ministry of Consumer Affairs, Food & Public Distribution (DoCA)  
> **Stack:** Next.js 15 · TypeScript · Tailwind CSS v4 · Supabase (MCP enabled) · App Router  
> **Project Root:** `/Users/nameadd/NOVUS/kissan-connect/`

---

## Problem Statement Summary

Multiple intermediaries reduce farmer earnings and inflate consumer prices.  
**Solution:** A digital marketplace that connects farmers/FPOs directly to consumers and bulk buyers, provides logistics support, and uses AI for demand forecasting and route optimization.

---

## 1. Frontend — Completed Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Main landing page — Hero, Explore cards, CTA |
| `/how-it-works` | `src/app/how-it-works/page.tsx` | Platform feature bento grid (Toll-Free IVR, B2C/B2B, AI Demand, Route Optimization) |
| `/ai-logistics` | `src/app/ai-logistics/page.tsx` | HUB model walkthrough + Live admin dashboard mock |
| `/impact` | `src/app/impact/page.tsx` | +40% farmer earnings, -20% consumer prices, -35% food waste — with CSS bar charts |
| `/signin` | `src/app/signin/page.tsx` | Interactive sign-in — role selector (Farmer / Customer / Logistics) connected to `POST /api/auth/login` |
| `/join` | `src/app/join/page.tsx` | Role selection onboarding connected to `POST /api/auth/register` |
| `/farmer` | `src/app/farmer/page.tsx` | Farmer Dashboard — manage listings, real-time CRUD, voice IVR simulation, orders tracker |
| `/marketplace` | `src/app/marketplace/page.tsx` | Customer Marketplace — produce discovery, live filters, instant checkout modal to `POST /api/orders`, My Orders tab |
| `/contact-sales` | `src/app/contact-sales/page.tsx` | B2B bulk buyer contact form with value prop |

### Design System
- **Primary color:** `emerald-600` (#059669)
- **Background:** `slate-50` / `white`
- **Border radius:** `rounded-3xl` for cards, `rounded-full` for buttons
- **Shadows:** `shadow-lg shadow-emerald-600/20` on CTAs
- **Animations:** `hover:-translate-y-1`, `group-hover:scale-110`, `animate-pulse`

---

## 2. Backend — Mock API (Live & Scalable)

All routes live at `src/app/api/` inside the Next.js App Router.  
**Architecture:** Mock in-memory DB in `src/lib/mockDb.ts` → swap for Supabase with **zero changes** to route handlers.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register user (name, email, phone, role, location) |
| `POST` | `/api/auth/login` | Login by email → returns user + mock JWT token |
| `GET` | `/api/listings` | Get all listings. Query: `?status=available&produce=Tomatoes` |
| `POST` | `/api/listings` | Farmer creates a new produce listing |
| `GET` | `/api/listings/:id` | Get a single listing by ID |
| `PATCH` | `/api/listings/:id` | Update listing status (available → reserved → sold) |
| `GET` | `/api/orders` | Get all orders. Query: `?customerId=u2&status=pending` |
| `POST` | `/api/orders` | Customer places an order (auto-marks listing as reserved) |
| `GET` | `/api/logistics/routes` | Get active AI-optimized delivery routes |
| `GET` | `/api/users` | List all users. Query: `?role=farmer` |

### Uniform Response Shape
```json
// Success
{ "success": true, "data": { ... } }

// Error  
{ "success": false, "error": "Reason here." }
```

### Key Library Files
| File | Purpose |
|---|---|
| `src/lib/mockDb.ts` | Central in-memory data store + TypeScript interfaces for all models |
| `src/lib/apiResponse.ts` | `ok()` and `err()` helpers for consistent response shape |

---

## 3. Database — NOT YET CREATED

Supabase is connected via MCP in Antigravity. **No tables have been created yet.**

### Planned Supabase Schema (SQL ready to apply)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('farmer', 'customer', 'logistics', 'admin')) NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES profiles(id),
  farmer_name TEXT,
  produce TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  location TEXT,
  status TEXT CHECK (status IN ('available', 'reserved', 'sold')) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  produce TEXT,
  quantity_kg NUMERIC,
  total_price NUMERIC,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES profiles(id),
  from_location TEXT,
  to_location TEXT,
  produce TEXT,
  saving_km NUMERIC,
  progress NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'completed')) DEFAULT 'active'
);
```

---

## 4. Supabase Migration Path (Mock → Real)

1. **Apply the SQL schema** above via Supabase MCP tool: `apply_migration`
2. **Install client:** `npm install @supabase/supabase-js`
3. **Create `src/lib/supabase.ts`:**
   ```ts
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   ```
4. **Swap route handlers** — each API file has a `SUPABASE SWAP:` comment with the exact query. Response shapes stay identical.
5. **Auth:** Replace mock JWT with `supabase.auth.signUp()` / `signInWithPassword()`

---

## 5. Pending / Next Steps

### Frontend
- [x] Connect Sign In form to `POST /api/auth/login`
- [x] Connect Join form to `POST /api/auth/register`
- [x] Build Farmer Dashboard — list & manage produce listings
- [x] Build Customer Marketplace — browse listings, place orders
- [x] Add mobile hamburger menu for navbar

### Backend
- [ ] Add real JWT signing with `jose` library
- [ ] Add middleware to protect role-gated routes
- [ ] `GET/PATCH /api/orders/:id` — single order status updates
- [ ] `GET /api/logistics/routes/:id`

### Database
- [ ] Apply Supabase schema (SQL above) via MCP `apply_migration`
- [ ] Add Row Level Security (RLS) policies (farmers see only their listings, etc.)
- [ ] Swap mock API functions with real Supabase queries

### AI / Stretch Goals
- [ ] Demand Forecasting — call Hugging Face inference endpoint from `/api/ai/forecast`
- [ ] Route Optimization — Google Maps Distance Matrix API or OR-Tools

---

## 6. How to Run

```bash
cd /Users/nameadd/NOVUS/kissan-connect
npm run dev
# → http://localhost:3000
```

### Test API (curl)
```bash
# Get all listings
curl http://localhost:3000/api/listings

# Create a listing
curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -d '{"farmerId":"u1","farmerName":"Ravi","produce":"Tomatoes","quantity":100,"pricePerKg":18,"location":"Nashik"}'

# Place an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"u2","listingId":"l1","quantityKg":5}'
```

---

## 7. Repository & Tooling

| Tool | Details |
|---|---|
| **Workspace root** | `/Users/nameadd/NOVUS/` |
| **App directory** | `/Users/nameadd/NOVUS/kissan-connect/` |
| **Skills directory** | `/Users/nameadd/NOVUS/.agents/skills/` |
| **MCP: Supabase** | Enabled in Antigravity — use `list_projects`, `execute_sql`, `apply_migration` |
| **Package manager** | npm |
| **Dev server** | `npm run dev` → `http://localhost:3000` |
