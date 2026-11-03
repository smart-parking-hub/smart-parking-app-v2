# Authentication and Authorization Audit

Inspect and record:
- Login/logout and session lifecycle.
- Access/refresh token or cookie model (verified only).
- Refresh concurrency and failure behavior.
- Expiration and unauthorized response handling.
- SSO/MFA if present.
- Permission source and naming.
- Route-level and action-level UX.
- Backend enforcement evidence.
- Direct URL and API access denial.
- Cross-origin, CSRF and cookie configuration where applicable.
- Sensitive data handling and logging.

| Actor | Route/page | Action | Frontend behavior | Backend enforcement evidence | Test |
|---|---|---|---|---|---|
