# Workflow: Review and Accept One Implemented Screen

1. Open the Stitch source and implemented screen at the same viewport.
2. Compare page hierarchy, spacing, typography, colors, borders, shadows, iconography and responsive behavior.
3. Check every old capability against the parity matrix.
4. Test every visible control and its success/error/disabled states.
5. Verify role-based access against backend authorization.
6. Review keyboard navigation, labels, focus, contrast and semantic structure.
7. Review changed files for duplicated components, unsafe HTML, fake production data, unverified API assumptions and unrelated edits.
8. Run the repository's actual quality commands and record outputs.
9. Classify findings as Blocker, Critical, Major or Minor.
10. Fix and re-check Blocker/Critical findings before acceptance.
11. Record reviewer decision: `CHANGES_REQUIRED`, `READY_FOR_REVIEW`, or `ACCEPTED`.
12. Do not begin the next screen until the owner explicitly approves continuation.
