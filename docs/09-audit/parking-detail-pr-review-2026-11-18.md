# Parking detail PR review

Owner: SPH. Last verified: 2026-11-18.

Port the parking-detail portion of local save `66eaf27` onto main `3f3532b`.
Keep main's registration, shared dialog, schedule, checkout and payment fixes.
API contract checked against backend main `d85dec7`: image content URLs may
refer either to authenticated local content or an external Cloudinary URL.

The gallery prioritizes the cover without mutating server data, supports
keyboard selection, and leaves reservations independent of image loading.
Price cards preserve all configured factors and distinguish current capacity
from future scheduled availability. No demo images are added to production.

The shared `ApiImage` file is taken exactly from Cloudinary branch commit
`4436031` (original CDN support `0634fff`). Only that file is reused, without
merchant image-upload screens or dependency changes. Regression tests verify
direct CDN rendering without API calls, authenticated local blobs, URL cleanup,
and local load errors. The CDN test fails against main and passes after the port.

Executed validation:

- Typecheck, lint (no diagnostics), and production build: passed.
- Targeted page/image/reservation/time-selector tests: 45 passed.
- Final full suite: `npm.cmd test -- --maxWorkers=4`, 100 files, 964 passed.
- Chromium: four passing local/CDN cases at 390px and 1440px. Verify decoding,
  keyboard thumbnails, Vietnamese labels, exact prices, header isolation,
  no horizontal overflow, return navigation and vehicle-registration entry.
- Mobile/desktop screenshots inspected; existing global Copilot overlay remains.

One run of the full suite concurrent with Chromium exceeded two existing
five-second test deadlines and a browser lazy-load deadline. Four-worker full
tests and a separate browser run passed without relaxing test timeouts or
changing application behavior. Logs are under workspace
`.artifacts/unpublished-pr-review/`.

Browser/API fixtures do not establish live CDN availability, new uploads,
booking/payment execution, SMTP delivery, or VPS acceptance. Historical local
photo recovery described in the older report was not repeated by this PR.

Rollback: revert the PR commit. No database/API schema, authentication,
dependency or deployment change is required.
