# Workflow: Refactor
1. State measurable reason (duplication, coupling, defect risk, performance).
2. Confirm behavior to preserve and add characterization tests if needed.
3. Map imports/consumers and blast radius.
4. Propose incremental steps and rollback strategy.
5. Refactor without mixing feature changes.
6. Compare behavior and run tests/build.
7. Update ADR/docs only if architecture/contract changed.
