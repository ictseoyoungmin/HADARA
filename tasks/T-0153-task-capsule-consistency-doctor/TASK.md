# T-0153 Task Capsule Consistency Doctor

## Metadata

| Field | Value |
|---|---|
| ID | T-0153 |
| Title | Task Capsule Consistency Doctor |
| Status | Done |
| Created | 2026-05-30 |
| Updated | 2026-05-30 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only per-capsule protocol consistency doctor. | Implement the first Phase 2 consistency report for a single Task Capsule, focused on drift signals that are not currently exposed as a task-scoped doctor command. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara protocol doctor --task <id> --json` | Provides the task-scoped read-only CLI surface recommended by the Phase 2 plan. |
| Task Capsule consistency service | Reports missing capsule files, status drift, Done/pending acceptance drift, evidence JSONL gaps, stale handoff, and scaffold placeholder drift. |
| Focused tests and CLI smoke | Proves stable issue codes and read-only command behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Project-wide docs consistency doctor | Deferred to T-0154. |
| Profile drift remediation or safe-auto writes | Deferred to T-0155/T-0156. |
| Broad protocol JSON schema registration | Deferred to T-0157 after report shape stabilizes across scopes. |
| Task scaffold upgrade/remediation command | Deferred; this task only diagnoses. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-30 | Draft | Initial task scaffold. | `hadara task create "Task Capsule Consistency Doctor"` |
| 2026-05-30 | Active | Started the next Phase 2 slice from `docs/AGENT_HANDOFF.md` and `docs/DEVELOPMENT_SLICES.md`. | Required reading completed. |
| 2026-05-30 | Done | Read-only task-scoped protocol consistency doctor implemented and validated. | Final Docker check, built CLI smoke, and done-level harness passed. |
