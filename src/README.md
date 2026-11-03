# Application Source Architecture (Deliverable B)

> Status: INITIALIZED & ACTIVE  
> Framework: React 19 + TypeScript Strict + Tailwind CSS v4 + Vite  
> Architecture: 4-Layer Feature-Driven Architecture

---

## 1. Directory Structure

```text
src/
├── app/               # Application bootstrap, providers, router, global UI store
│   ├── pages/         # Baseline overview and root routing pages
│   ├── providers/     # QueryProvider (TanStack Query), StoreProvider (Redux)
│   ├── router/        # React Router centralized configuration
│   ├── store/         # Redux Toolkit global UI state (uiSlice)
│   ├── App.tsx        # Root Application component
│   └── App.test.tsx   # Smoke / baseline unit test
│
├── layouts/           # Structural shells (RootLayout, Sidebar, Navigation)
│
├── features/          # Business modules (Parking lots, Bookings, Payments, Users)
│                      # Created screen-by-screen adhering to Stitch Rule 15
│
├── entities/          # Shared domain entities & data contracts
│
├── shared/            # Domain-agnostic UI primitives, API client, hooks, utilities
│   ├── api/           # Centralized Axios client & request interceptors
│   ├── components/    # Reusable shadcn/ui and Radix headless primitives
│   ├── hooks/         # Generic reusable React hooks
│   └── utils/         # Helper functions (cn = clsx + twMerge, formatters)
│
├── styles/            # Global Tailwind CSS v4 styles (globals.css)
├── test/              # Vitest test setup and testing utilities
└── main.tsx           # React DOM root render entry point
```

---

## 2. Coding Guidelines
- **Strict Separation of 3 State Types:**
  - Server state: TanStack Query exclusively.
  - Global UI state: Redux Toolkit exclusively.
  - Form state: React Hook Form + Zod.
- **Single-Screen Intake:** Follow `.agents/rules/15-stitch-screen-by-screen.md` for every screen implementation.
