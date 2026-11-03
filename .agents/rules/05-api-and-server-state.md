# 05 — API and Server State

- Use the centralized Axios HTTP client and feature-owned API modules.
- **TanStack Query is the exclusive server-state and cache layer:** Redux Toolkit is strictly NOT an API response cache.
- Never duplicate or mirror server state from TanStack Query into Redux stores.
- Query keys must be centralized or consistently feature-scoped and include all identity/filter inputs.
- Mutations must invalidate or update the correct queries and handle errors visibly.
- Do not assume pagination, sorting, filtering or response envelopes; verify the contract against backend source code.
- Normalize API errors in one place while preserving useful field-level validation details for React Hook Form.
- Generate clients from OpenAPI (via Orval or openapi-generator) only after schema quality and generation workflow are verified.
