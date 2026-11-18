# SCR-011 Registration OTP correction

Owner: auth. Last verified: 2026-11-18 against identity source, auth component and lifecycle tests, and browser tests.

Steps: personal information, merchant bank details if applicable, email OTP,
password and confirmation, account creation.

Successful `POST /api/v1/auth/otp/send` for the selected normalized email, or an
unchanged code from a valid magic link in the current session, allows verification.
`POST /api/v1/auth/otp/verify` receives `{ email, otpCode }` when the user
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
all registered fields, including data populated through verified email magic link, and
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

## Registration lifecycle and role switching (2026-11-18)

- **Memory-only session & navigation reset:** Registration state exists purely in volatile page memory. Opening `/register` anew, reloading (F5), navigating back/forward (`popstate`), or restoring from bfcache (`pageshow.persisted`) immediately resets the form to default role DRIVER, step 1 (Cá nhân), with all fields blank, no touched/dirty/error states, and no residual OTP verification state. Application `sessionStorage` draft persistence has been removed. Any legacy `sp_register_draft` key found in storage is safely purged on mount.
- **Role switching and confirmation dialog:** Switching role represents the start of a completely new registration. It does not carry over name, phone, citizen ID, email, bank details, OTP status, or passwords between roles.
  - If the form is clean (no inputs, no active OTP state), role switches immediately without interruption or validation errors.
  - If data has been entered or OTP is active, an accessible confirmation dialog prompts the user (`Đổi sang vai trò {Tài xế/Chủ bãi}?`).
  - The dialog focuses "Giữ vai trò hiện tại" as soon as it opens to guard against accidental destruction of input.
  - Canceling (via "Giữ vai trò hiện tại", Escape key, dialog close button, or backdrop click) retains all inputs, errors, steps, and OTP state; focus returns to `#auth-role-trigger`.
  - Confirming ("Đổi vai trò và nhập lại") triggers a comprehensive reset (`handleFullReset`), invalidates pending mutations, resets the step back to step 1 (Cá nhân), announces the role change via a polite `role="status"` live region, and shifts focus to "Họ và tên" (`#auth-fullName`) after the dialog finishes closing. Sequential switches (A → B → A) never resurrect data from prior visits.
- **Magic link intake, eligibility, and URL sanitization:**
  - Parameters `email`, `otpCode` (or alias `otp`), and `autoVerify` are captured per navigation and stripped from the URL via router replace without full page reload, while preserving any non-sensitive query parameters (e.g., `?ref=partner`) and hash anchors (e.g., `#faq`). Subsequent router navigations with different link parameters initiate a fresh intake without component unmounting.
  - Empty magic-link parameters are also removed. If both the email and OTP are blank, the form and its current verification state are left intact.
  - Intake strictly separates *code eligibility* from *server verification proof*:
    - *Eligible code*: A code delivered via successful send or a valid incoming magic link in the active session allows verification attempts.
    - *Server verification*: Only a successful HTTP 200 response from `POST /api/v1/auth/otp/verify` establishes verified proof in memory.
    - *Non-auto magic link*: Does not call send or verify automatically. The user completes any required personal information, proceeds to the email step, and clicks "Tiếp tục". This executes verify with the link code against the server; server success unlocks the password step, whereas invalid or expired codes retain the user on the email step with the server error message.
    - *AutoVerify link*: Verifies on intake. If personal or bank information is missing, it keeps the user on the first incomplete required step with notice `Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.`, preserving proof in memory.
    - If a new link intake arrives while an account registration submit is in-flight, it is safely queued in memory and does not corrupt the in-flight submit payload.
- **Asynchronous snapshot generation guards:**
  - Dispatched OTP send and verify requests carry an immutable snapshot (`generation`, `requestId`, `email`, `otpCode`).
  - Callbacks match the snapshot against the active session generation and request ID. Stale responses, cooldown timers, or server error notices from previous sessions, aborted roles, or superseded requests are discarded and cannot contaminate current state.
  - The role selection dropdown is disabled during `verifyOtp.isPending` and `submit.isPending`.

Evidence: `RegisterLifecycle.test.tsx`, `EmailOtp.test.tsx`, `RegisterValidation.test.tsx`, `BankField.test.tsx`, `e2e/register-lifecycle.spec.ts`, `e2e/account-registration.spec.ts`.

## Round 2 corrections (2026-11-18)

Editing the OTP permanently clears the old verified proof and magic-link source,
even if the user restores the original code. A successful send for the same email
remains valid, so its code can be verified again without resetting the resend
cooldown. A code originating only from a link requires a new send after editing.
Editing never sends or verifies automatically.

AutoVerify failures appear as a visible alert above the current form step, including
when personal information is still missing. The alert uses the current mutation's
server error only after matching generation, request, intake, email and code.
Editing email/code, resending, starting another verification, accepting a new link,
or resetting clears the old alert. Canceling a role change preserves it.

An incoming link during registration submission is queued without changing the
active form or request payload. Submission success discards the queued link;
submission failure accepts it, clears the previous submit error and passwords,
and verifies the queued link when requested by its autoVerify flag.

Evidence: the `Round 2: RR1, RR2 and missing RR3 evidence` group in
`RegisterLifecycle.test.tsx`; the keyboard and Back/Forward browser cases in
`e2e/register-lifecycle.spec.ts`. See the audit report for exact counts and limits.
