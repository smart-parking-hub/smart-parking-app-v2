# Merchant and driver password flow verification

Last verified: 2026-11-11. Owner: auth/profile and merchant/profile.

## Findings and fixes

- Driver accepted a new password made only of whitespace in the client although
  backend `ChangePasswordRequest` rejects it. The driver now rejects it before
  sending, matching merchant. Both require matching confirmation and 6–50 characters.
- Driver passed the full form (including confirmation) into mutation variables.
  It now calls a parameterless mutation so credentials are not retained there.
- The shared password API clears request bodies from Axios errors before either
  role's mutation cache receives them. Merchant's duplicate cleanup was removed.
- Driver's previous success toast could remain while editing another request.
  Editing or starting a new request now clears the old success toast.
- Merchant's direct `#bao-mat` entry could miss scrolling while profile data was
  loading. The page now scrolls after the profile becomes available, with a
  delayed-response regression test.

## Verified flow

Driver opens `/profile#bao-mat` (legacy `/change-password` paths redirect there).
Merchant opens `/merchant/profile#bao-mat` from the profile navigation.
Both use the existing POST `/api/v1/users/me/password` with exactly
`{ currentPassword, newPassword }`. Confirmation remains in the form. Passwords
are not trimmed, and neither flow stores them in localStorage.

The identity controller requires an authenticated principal and derives the user
ID from that principal. `UserServiceImpl.changePassword` compares the current
password hash before encoding and saving the new password. This path has no
role-specific password rules; the same contract serves both roles. Backend source
and session invalidation policy were not modified in this audit.

Client checks cover missing current password, 5/6/50/51-character new passwords,
whitespace-only input, mismatch, preservation of intentional surrounding spaces,
HTTP 400/401/403/500 messages, pending controls, repeated submission, cleared fields
after success, and request credential cleanup. Browser checks additionally cover
a failed network request and retry, with no premature success message.

## Results

| Check | Result |
| --- | --- |
| Profile/merchant profile/router component tests, sequential | 49 passed |
| Existing identity UserServiceImplTest and UserControllerTest | 27 passed, no failures/errors |
| Playwright `e2e/merchant-password.spec.ts` | 4 passed: merchant/driver at 1440px and 390px |
| `npm run build` | Passed |
| ESLint on changed API, forms, pages and tests | Passed with no warnings |
| `git diff --check` on affected frontend paths | Passed |

The broader layout suite was also run: 12 layout tests passed and one existing
AuthLayout brand-text assertion failed at `LayoutsAndNavigation.test.tsx:78`.
It expects visible SMARTTRUCK text in the layout, which currently lives in its
auth page content. That layout and test were not changed by this audit. The layout
suite also produces unrelated unmocked network errors in jsdom.

Browser tests stub profile/password responses. Backend tests exercise controller
delegation and service logic with mocks. This does not claim that a real account
was changed and then logged in with old/new credentials. No real user's password
was changed. Screenshots are in `.artifacts/{merchant,driver}-password-{1440,390}.png`.
