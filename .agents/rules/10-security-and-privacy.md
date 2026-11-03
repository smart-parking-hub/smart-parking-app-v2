# 10 — Security and Privacy
- No secrets in repo, browser bundle, logs, screenshots or test fixtures.
- Never log tokens or sensitive user data.
- Follow verified session/token architecture; do not invent storage strategy.
- Do not trust client-side role/permission state as authorization.
- Avoid unsafe HTML injection and unsafe URL construction.
- Use environment-specific configuration without embedding secrets in VITE_* variables.
