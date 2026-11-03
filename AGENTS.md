# AGENTS.md — CRM Frontend Engineering Constitution

> Status: BASELINE / PROJECT-AGNOSTIC  
> Owner: Project maintainers  
> Applies to: Every human developer and AI coding agent working in this repository.

## 1. Mission

Build a maintainable, secure, accessible, testable CRM frontend using React, Vite, TypeScript and Tailwind CSS v4. Preserve verified business behavior while redesigning the user experience.

This repository is a **parallel migration**. The legacy frontend remains the behavioral reference until each replacement capability has passed acceptance and the migration owner approves cutover.

## 2. Mandatory reading order

Before any non-trivial change:

1. Read this file.
2. Read applicable files under `.agents/rules/`.
3. Read the relevant `.agents/skills/<skill>/SKILL.md`.
4. For Stitch-based screen work, read `.agents/rules/15-stitch-screen-by-screen.md`, `.agents/skills/stitch-screen-implementation/SKILL.md`, and `.agents/workflows/stitch-to-react-one-screen.md`.
5. For Git branching, commits, and PRs, read `.agents/rules/13-git-and-collaboration.md` and `.agents/skills/git-branch-workflow/SKILL.md`.
6. Read `docs/00-governance/working-agreement.md`.
7. Read the relevant module documentation under `docs/05-modules/`.
8. Verify the implementation and contracts in source code / OpenAPI / backend evidence.
9. Read relevant ADRs under `docs/01-architecture/adr/`.

Do not claim to have read a file that was not actually inspected. If a referenced document is absent, report it.

## 3. Evidence hierarchy

When sources disagree, use this order for technical facts:

1. Running system behavior and verified backend implementation/API contract.
2. Current source code and executable tests.
3. Approved, current architecture decisions (ADRs).
4. Approved requirements and acceptance criteria.
5. Maintained project documentation.
6. Screenshots, mockups, old tickets and informal notes.
7. Assumptions.

This hierarchy does not authorize changing requirements silently. Record conflicts and ask the product owner when business intent is ambiguous.

Every important statement must be classified where appropriate:
- `VERIFIED`: supported by current source, API, test, or confirmed behavior.
- `ASSUMED`: plausible but not confirmed.
- `UNKNOWN`: evidence is missing.
- `CONFLICT`: credible sources disagree.
- `DEPRECATED`: intentionally superseded.

Never turn `ASSUMED`, `UNKNOWN`, or `CONFLICT` into implementation facts without resolution.

## 4. Non-negotiable rules

- Do not invent business rules, endpoints, DTO fields, permission codes, status values, or workflow transitions.
- Do not remove, weaken, or bypass existing business functionality during redesign.
- Do not treat frontend route guards or hidden buttons as backend authorization.
- Do not introduce a dependency without explaining its purpose, cost, alternatives, and maintenance impact.
- Do not create duplicate shared components, API clients, formatters, or design tokens.
- Do not place feature-specific business logic in global layouts or generic shared UI.
- Do not use `any` to silence type errors. Use `unknown` and narrow it.
- Do not hardcode secrets, tokens, environment-specific URLs, or personal data.
- Do not silently change API contracts or authentication behavior.
- Do not overwrite or delete legacy implementation during parallel migration.
- Do not claim tests/builds passed unless they were executed and the result was observed.
- Do not make broad formatting or unrelated refactors in a task-specific change.

## 5. Required workflow

For every task larger than a trivial typo:

1. **Understand:** restate the requested outcome and identify unknowns.
2. **Locate:** find the owning feature, existing implementation, docs, tests and API contract.
3. **Impact:** list affected routes, components, endpoints, permissions, state, tests and docs.
4. **Plan:** propose a small ordered implementation plan and acceptance criteria.
5. **Implement:** make the smallest coherent change within approved boundaries.
6. **Verify:** run relevant typecheck, lint, tests and build; run E2E for critical flows.
7. **Review:** inspect diff for regressions, accessibility, security and duplication.
8. **Document:** update affected docs and traceability.
9. **Report:** provide evidence, limitations and unresolved risks.

