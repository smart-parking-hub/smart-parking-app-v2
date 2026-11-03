# 06 — Client State and Forms

- **Strict State Separation:**
  1. **Server state:** Managed exclusively by TanStack Query.
  2. **Global UI state:** Managed by Redux Toolkit only when genuinely shared across independent features (e.g. sidebar collapsed, active tenant).
  3. **Local form state:** Managed by React Hook Form + Zod.
- Use local component state (`useState`, `useReducer`) for isolated UI interactions (dialog open/close, active tab).
- Use React Hook Form + Zod for CRM forms: ensure minimal re-renders, explicit default values, dirty state tracking, and clear error boundaries.
- Do not persist sensitive state (passwords, tokens, personal data) in unencrypted client storage.
- Do not invent speculative Redux slices for data that belongs to local features.
