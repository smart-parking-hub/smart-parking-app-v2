# Merge origin/main into scr-53

- last_verified: 2026-11-07
- owner: frontend maintainers
- original branch HEAD: 5f84a61
- incoming origin/main: 8ea2a18821343740df7f80d236486aee5fe2d6b0
- scope: finish the existing merge; no backend, database, dependency or deployment changes

## Resolution decisions

Resolved 17 conflicted files. Preserved authenticated API data, validation, real booking/payment state,
empty/error handling and regression tests for merchant lots, driver bookings, parking detail, payment and vehicles.
Incoming prototype pages with seeded sample accounts/yards, default mock query data and simulated payment completion
were not allowed to replace the working real-data integrations.

Manually combined compatible main improvements in login/registration focus styles, current password visibility control,
OTP submit disabling, driver trip layout/status badge, merchant lot table alignment/map support and registration heading.
Updated incoming auth accessibility tests for the actual keyboard order and email OTP trigger label.
All other non-conflicting incoming changes remain included in the merge.

## Verification

- `npm run build`: PASS (TypeScript project build and Vite production bundle).
- `npm run lint`: PASS, no reported errors/warnings after removing the merged unused import.
- `git ls-files -u` and source conflict-marker scan: empty.
- Incoming auth accessibility suite: 7/7 passed after integration adjustments.
- Full-suite run before the two auth test adjustments: 322 tests, 308 passed, 14 failed.
  Twelve failures are in legacy merchant create/detail tests expecting prototype UI/default fixture data;
  the other two auth expectations were then corrected and verified with the focused suite.
- Full-suite rerun during the final email-label edit: 322 tests, 309 passed, 13 failed.
  The auth file had already been loaded with the intermediate label in that run; its final focused run passed 7/7.
  The remaining 12 merchant create/detail failures were not addressed by this merge.
- Incoming main contains 3,534 whitespace notices relative to the branch (mostly documentation and generated test formatting).
  These inherited files were kept as supplied; this merge does not broadly reformat them.
- No live browser end-to-end check performed: local service stack was previously stopped.

Backups of index stages 1/2/3 and initial conflicted working files were saved outside the repository in the task artifact directory.
