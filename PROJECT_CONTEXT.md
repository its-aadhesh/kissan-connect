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
| `/ai-logistics` | `src/app/ai-logistics/page.tsx` | Interactive AI Logistics & HUB Command Center — live vehicle dispatch, cold-chain IoT telematics, order fulfillment, and regional HUB capacity monitoring |
| `/impact` | `src/app/impact/page.tsx` | +40% farmer earnings, -20% consumer prices, -35% food waste — with CSS bar charts |
| `/signin` | `src/app/signin/page.tsx` | Interactive sign-in — 1-click role selector (Farmer / Customer / Logistics) connected to `POST /api/auth/login` |
| `/join` | `src/app/join/page.tsx` | Role selection onboarding connected to `POST /api/auth/register` |
| `/farmer` | `src/app/farmer/page.tsx` | Farmer Dashboard — manage listings, real-time CRUD, voice IVR simulation, orders tracker |
| `/marketplace` | `src/app/marketplace/page.tsx` | Customer Marketplace — produce discovery, live filters, instant checkout modal to `POST /api/orders`, My Orders tab |
| `/contact-sales` | `src/app/contact-sales/page.tsx` | B2B bulk buyer contact form with value prop |

### Design System
- **Primary color:** `emerald-600` (#059669)
- **Background:** `slate-50` / `white` (for public/marketplace/farmer) & `slate-900` (for logistics command center)
- **Border radius:** `rounded-3xl` for cards, `rounded-full` for buttons
- **Shadows:** `shadow-lg shadow-emerald-600/20` on CTAs
- **Animations:** `hover:-translate-y-1`, `group-hover:scale-110`, `animate-pulse`

---

## 2. Backend — Mock API (Live & Scalable)

All routes live at `src/app/api/` inside the Next.js App Router.  
**Architecture:** Mock in-memory DB in `src/lib/mockDb.ts` + Supabase client in `src/lib/supabase.ts`.

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
| `PATCH` | `/api/orders` | Update order status (`pending` → `in_transit` → `delivered`) |
| `GET` | `/api/logistics/routes` | Get active AI-optimized delivery routes |
| `POST` | `/api/logistics/routes` | Dispatch a new AI multi-stop route |
| `PATCH` | `/api/logistics/routes` | Update route GPS progress and completion status |
| `GET` | `/api/users` | List all users. Query: `?role=farmer` |

---

## 3. Database — CREATED & SEEDED IN SUPABASE

Supabase project `its-aadhesh's Project` (`mbnwtelvfzjofeeviutg`) is restored and **ACTIVE_HEALTHY**.
Tables have been created and seeded via Supabase MCP:
- `public.profiles` (Users & roles)
- `public.listings` (Farmer produce listings)
- `public.orders` (Customer direct orders)
- `public.routes` (AI-optimized fleet routes)

Environment variables are set in `.env.local`, and `@supabase/supabase-js` is installed with client configured in `src/lib/supabase.ts`.

---

## 5. Completed & Next Steps

### Frontend (100% Completed)
- [x] Connect Sign In form to `POST /api/auth/login`
- [x] Connect Join form to `POST /api/auth/register`
- [x] Build Farmer Dashboard — list & manage produce listings, IVR simulation, order tracking
- [x] Build Customer Marketplace — browse listings, place direct orders, live cart & checkout
- [x] Build AI Logistics & HUB Command Center (`/ai-logistics`) — live route dispatch, truck progress simulator, IoT cold-chain telematics, order fulfillment, and DoCA regional hub capacity monitoring
- [x] Add mobile hamburger menu & role-aware navigation in `Navbar.tsx`

### Database (Created via MCP)
- [x] Restore Supabase project from inactive status
- [x] Apply schema for `profiles`, `listings`, `orders`, `routes` via Supabase MCP
- [x] Seed initial data into Supabase
- [x] Configure `.env.local` and `src/lib/supabase.ts`

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
