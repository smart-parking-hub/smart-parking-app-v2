# SCR-011 Registration OTP correction

Owner: auth. Last verified: 2026-11-10 against identity source and auth component tests.

Steps: personal information, merchant bank details if applicable, email OTP,
password and confirmation, account creation.

`POST /api/v1/auth/otp/send` must succeed for the selected normalized email before
continuing. `POST /api/v1/auth/otp/verify` receives `{ email, otpCode }` when the user
continues from OTP. Only a successful response reveals the password fields.
Wrong, expired, consumed, exhausted or missing codes stay on the OTP step with
the server message. Verification locks email, code, resend and navigation controls.
Changing email or resending clears the old code. Verification retains leading zeros.

Verification does not consume the OTP. `/api/v1/auth/register` rechecks and consumes
it atomically with account creation, preserving the old registration contract.
If the code expires or is replaced between steps, registration returns to OTP with
the server's reason. Password and confirmation must match and cannot be blank.
Enter on earlier steps validates only the current step. Inactive steps are hidden
from keyboard navigation and assistive technology.

Evidence: auth `EmailOtp.test.tsx`, `BankField.test.tsx`, and
`e2e/account-registration.spec.ts`; backend `EmailOtpIntegrationTest` and
`AuthControllerTest`. E2E stubs delivery/verification/account creation; it does not
claim real inbox delivery.

## Shared bank picker (2026-11-15)

Registration's bank API and picker now live in `src/entities/bank`, reused by the merchant withdrawal form. Auth retains its existing typed wrapper and API exports. Search, bank logos, required selection from the provider, 24-hour query cache, public credential-free VietQR fetch, loading and retry behavior are preserved. No registration payload or OTP behavior changes.
