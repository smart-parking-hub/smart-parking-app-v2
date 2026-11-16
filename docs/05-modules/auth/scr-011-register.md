# SCR-011 Registration OTP correction

Owner: auth. Last verified: 2026-11-17 against identity source and auth component/browser tests.

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

## Registration validation and duplicates (2026-11-17)

Fields validate on first blur and then as the user corrects them. Continuing validates
the current step and focuses its first invalid field. Final submission revalidates
all registered fields, including drafts restored through an email magic link, and
reveals the step containing an invalid field before focusing it.

| Field | Verified form behavior |
|---|---|
| Full name | Required, trimmed, 2–100 characters; names may repeat. The minimum remains the existing frontend rule. |
| Phone | Required Vietnamese mobile number: `0` then `3/5/7/8/9` and eight digits. Whitespace is removed; `+84` is normalized to `0`, matching the backend setter. |
| Citizen ID | Required for merchants, optional for drivers. If supplied, exactly 9 or 12 digits; leading zeros are retained. Surrounding whitespace is trimmed. |
| Email | Required, valid format, at most 100 characters; normalized to lowercase for requests. OTP delivery also checks the length. |
| Merchant bank account | Required and 6–25 digits, preserving the existing frontend step rule. Backend accepts 1–30 digits; this change does not broaden the form's policy. |

Hints and error text are associated with each personal input through
`aria-describedby`; required and invalid states are exposed to assistive technology.
Numeric identifiers remain strings.

Duplicate detection is server-side, not an availability request on each keystroke:

- Email: identity checks `existsByEmailIgnoreCase` before sending registration OTP
  and again on account creation. OTP delivery failure is displayed on the email step.
- Phone: identity checks `existsByPhone` on account creation. The form returns to
  personal information and focuses the phone field with the server's conflict message.
- Account-creation email conflicts return to the email step and focus the email field.
- Merchant citizen ID: the database has `UK_merchants_citizen_id`, but registration
  does not explicitly map a duplicate to a friendly conflict response. The current
  general exception handler returns HTTP 500 with a generic server-error message.
  A specific citizen-ID duplicate message requires a backend change; none is included here.
- Driver registration does not persist `citizenId` in the driver entity; the merchant
  uniqueness constraint must not be described as a duplicate check for drivers.

Evidence: `RegisterValidation.test.tsx`, `EmailOtp.test.tsx`, `BankField.test.tsx`,
`e2e/account-registration.spec.ts`; identity `RegisterRequest`, `AuthServiceImpl`,
`GlobalExceptionHandler`, and `V1__init_identity_schema.sql`. Browser tests stub API
responses and do not create real accounts or send email.
