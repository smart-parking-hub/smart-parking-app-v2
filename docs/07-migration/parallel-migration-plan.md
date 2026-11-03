# Parallel Migration Plan

## Goal
Introduce the new frontend without prematurely removing the legacy frontend.

## Principles
- Keep legacy deployment/source available.
- Reuse the existing backend contract where possible; changes require explicit coordination.
- Establish screen/feature parity before cutover.
- Avoid simultaneous changes to frontend behavior and backend semantics unless required.
- Define routing/domain strategy early: separate host, path prefix or controlled feature routing.
- Avoid conflicting cookies, storage keys and callback URLs between old/new apps.

## Stages
1. Discover: inventory screens, routes, actors, APIs, permissions and workflows.
2. Foundation: create new app shell, tokens, API/auth infrastructure and observability.
3. Pilot: migrate one representative low/medium-risk module end-to-end.
4. Validate: compare behavior, permissions, responsive UI and production telemetry.
5. Expand: migrate module-by-module using parity matrix.
6. Cut over: approved traffic switch with monitoring and rollback.
7. Retire: remove legacy only after explicit sign-off, retention and rollback requirements are met.

## Cutover gate
No unresolved blocker in critical flows; product owner acceptance; security review; production smoke/E2E; monitoring and rollback tested.
