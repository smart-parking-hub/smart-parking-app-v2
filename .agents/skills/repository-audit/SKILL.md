# Skill: Repository Audit

## Goal
Create an evidence-backed baseline of the existing frontend, backend contracts, product behavior and migration risks before implementation.

## Inputs
Repository root(s), available environments, access level, product owner contact, known deployment URLs if safe.

## Procedure
1. Inspect repository tree, package manifests, lockfiles, framework versions, scripts and CI.
2. Identify app entry points, routing, layouts, feature/module boundaries and shared components.
3. Inventory routes/screens; capture role/permission visibility and all visible actions.
4. Trace each screen's data to API client, endpoint, DTO, query/mutation and backend implementation/OpenAPI.
5. Inspect auth/session lifecycle, refresh/logout, protected routes and permission source.
6. Inspect forms, validation, pagination/filtering/sorting, file upload/download and realtime behavior.
7. Inspect tests, accessibility, responsive behavior, error states, monitoring and build/deploy setup.
8. Compare docs with source and label VERIFIED / ASSUMED / UNKNOWN / CONFLICT / DEPRECATED.
9. Produce risk register, dependency map, screen parity matrix and migration recommendation.
10. Ask for missing access; do not infer hidden behavior from screenshots alone.

## Outputs
- `docs/09-audit/README.md`
- `docs/09-audit/repository-inventory.md`
- `docs/09-audit/screen-inventory.csv` (or Markdown table)
- `docs/09-audit/api-contract-inventory.md`
- `docs/09-audit/auth-permission-audit.md`
- `docs/09-audit/risk-register.md`
- `docs/09-audit/parity-matrix.md`

## Completion
Audit is complete only when every discovered route is accounted for, unknowns are explicit, and high-risk auth/business flows have evidence or named blockers.
