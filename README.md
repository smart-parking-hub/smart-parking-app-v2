# CRM Frontend Governance Starter

This package is a project-agnostic governance and audit starter for a **new React frontend developed in parallel with a legacy CRM frontend**.

## What is included
- Root `AGENTS.md` constitution.
- `.agents/rules/` mandatory engineering rules.
- `.agents/skills/` task-specific playbooks.
- `.agents/workflows/` repeatable development procedures.
- `.agents/templates/` task, ADR and completion templates.
- `docs/` architecture, design, API governance, quality, migration and audit templates.
- `src/README.md` proposed source layout.

## Important limitation
The target repository was not identified or supplied when this pack was created. Therefore:
- no actual business modules are asserted;
- no existing API endpoint or permission is invented;
- no current frontend behavior is claimed as audited;
- no package versions or authentication strategy are finalized.

Treat all target architecture content as a proposal until verified.

## First actions
1. Extract this folder at the root of the new or existing frontend repository.
2. Provide the actual repository name/path and read access.
3. Run the audit workflow before generating the React application.
4. Replace placeholders with evidence-backed project facts.
5. Configure Antigravity to load root `AGENTS.md` and relevant `.agents/` files; verify discovery with a small test task.
6. Approve ADRs for unresolved architecture decisions.
7. Build the foundation and migrate one pilot module before scaling.

## Recommended baseline commands after app initialization
Exact scripts depend on the chosen package manager and generated project:
- typecheck
- lint
- test
- build
- e2e

Do not paste these commands into CI until matching scripts exist in `package.json`.


## Stitch → React workflow (selected project mode)

- Delivery unit: **one screen at a time**.
- Design input: **user pastes HTML/CSS directly** into the Antigravity task.
- The pasted source is the visual reference; it is not an API/business specification.
- The agent analyzes, maps legacy capabilities, plans, implements, visually validates, reports, and stops for approval.
- Do not batch-convert screens or redesign the supplied design without approval.

Read:
- `.agents/rules/15-stitch-screen-by-screen.md`
- `.agents/skills/stitch-screen-implementation/SKILL.md`
- `.agents/workflows/stitch-to-react-one-screen.md`
- `docs/03-design-system/stitch-source-intake.md`
