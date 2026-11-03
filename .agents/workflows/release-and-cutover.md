# Workflow: Release and Parallel-Migration Cutover
1. Confirm module parity matrix has no unresolved blocker.
2. Obtain product owner and technical owner approval.
3. Verify production API compatibility and environment configuration.
4. Run smoke, critical E2E, permission and regression tests.
5. Confirm monitoring, error tracking and rollback path.
6. Deploy behind approved route/feature flag or controlled traffic switch.
7. Monitor agreed signals and user reports.
8. Roll back if stop conditions are met.
9. Record release evidence and update migration status.
