# 03 — TypeScript and React
- Strict TypeScript; no `any` except a documented, narrowly scoped interoperability boundary.
- Type API inputs/outputs from verified contracts; distinguish transport DTOs from UI/domain models.
- Use function components and hooks; keep hooks unconditional and obey React rules.
- Keep components focused; extract only when reuse, complexity or testability justifies it.
- Use stable keys; avoid derived state when values can be calculated.
- Handle async lifecycle and stale requests through established query tooling.
- Avoid premature memoization; profile before optimizing.
