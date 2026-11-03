# Workflow: New or Redesigned Screen

For a screen supplied from Stitch, follow `.agents/workflows/stitch-to-react-one-screen.md` as the controlling workflow.

1. Lock scope to one screen only.
2. Read the complete user-pasted Stitch HTML/CSS and assets; wait for all numbered parts and the end marker if split.
3. Treat Stitch as the visual reference, not as a source of business/API truth.
4. Inventory the existing screen's users, permissions, data, actions, filters, validation and states.
5. Verify APIs and business rules from the current source/backend contract.
6. Map every existing capability to the new screen or record why it is missing.
7. Plan exact files, components, integration points and acceptance criteria.
8. Implement the screen in React + TypeScript using existing project conventions.
9. Verify visual fidelity, responsive behavior, keyboard accessibility and all implemented actions.
10. Run relevant tests/build and update screen inventory/parity records.
11. Report evidence and stop. Do not start another screen until the owner approves this screen and authorizes the next one.
