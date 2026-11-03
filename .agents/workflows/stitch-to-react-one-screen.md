# Workflow: Stitch HTML → One React Screen

## Trigger
The user provides Stitch HTML/CSS using the standardized `# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM` intake prompt.

---

## Phase 1: Analyze Stitch source
1. Confirm exactly one screen is in scope.
2. Read the full HTML/CSS source completely before touching any project files.
3. Extract layout structure, design tokens (colors, typography, spacing, shadows), breakpoints, and components.
4. Filter out export artifacts, external CDN tags, demo scripts, and placeholder data.

## Phase 2: Inspect existing frontend and backend contracts
1. Locate corresponding legacy screen in `smart-parking-app/src/`.
2. Document all existing user actions, forms, filters, tables, and modal triggers.
3. Inspect backend microservice in `smart-parking-microservice/`:
   - Controller endpoints, HTTP methods, headers.
   - Request/Response DTOs and field types.
   - Security annotations, roles, and authorization rules.
4. Identify any legacy capability missing from the new Stitch design.

## Phase 3: Create capability parity matrix
1. Construct the Parity Matrix for the screen:
   - Feature name
   - Old screen implementation
   - Stitch visual counterpart
   - Target React component
   - Backend endpoint & permission
   - Parity status (`Preserved` | `Modified` | `MissingInDesign` | `PendingClarification`)
2. Flag any discrepancy to the user immediately.

## Phase 4: Report implementation plan and unresolved issues
1. Submit a concise implementation plan:
   - Target file paths (`src/features/<module>/...`).
   - Shared components to be used.
   - Design tokens to be applied.
   - Known limitations or open questions.
2. Wait for user acknowledgement on critical ambiguities.

## Phase 5: Implement the screen
1. Develop React 19 + TypeScript components according to project architectural standards.
2. Apply Tailwind CSS v4 styling matching Stitch visual layout faithfully.
3. Ensure semantic HTML, responsive behavior, and accessibility.

## Phase 6: Integrate real API, permissions and business logic
1. Wire verified API client calls and TypeScript types.
2. Enforce permission gates on restricted buttons/actions.
3. Implement all mandatory UI states:
   - Loading State (Skeleton/Spinner)
   - Empty State (Empty illustration/prompt)
   - Error State (Error alert + Retry trigger)
   - Success State (Active data presentation)
   - Disabled State (Form/action lock)

## Phase 7: Run tests, build and visual comparison
1. Execute `tsc --noEmit` / typecheck.
2. Execute linter checks.
3. Execute relevant unit/component tests.
4. Execute `vite build` production build.
5. Perform visual verification against Stitch design at identical viewports.
6. Verify keyboard navigation and focus states.

## Phase 8: Update documentation and report results
1. Update `docs/09-audit/screen-inventory.md`.
2. Update `docs/09-audit/parity-matrix.md`.
3. Generate detailed Task Report using `.agents/templates/task-report.md`.
4. **HALT: STOP and wait for user formal acceptance before starting any other screen.**
