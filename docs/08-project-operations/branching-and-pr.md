# Branching and Pull Request Agreement

Use the repository's existing branch convention if one is established. Otherwise propose:
- `main`: releasable production state.
- `develop`: integration branch only if the team needs it.
- `feature/<task-id>-short-name`
- `fix/<task-id>-short-name`
- `release/<version>` only when release process requires it.

PR template must include task, scope, screenshots for UI changes, API/permission impact, tests, docs, risks and rollback notes. Protect release branches and require review/CI according to team size.
