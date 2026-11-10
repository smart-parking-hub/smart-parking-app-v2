# Merchant password change

Owner: merchant/profile. Last verified: 2026-11-11.

Entry point: Hồ sơ bến bãi → Bảo mật tài khoản at
`/merchant/profile#bao-mat`. The page composes `MerchantPasswordForm` with the
existing profile sections and uses their field, panel and button styles.

Reuses `changeMyPasswordApi` through the profile feature's public exports.
Contract verified against identity `UserController` and `UserServiceImpl`:
authenticated POST `/api/v1/users/me/password` with `{ currentPassword, newPassword }`.
Backend resolves the user from the session and verifies the current password.
Confirmation stays local. No backend, role-permission or session-policy changes.

Current password is required. New password must have 6–50 characters and cannot
contain only whitespace. Confirmation must match. Passwords are sent unchanged;
the form does not trim credentials. Each field has an independent visibility
toggle, label, autocomplete and accessible validation message. Pending requests
disable the form; errors remain visible until editing or retry. Success resets
all fields and visibility toggles. No password persistence or logging is added;
mutation variables contain no credentials, and Axios error config bodies are cleared.

The API cleanup now lives in the shared profile API used by both driver and
merchant. The page also scrolls to `#bao-mat` after an asynchronous profile load.
See [both-role audit](password-flow-audit.md) for the latest regression results.

Verification:
- `npm test -- src/features/merchant/profile src/features/profile --maxWorkers=1 --no-file-parallelism`: 21 passed.
- `npx playwright test e2e/merchant-password.spec.ts`: 2 passed (1440px, 390px).
- `npm run build`: passed, including TypeScript build.
- ESLint on the changed merchant profile component/page/test: passed.
- Screenshots inspected at `.artifacts/merchant-password-390.png` and generated at
  `.artifacts/merchant-password-1440.png`; mobile overflow assertion passed.

E2E uses stubbed authenticated profile/password responses and does not change a
real user's password. Existing workspace changes from other tasks are preserved.
