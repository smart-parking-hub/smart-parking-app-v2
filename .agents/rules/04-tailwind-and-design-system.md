# 04 — Tailwind CSS v4 and Design System
- Use approved CSS variables/design tokens; do not scatter arbitrary hex values.
- Follow Tailwind v4 syntax and the project's single styling entry point.
- Prefer semantic tokens for color, typography, spacing, radius and elevation.
- Use shared primitives for repeated controls; feature-specific composition stays in features.
- No inline style except dynamic values that cannot reasonably be expressed through tokens/classes.
- Check hover, focus-visible, active, disabled, loading, error and responsive states.
- Do not add a second component library without an ADR.
