# 02 — V3 Architecture & Implementation Plan

> **Version**: 3.0.0  
> **Date**: 2026-11-11  
> **Status**: Implementation plan for ak-review-pr skill rebuild

---

## 1. Audit Reconciliation

| Previous Finding | Current Evidence | Status | Decision |
|---|---|---|---|
| A. Permission too broad for Review-only | `SKILL.md` frontmatter grants `git push`, `gh pr merge` to all modes | **Existing** | REPLACE — mode-gated permissions in v3 |
| B. API errors masked as "No checks found" | `gh-api-helpers.sh` `_ak_pr_checks` line 113-114: empty output → "No checks found" | **Existing** | FIX — distinguish NONE/ERROR/UNKNOWN |
| C. Duplicate writes on CLI→REST fallback | `_ak_pr_review` lines 152-163: tries native, falls back REST, no idempotency check | **Existing** | FIX — verify server state before retry |
| D. No prompt injection defense | No trust boundary markers in any file | **Existing** | FIX — add explicit trust boundaries |
| E. PR body contract too rigid | `pr-body-contract.md`: 7 mandatory sections | **Existing** | IMPROVE — tiered (required/conditional/optional) |
| F. Finding lacks structured schema | `review-workflow.md` §4: freeform summary/risk/findings/verdict | **Existing** | REPLACE — structured finding schema |
| G. No test/runtime evidence distinction | No verification classification anywhere | **Existing** | FIX — evidence classification system |
| H. Merge gate incomplete | `mode-merge.md`: 5 conditions but no HEAD SHA recheck, no draft check | **Existing** | FIX — comprehensive merge gate |
| I. Modes not permission-isolated | Single `allowed-tools` block for all modes | **Existing** | REPLACE — per-mode permission model |
| J. Fix workflow lacks safeguards | `mode-fix.md`: delegates to `ak-fix` without local checks | **Existing** | REPLACE — inline fix with full safeguards |
| K. File list capped at 50 | `review-workflow.md` line 44: `head -50` | **Existing** | FIX — pagination, report truncation |
| L. Argument parsing fragile | `SKILL.md` line 83: single sed/awk command | **Existing** | REPLACE — robust parser with validation |
| M. No tests exist | Zero test files in skill directory | **Existing** | FIX — comprehensive test suite |

## 2. Key Architecture Decisions

### 2.1 GitHub API Strategy

**Decision**: Require `gh` CLI as primary, with installation guidance. Skill fails fast with clear error if `gh` is absent.

**Rationale**:
- `curl` is available but managing auth tokens manually is error-prone and insecure
- `gh` handles auth, pagination, rate limiting, and JSON output natively
- `gh` REST mode (`gh api`) works even when GraphQL is blocked
- Installation is a one-time setup; the skill should not reinvent auth
- Alternative: Antigravity GitHub plugin not found in installed plugins

**Fallback**: If `gh` is not installed, the skill reports this clearly and exits. No silent degradation.

### 2.2 Skill Placement

**Decision**: Build in `dist/ak-review-pr-v3.0.0/`. User installs to `.agents/skills/ak-review-pr/`.

**Rationale**: `.agents/skills/` is the workspace convention for this project. Both sub-projects' AGENTS.md reference `.agents/skills/` for skill discovery.

### 2.3 Shell Strategy

**Decision**: All scripts target PowerShell (primary) with cross-platform notes. GitHub API calls use `gh api` (REST).

**Rationale**: Windows 11 is the dev environment. PowerShell is native. Bash is WSL-only.

### 2.4 External Skill Dependencies

**Decision**: Eliminate all external skill dependencies. Implement fix/reply/merge inline.

| v2 Dependency | v3 Replacement |
|---|---|
| `ak-fix --auto` | Inline fix via Antigravity `edit_file`/`write_file` tools |
| `ak-git cp` | Inline `git add/commit/push` via `run_command` |
| `ak-git merge-pr` | Inline merge via `gh api` |
| `ak-brainstorm`/`kongming` | Antigravity `invoke_subagent` |
| `writing-language.cjs` | Inline language detection (check AGENTS.md language) |
| `pr-body-contract.cjs` | Inline PR body validation rules |

### 2.5 Severity Taxonomy

**Decision**: Adopt project's `Critical/Major/Minor/Suggestion` with independent Confidence and Priority.