For low-risk, clearly scoped tasks, combine steps in one pass but do not skip verification.

## 6. Architecture boundaries

Target architecture:
- `app/`: application bootstrap, providers, router and global configuration.
- `layouts/`: structural shells only.
- `features/`: business capabilities and feature-specific UI.
- `entities/`: reusable domain concepts only when genuinely shared.
- `shared/`: domain-agnostic UI, API infrastructure, hooks and utilities.
- `styles/`: global styles and design tokens.

Dependency direction:
- `app` may compose all layers.
- `features` may use `entities` and `shared`.
- `entities` may use `shared` only where justified.
- `shared` must not import from `features` or `entities`.
- One feature must not reach into another feature's private files. Use explicit public exports or an approved application-level composition.
- Avoid circular dependencies.

The exact feature list and module boundaries are **not approved until repository audit**.

### 6.1. Approved Technology Stack & State Separation (ADR-0001)

Read and adhere to [`docs/01-architecture/technology-catalog.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/technology-catalog.md) and [`docs/01-architecture/adr/0001-technology-stack-and-state-management.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/adr/0001-technology-stack-and-state-management.md).

**Strict separation of 3 state categories:**
1. **Server State (API responses, cache, loading, error):** Exclusively handled by **TanStack Query**. *Anti-pattern: NEVER put API responses in Redux.*
2. **Global Client/UI State:** Handled by **Redux Toolkit** ONLY when genuinely shared across multiple distinct features/layouts.
3. **Local Form State:** Handled by **React Hook Form + Zod**.

**Quality-First Dependency Evaluation:**
- Do NOT install libraries blindly on day one.
- Before introducing any package from the on-demand radar (Orval, TanStack Virtual, Recharts, FullCalendar, TipTap, Socket.IO Client), evaluate against the 5 Gold Criteria:
  1. Business necessity.
  2. Bundle size & performance cost.
  3. React 19 / TS strict / Tailwind v4 compatibility.
  4. Testing & a11y support.
  5. Long-term quality and maintainability.
- If it cannot be proven to make the code cleaner, faster, or higher quality: **DO NOT ADD**. Quality always comes first.

## 7. UI and redesign integrity

A redesign may change presentation and interaction ergonomics, but must preserve verified:
- capabilities and user journeys;
- data meaning and API mapping;
- permission behavior;
- validation and business constraints;
- status transitions and side effects;
- error handling and exceptional states.

Before replacing a legacy screen, create a screen inventory and a behavior/permission checklist. Every action on the old screen must be mapped to a new action, explicitly marked obsolete with approval, or recorded as unresolved.

Every data-driven screen must consider loading, initial empty, filtered empty, error, success, disabled, permission-denied and partial-data states where applicable.

## 8. Mandatory Stitch Screen Intake Protocol & Execution

> [!CRITICAL]
> Whenever the user provides or pastes Stitch HTML/CSS or requests a UI screen implementation, the agent **MUST ALWAYS** accompany the request with and strictly enforce the **11 Strict Execution Rules**, **8-Phase Execution Order**, and **Completion Conditions** defined below and in `.agents/rules/15-stitch-screen-by-screen.md`.

### 8.1. 11 Strict Execution Rules
1. **Single-Screen Boundary:** Implement exactly ONE screen per task.
2. **Full Intake Inspection:** Read the complete HTML/CSS and all style declarations before writing any code.
3. **Approved Visual Authority:** Stitch is the approved visual reference.
4. **Visual Fidelity Preservation:** Do NOT modify colors, typography, spacing, layout, or visual hierarchy arbitrarily.
5. **Business Logic Invariant:** Do NOT add, remove, or alter business functionality without explicit approval.
6. **Legacy Parity Audit:** Thoroughly inspect the legacy screen and map every existing capability.
7. **Contract Verification:** Verify real API endpoints, DTOs, permissions, and business validation rules against backend source code.
8. **Production React/TS Component:** Convert markup into clean, idiomatic React 19 + TypeScript + Tailwind CSS v4 components adhering to the 4-layer architecture.
9. **No Static HTML Cut:** Never deliver raw static HTML or `dangerouslySetInnerHTML` as the final product.
10. **Zero Cross-Screen Bleed:** Do NOT modify or refactor unrelated screens.
11. **Hard Stop Gate:** Do NOT proceed to the next screen until the user formally reviews and approves the current screen.

