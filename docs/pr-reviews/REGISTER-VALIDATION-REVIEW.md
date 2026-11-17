# Registration validation review

- Task: SCR-011 personal-information validation and duplicate-error feedback.
- Date: 2026-11-17. Owner: auth.
- Branch: `fix/ui-feedback-booking-qr`; base `origin/main` at `bc51950`.
- Review: author self-review of the registration follow-up on PR #84.

## Scope and behavior

Created `RegisterValidation.test.tsx` and this review. Modified `RegisterPage.tsx`,
the registration browser scenarios, module documentation and the original PR review.
No files were deleted, no dependencies added, and no backend files changed.

Personal fields now validate on blur and during correction, expose associated hints
and errors, and focus invalid fields. Final validation reveals errors in earlier
steps after draft restoration or magic-link verification. Phone and email conflicts
from account creation reveal and focus their respective fields. Server messages
remain authoritative; no per-keystroke account-availability API was introduced.

Full-name and bank-account requirements preserve the existing frontend limits.
Names and citizen IDs are trimmed, `+84` phone numbers normalize to `0`, and numeric
identifiers retain leading zeros. Email length follows `RegisterRequest`'s 100-character
limit. The existing bank-account rule now applies to final validation as well as
step navigation, so restored drafts cannot bypass it.

OTP verification, password rules, driver/merchant roles, conditional merchant bank
details and account-creation endpoints remain in place. The magic-link effect uses
the stable mutation function and complete dependencies, resolving the prior hook warning.

## Findings

| Severity | Finding | Disposition |
|---|---|---|
| Major, fixed | Final errors in restored personal-information fields could remain hidden behind the password step. | Return to the first invalid step, then focus its field after rendering. Tests cover name, phone and citizen ID. |
| Minor, fixed | Server conflict handlers attempted to focus fields before their hidden step became visible. | Defer focus until the step is displayed; exercise phone/email conflicts in component and browser tests. |
| Minor, fixed | Fields lacked early feedback and the full-name maximum had only a generic error. | Validate on touch/correction, add specific messages and accessible hints. |
| Existing backend follow-up | Merchant citizen-ID duplicates reach a database uniqueness violation and a generic HTTP 500 response. | Document the gap. Registration needs an explicit backend conflict response; this frontend change does not claim to fix it. |

## Contracts, security and accessibility

Read-only backend evidence: `RegisterRequest`, `AuthServiceImpl.register`,
`AuthServiceImpl.sendRegisterOtp`, `GlobalExceptionHandler`, the merchant entity
and initial identity migration. Email uniqueness is checked case-insensitively
before OTP delivery and on registration; phone uniqueness is checked on registration.
Names may repeat. Merchant citizen-ID uniqueness does not apply to driver registration,
which does not persist that value in the driver entity.

No credentials or extra personal fields are persisted. The existing registration
draft storage is unchanged. No account is created and no email sent by these tests.
React Hook Form remains the form-state owner and TanStack Query owns mutations.
No new cross-feature or global-state dependency was added.

Hints and errors use `aria-describedby`, with required/invalid state on personal
inputs. Keyboard focus follows visible steps. Screenshots at 1440px and 390px were
inspected; neither viewport had horizontal overflow. Local visual evidence is
generated in ignored `.artifacts/register-validation-{1440,390}.png`.

## Validation

| Check | Command / environment | Result |
|---|---|---|
| Typecheck | `npm run typecheck` and the build's `tsc -b` | Passed |
| ESLint | `npm run lint` | Passed; 0 errors, 0 warnings |
| Unit/component | Full Vitest suite with `--maxWorkers=2` | 806 passed, 0 failed; includes 22 new registration-validation scenarios |
| Browser | `e2e/account-registration.spec.ts`, API responses stubbed, at 1440px and 390px | 6 passed, 0 failed |
| Production build | `npm run build` | Passed |
| Diff whitespace | `git -c core.whitespace=cr-at-eol diff --check` | Passed |

The first browser run's broad auth-request blocker also blocked the connectivity
probe; the test setup was narrowed and the probe stubbed explicitly. All six full
scenarios then passed. Node printed its environment `NO_COLOR`/`FORCE_COLOR`
warning during browser startup; the application lint check is warning-free.

## Remaining limits

Real identity data and inbox delivery were not exercised. The frontend checks
citizen-ID format, not government-record authenticity. A friendly merchant citizen-ID
duplicate error still requires a backend change. The pre-existing frontend bank
limit (6–25 digits) is stricter than the backend DTO (1–30 digits); that business-policy
difference remains documented rather than silently changing accepted inputs.
