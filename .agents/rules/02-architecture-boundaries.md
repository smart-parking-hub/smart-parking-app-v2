# 02 — Architecture Boundaries
- Follow `app / layouts / features / entities / shared / styles`.
- `shared` is domain-agnostic and cannot import business features.
- Features expose only intentional public APIs through `index.ts` where useful.
- No deep imports into another feature's private implementation.
- Avoid circular dependencies and barrel files that hide dependency cycles.
- Keep pages as composition/orchestration; move reusable business behavior to feature hooks/services.
- Do not create empty folders or layers without a concrete use.