### 8.2. 8-Phase Execution Order
- **Phase 1: Analyze Stitch source:** Parse layout structure, tokens, components, responsive breakpoints, and placeholder elements.
- **Phase 2: Inspect existing frontend & backend contracts:** Map current routes, inspect legacy screen actions, and verify backend DTOs/endpoints.
- **Phase 3: Create capability parity matrix:** Map old capabilities vs. new Stitch presentation (`Preserved`, `Changed`, `Missing`, `Clarify`).
- **Phase 4: Report implementation plan & unresolved issues:** Share plan, affected files, risks, and open questions before coding.
- **Phase 5: Implement the screen:** Build React components, apply Tailwind styling, and establish UI structure.
- **Phase 6: Integrate real API, permissions & business logic:** Wire authenticated API calls, role permissions, and full UI state handling.
- **Phase 7: Run tests, build & visual comparison:** Verify TypeScript, lint, unit tests, production build, and side-by-side visual fidelity.
- **Phase 8: Update documentation & report results:** Update screen inventory, parity matrix, and submit task report. **STOP and wait for user acceptance.**

### 8.3. Completion Conditions
Never declare completion simply because the UI renders. The agent must verify:
- Visual fidelity against Stitch reference.
- Existing business capability parity (100% accounted for).
- Real API integration & data contracts.
- Permission enforcement (RBAC).
- Complete state handling (Loading, Empty, Error, Success, Disabled).
- Responsive behavior across target viewports.
- Accessibility (a11y) & keyboard navigation.
- TypeScript check (`tsc --noEmit`), lint, unit tests, and production build (`vite build`).
- Final report documenting what was done, what was out of scope, remaining issues, and test evidence.
- **HALT and wait for user acceptance.**

## 9. Security and privacy

- Backend authorization is authoritative.
- Never store credentials or secrets in source control.
- Do not log access tokens, refresh tokens, passwords, sensitive personal data or full API payloads by default.
- Follow the verified authentication architecture; do not choose localStorage/cookie/token handling by assumption.
- Validate untrusted API and URL-derived data at appropriate boundaries.
- Avoid rendering untrusted HTML.
- Use least privilege for environment variables and CI secrets.
- Treat screenshots and production data as potentially sensitive.

## 10. Quality gates

Before a task is marked complete, report applicable results:
- TypeScript typecheck.
- ESLint.
- Unit/component tests.
- Integration tests.
- Production build.
- Playwright E2E for critical workflows.
- Accessibility checks for changed interactive screens.
- Manual visual comparison at agreed viewports.

A failed or unavailable check must be reported as such, not omitted.

## 11. Documentation and decision control

- Update module docs when behavior, routes, API usage, permissions or tests change.
- Create an ADR for significant architectural decisions.
- Never rewrite historical decisions; supersede them with a new ADR.
- Keep generated API artifacts traceable to their OpenAPI source and generation command.
- Add `last_verified`, evidence and owner to volatile documentation.

## 12. Task completion report

Use the template in `.agents/templates/task-report.md`. At minimum report:
- objective and scope;
- files created/modified/deleted;
- business behavior preserved or changed;
- API and permission assumptions;
- tests and exact outcomes;
- screenshots or visual evidence where relevant;
- documentation updated;
- known limitations and follow-up items.

## 13. Stop conditions

Stop and ask for clarification/approval when:
- business behavior is ambiguous or conflicting;
- a required API contract is unavailable;
- authentication/security behavior would need to be guessed;
- a change crosses module boundaries without an approved design;
- a task would delete legacy behavior or data;
- a migration cutover is requested without acceptance evidence;
- a dependency or architectural change has material long-term consequences.
