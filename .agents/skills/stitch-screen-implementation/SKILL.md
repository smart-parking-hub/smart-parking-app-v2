# Skill: Stitch HTML to One Production React Screen

## Purpose
Turn one user-supplied Stitch HTML/CSS design into one production-quality screen in the existing CRM frontend. This is implementation, not autonomous redesign.

## Mandatory Intake Prompt Standard
Whenever receiving Stitch HTML/CSS from the user, the agent operates strictly under the contract:
`# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM`
as codified in `.agents/rules/15-stitch-screen-by-screen.md` and `.agents/templates/task-brief-stitch-screen.md`.

## Mandatory Input Fields
Every Stitch screen task must specify or confirm:
- **Screen name:** `[Tên màn hình]`
- **Route:** `[Đường dẫn nếu đã biết]`
- **Existing module:** `[Module nghiệp vụ]`
- **Stitch HTML/CSS:** Pasted directly into the chat or provided as files
- **Assets:** Any associated icons, images, or SVGs

## 11 Strict Execution Rules (Inviolable)
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
- Ensure 0% legacy feature drop without explicit user sign-off.

### Phase 4: Report implementation plan and unresolved issues
- Present a concrete, concise plan to the user:
  - Files to create/update
  - Shared components/tokens used
  - Identified risks, discrepancies, or open questions
- Get confirmation before Phase 5.

### Phase 5: Implement the screen
- Write production React component using proper hooks, clean composition, and Tailwind CSS v4 styling.
- Ensure semantic markup and responsive layout.

### Phase 6: Integrate real API, permissions and business logic
- Connect to verified API services and typed DTOs.
- Implement RBAC permissions on sensitive controls.
- Provide comprehensive UI states: Loading, Error, Empty, Success, and Disabled.

### Phase 7: Run tests, build and visual comparison
- Run typecheck (`tsc --noEmit`), lint (`npm run lint`), tests (`npm run test`), and build (`npm run build`).
- Verify visual fidelity against Stitch at identical viewports.
- Verify accessibility (a11y) and keyboard navigation.

### Phase 8: Update documentation and report results
- Update `docs/09-audit/screen-inventory.md` and `docs/09-audit/parity-matrix.md`.
- Produce Task Report detailing what was done, what was out of scope, remaining limitations, and test logs.
- **HALT: Wait for user acceptance before proceeding to the next screen.**
