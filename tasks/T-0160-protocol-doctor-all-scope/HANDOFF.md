# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0160 |
| Status | Done |
| Last Updated | 2026-05-31T13:21:18+09:00 |

## Last Completed

| Item | Evidence |
|---|---|
| Implemented all-scope protocol doctor aggregation. | `src/services/protocol-consistency.ts` |
| Routed `--scope all` and default `protocol doctor --json` through all-scope reports. | `src/cli/protocol.ts` |
| Added focused service and CLI tests. | `tests/unit/protocol-consistency.test.ts`, `tests/unit/protocol-cli.test.ts` |
| Completed validation. | Focused Docker tests passed with 2 files / 27 tests; full Docker check passed with 61 files / 459 tests; built CLI all-scope smokes passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Operator should choose the next capsule. | T-0160 completes the `scope: all` contract alignment follow-up. | `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| All-scope aggregates docs, profile, and active-task detail rather than task-scoped done checks for every historical capsule. | This keeps the default broad doctor fast and avoids noisy legacy capsule revalidation; docs-scope still checks all Task Board/capsule cross-document drift. | Use `hadara protocol doctor --task <id> --json` for deep single-capsule diagnostics. |
| Docs-scope historical warnings remain. | All-scope reports the known T-0073 Task Board row warning and legacy Decisions table warning. | Treat them as warning-only until an operator explicitly chooses bounded remediation. |
