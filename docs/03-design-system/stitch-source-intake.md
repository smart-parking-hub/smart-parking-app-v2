# Stitch Source Intake — One Screen at a Time

## Operating model
The user copies the HTML/CSS for one designed screen from Stitch and pastes it into the Antigravity task. The agent does not require all screens to be exported in advance.

## How to provide source
Use a task message such as:

- Screen: Customer List
- Route: `/customers` (if known)
- Existing screen/module: Customer management
- Target viewport: 1440 × 900 (if known)
- Roles: STAFF, ADMIN (only if verified)
- Stitch source: paste the complete HTML below
- Assets: list/attach any referenced images, icons, fonts or files
- End marker: `END OF STITCH SOURCE`

If the HTML is long, send:
`PART 1/N`, `PART 2/N`, ... and finish with `END OF STITCH SOURCE`.
The agent must wait for the end marker before treating the input as complete.

## Source handling
- Keep the original pasted source unchanged as the reference during the task.
- Do not require a new permanent `design/stitch/` directory for every task.
- If the project needs durable design provenance, store the approved source under `design/stitch/<screen-slug>/source.html` only with user/project approval.
- Record referenced assets and their source. Never silently replace a missing brand asset with an unrelated image.
- Never commit secrets or real customer data embedded in sample HTML.

## What the source does and does not define
The source defines visual intent: layout, hierarchy, colors, spacing, typography, decorative treatments, and visible control placement.
It does not establish API contracts, business rules, role permissions, validation rules, or the correct behavior of controls.

## Export cleanup
The agent may remove export-specific implementation details while preserving appearance:
- full HTML document wrappers when not needed by React;
- CDN script tags and demo-only JavaScript;
- hardcoded sample records, replaced only by verified API data or isolated test fixtures;
- invalid or duplicated markup;
- inline styles translated into the approved project styling approach.

The agent must not use cleanup as a reason to change the approved visual design.

## Screen record
For each screen, maintain:
- source reference or approved source path;
- screen name and route;
- source completeness and assets;
- visual tokens observed;
- old capabilities and parity mapping;
- APIs and permissions verified;
- responsive viewports checked;
- test/build evidence;
- review status and acceptance date.