**Rationale**: Aligns with the project's existing `code-review` skill (`Blocker/Critical/Major/Minor`). Simplified to 4 levels with clear semantics.

### 2.6 Progressive Disclosure

**Decision**: SKILL.md is ~150 lines (orchestrator only). Each reference is loaded only when its mode/phase activates.

## 3. File Structure

```
ak-review-pr/
├── SKILL.md                          # Orchestrator (modes, args, workflow dispatch)
├── README.md                         # User documentation & installation
├── CHANGELOG.md                      # v3.0.0 release notes
├── MIGRATION.md                      # v2.6.2 → v3.0.0 upgrade guide
├── references/
│   ├── review-workflow.md            # 19-step review execution
│   ├── finding-standard.md           # Finding schema, severity, confidence, priority
│   ├── safety-engine.md              # Trust boundaries, prompt injection, permissions
│   ├── github-operations.md          # All GH API: read, review, comment, merge
│   ├── ci-verification.md            # CI state model (PASS/FAIL/PENDING/NONE/UNKNOWN)
│   ├── mode-fix.md                   # Fix mode workflow & safeguards
│   ├── mode-reply.md                 # Reply mode & dedup
│   ├── mode-merge.md                 # Merge gate (11 conditions)
│   ├── mode-advice.md                # Advisory subagent
│   ├── mode-ultra.md                 # Parallel verifier
│   ├── anti-ai-slop.md               # Anti-slop taxonomy (preserved)
│   ├── review-checklist.md           # Core + project-adapter checklists
│   └── project-adapters.md           # Tech detection & adapter loading
└── tests/
    ├── run-tests.ps1                 # Test runner
    ├── test-argument-parser.ps1      # Argument parsing tests
    ├── test-ci-states.ps1            # CI state logic tests
    ├── test-integrity.ps1            # File reference validation
    └── fixtures/
        ├── pr-meta-clean.json        # Clean PR metadata
        ├── pr-meta-conflict.json     # PR with merge conflicts
        ├── pr-meta-draft.json        # Draft PR
        ├── check-runs-mixed.json     # Mixed CI states
        ├── check-runs-empty.json     # No checks
        └── check-runs-failing.json   # Failing required checks
```

## 4. Permission Model

| Mode | Reads | Writes | Precondition |
|---|---|---|---|
| **Review** (default) | PR meta, diff, files, checks, repo files | None | `gh auth status` |
| **Fix** | Same as Review + working tree | Local file edits only | Review completed + findings exist |
| **Push-Fix** | Same as Fix | `git add/commit/push` | Fix completed + user authorized `--push-fix` |
| **Reply** | Same as Review | `gh api` POST review | Review completed + user authorized `--reply` |
| **Merge** | Same as Review + merge status | `gh api` PUT merge | Review Approve + 11-gate pass + user authorized `--merge` |
| **Advice** | Same as Review | Subagent spawn only | `--advice` flag |
| **Ultra** | Same as Review | Subagent spawn only | `--ultra` flag |

## 5. What Is Preserved, Improved, Replaced, Removed

| Feature | Decision | Reason |
|---|---|---|
| Anti-AI-slop taxonomy | **KEEP** | High-value, directly relevant |
| Review checklist (correctness/security/perf/breaking) | **KEEP** | Core review coverage |
| Multi-PR sequential processing | **KEEP** | User workflow support |
| Review-only as default (no side effects) | **KEEP** | Safety |
| Self-PR approve fallback to COMMENT | **KEEP** | GitHub API constraint |
| 60K char body truncation | **KEEP** | GitHub API limit |
| Composable flag system | **IMPROVE** | Add `--push-fix`, separate from `--fix` |
| Finding format | **REPLACE** | Structured schema with ID/confidence/priority |
| Permission model | **REPLACE** | Per-mode isolation |
| Shell helper library | **REPLACE** | `gh api` direct calls, no bash dependency |
| Argument parser | **REPLACE** | Robust validation |
| CI state interpretation | **REPLACE** | 5-state model with error distinction |
| Merge gate | **REPLACE** | 11-condition comprehensive gate |
| External skill deps (ak-fix/ak-git/etc.) | **REMOVE** | Not available; inline replacement |
| Claude-specific paths | **REMOVE** | Not applicable to Antigravity |
| Semantic triage experiment | **REMOVE** | Depends on non-existent ak-eval CLI |
| writing-language.cjs / pr-body-contract.cjs | **REMOVE** | Inline replacement |
