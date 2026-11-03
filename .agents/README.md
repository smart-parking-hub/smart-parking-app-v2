# Agent Governance

This folder contains the project-specific operating system for AI agents.

- `rules/`: mandatory constraints; short, enforceable, non-duplicative.
- `skills/`: task playbooks with investigation, execution and verification steps.
- `workflows/`: repeatable end-to-end procedures.
- `templates/`: standard outputs.
- `context/`: concise maps that point agents to authoritative documentation.

`AGENTS.md` at repository root is the entry point. Keep it short enough to load reliably; link to detailed rules rather than duplicating them.

Do not assume every coding agent automatically discovers `.agents/`. Configure Antigravity's project rules/skills using its supported mechanism and verify discovery with a small test task.


## Stitch implementation mode

Stitch designs are supplied by the user one screen at a time by pasting the HTML/CSS directly into the Antigravity task. The `stitch-screen-implementation` skill and `stitch-to-react-one-screen` workflow govern this process. Do not require batch exports or begin another screen before acceptance of the current one.
