# Hostella Super Admin (Frontend)

Next.js app for hostel administration, bookings, messaging, analytics, and user management. Frontend is wired for backend APIs; authentication + profile + verification now read live data via `/auth/me`, and file uploads send proper `FormData` without forcing JSON headers.

## Quick Start

```bash
npm install
echo "API_URL=https://your-backend-api.com" > .env.local
npm run dev
# open http://localhost:3000
```

## Environment

```
API_URL=https://your-backend-api.com
```

## Key Docs (read in order)
1) [BACKEND_HANDOFF.md](BACKEND_HANDOFF.md) – backend integration overview and expectations  
2) [API_INTEGRATION_DOCS.md](API_INTEGRATION_DOCS.md) – full endpoint specifications

## Testing

```bash
npm test            # all tests
npm test --watch
npm test --coverage
```

## Stack
- Next.js 16 / React 19
- Zustand state
- Tailwind CSS
- React Hook Form + Zod
- Jest + React Testing Library
- Radix UI

## Notable Behavior
- Middleware: redirects unauthenticated users away from protected routes; redirects authenticated users from `/` to `/dashboard`.
- API client: auto-attaches bearer token; skips `Content-Type` when sending `FormData` (supports avatar uploads).
- Dashboard UX: shows inline error banner while keeping layout visible; skeletons render only for data regions that are loading.
- Profile/Verification: fetch from backend (`/auth/me`), no dummy fallbacks; default avatar uses icon if none provided.

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run start     # start production
npm run lint      # ESLint
npm test          # tests
```

## Project Structure

```
src/
├─ app/            # Next.js app router
│  ├─ (auth)/      # Auth pages
│  └─ dashboard/   # Main app
├─ components/     # Reusable UI
├─ stores/         # Zustand stores
├─ types/          # TS types
├─ lib/            # API client & utils
└─ hooks/          # Custom hooks
```

## Integration Status
- Frontend: ready
- Docs: ready
- Tests: green
- Backend API: plug in `API_URL` and wire endpoints per docs

Questions? Check the docs above or the tests in `src/**/__tests__/` for expected behavior.