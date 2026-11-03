# Skill: Stitch HTML to One Production React Screen

## Purpose
Turn one user-supplied Stitch HTML/CSS design into one production-quality screen in the existing CRM frontend. This is implementation, not autonomous redesign.

## Mandatory Intake Prompt Standard
Whenever receiving Stitch HTML/CSS from the user, the agent operates strictly under the contract:
`# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM`
as codified in `.agents/rules/15-stitch-screen-by-screen.md`.

## 14 Strict Execution Rules (Inviolable)
1. Single screen only per task.
2. Read all HTML/CSS before touching code.
3. Stitch is the approved visual authority.
4. Zero unauthorized visual changes (color, typography, layout, spacing).
5. Zero unauthorized business changes (no inventing/deleting logic).
6. Mandatory legacy screen audit for feature parity.
7. Verify all API contracts, DTOs, and permissions against Backend code.
8. Produce clean React 19 + TypeScript + Tailwind CSS v4 components.
9. No static HTML / `dangerouslySetInnerHTML` hacks.
10. No cross-screen regressions or out-of-scope edits.
11. Hard stop for user approval before moving to next screen.
12. **Zero-Error & Zero-Warning Gate:** Clean all red errors (TypeScript, build, test, console) and yellow warnings (ESLint, unused vars, React hooks, and Tailwind canonical classes).
13. **Component Reusability & Placement Assessment:** Rigorously categorize each component into `shared/components/`, `entities/`, or `features/<feature>/components/`.
14. **Design Intelligence & Adaptive UI Enforcement:** Apply `.agents/skills/design-intelligence/SKILL.md` (Preserve Intent, Improve Execution, Type A/B/C/D classification, and 0 `suggestCanonicalClasses` differences).

## 8-Phase Procedure

### Phase 1: Analyze Stitch source
- Inspect layout, CSS classes, typography, spacing, colors, breakpoints, icons, and placeholder elements.
- Create an implementation map separating real UI elements from static artifacts.

### Phase 2: Inspect existing frontend and backend contracts
- Identify legacy screen route, user roles, actions, and API bindings.
- Inspect Backend microservice controllers, DTOs, authorization checks, and error responses.

### Phase 3: Create capability parity matrix
- Map every legacy feature to the new Stitch screen:
  `Legacy Capability -> Stitch Element -> React Component -> Backend API -> Status`

### Phase 4: Report implementation plan & Component placement
- Present a concrete, concise plan to the user:
  - Files to create/update
  - **Component Placement Assessment:** Categorize each component into `shared/`, `entities/`, or `features/<feature>/components/`.
  - Identified risks, discrepancies, or open questions

### Phase 5: Implement the screen
- Write production React components using proper composition and Tailwind CSS v4 styling.
- Ensure semantic markup, responsive layout, and clean typing.

### Phase 6: Integrate real API, permissions and business logic
- Connect to verified API services and typed DTOs.
- Implement RBAC permissions on sensitive controls.
- Provide comprehensive UI states: Loading, Error, Empty, Success, and Disabled.

### Phase 7: Run tests, build and ZERO-ERROR / ZERO-WARNING verification
- Run typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 errors.
- Run linter: `npm run lint` (`eslint .`) -> 0 errors, 0 warnings.
- Run tests: `npm run test` (`vitest run`) -> 100% PASS.
- Run build: `npm run build` (`tsc -b && vite build`) -> PASS.
- Verify browser console: no red errors, no yellow warnings.

### Phase 8: Update documentation, report results & Reusability assessment
- Update `docs/09-audit/screen-inventory.md` and `docs/09-audit/parity-matrix.md`.
- Produce Task Report detailing:
  - Zero-error & zero-warning evidence
  - Reusability & architectural placement assessment table
  - What was done, what was out of scope, remaining limitations
- **HALT: Wait for user acceptance before proceeding to the next screen.**
