# T-0514 0.4.1 rc0 package recycle command surface adaptive refactor

## Identity

| Field | Value |
|---|---|
| ID | T-0514 |
| Title | 0.4.1 rc0 package recycle command surface adaptive refactor |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make installed-package recycle resilient to lifecycle command-surface changes. | The helper should inspect the installed CLI surface, prefer current `task status`, and only fall back to legacy lifecycle smoke when the installed package does not expose `task.status`. |

## Scope

| Boundary | Items |
|---|---|
| In | `package recycle` command-surface discovery, current/legacy task-read smoke selection, execution flag/schema compatibility, regression tests, and docs/state updates. |
| Out | Live npm publish, GitHub Release mutation, or broad command-portfolio removals outside package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Refactor package recycle to read installed command surface and select current task status smoke. | Done |
| 3 | Add regression coverage for current-surface and legacy fallback behavior. | Done |
| 4 | Validate, record evidence, update shared state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Executed recycle reports include installed command-surface smoke metadata and current `taskStatusExecuted` while preserving the legacy `taskLifecycleExecuted` compatibility flag. | Done | `ev:T-0514:1083145ebdba460894fab691` | `src/services/package-recycle.ts` |
| AC-2 | Current installed command surfaces use `task status --task <id> --json` and do not call removed `task lifecycle` when `task.status` is available. | Done | `ev:T-0514:1083145ebdba460894fab691` | `tests/unit/package-recycle.test.ts` |
| AC-3 | Legacy installed surfaces without `task.status` can still fall back to `task lifecycle` for older package recycle targets. | Done | `ev:T-0514:1083145ebdba460894fab691` | `tests/unit/package-recycle.test.ts` |
| AC-4 | Validation evidence is recorded. | Done | `ev:T-0514:1083145ebdba460894fab691`, `ev:T-0514:dd3b69febfc54c98aeeb4741`, `ev:T-0514:8c6f62d144b74da281d7880f` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0514:dd3b69febfc54c98aeeb4741 |
| Focused package recycle and schema tests | Yes | Passed | ev:T-0514:1083145ebdba460894fab691 |
| Built CLI package recycle dry-run | Yes | Passed | ev:T-0514:8c6f62d144b74da281d7880f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Refactor recycle helper in the next capsule so it matches version-specific command surfaces. |
| T-0513 recycle failure | reference | active | Installed-package recycle exposed stale `task lifecycle` usage after 0.4.1-rc.0 lifecycle surface removal. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Public lifecycle path is `task status` plus `task finalize`; low-level lifecycle commands are redirect stubs in current releases. |

## Changes

| Area | Summary |
|---|---|
| Package recycle service | Added installed `commands --json` command-surface read, current `task.status` selection, and legacy `task.lifecycle` fallback only when `task.status` is absent. |
| Package recycle schema | Added `commandSurfaceExecuted` and `taskStatusExecuted` execution flags while preserving `taskLifecycleExecuted` compatibility. |
| Tests and docs | Added current-surface and legacy fallback tests; updated JSON/schema/lifecycle docs that described stale lifecycle behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Broader command-surface telemetry and command-portfolio removals remain outside this recycle helper capsule. | Open | `docs/specs/0.4.1/rc0-scope.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Scoped package recycle command-surface adaptive refactor. |
| 2026-07-08 | Done | Implemented adaptive package recycle smoke selection and recorded validation evidence. |
