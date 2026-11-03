# 09 — Testing and Quality Gates
- Unit-test pure business utilities and non-trivial hooks.
- Component-test user-visible behavior, not implementation details.
- Use MSW for deterministic API integration tests where useful.
- Use Playwright for critical end-to-end journeys and permission scenarios.
- Test success, validation failure, API failure, empty and unauthorized states.
- Run typecheck, lint, tests and build; report exact command and outcome.
