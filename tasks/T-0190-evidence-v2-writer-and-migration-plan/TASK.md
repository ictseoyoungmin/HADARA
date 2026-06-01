# T-0190 Evidence v2 Writer and Migration Plan

## Metadata

| Field | Value |
|---|---|
| ID | T-0190 |
| Title | Evidence v2 Writer and Migration Plan |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Evidence v2 writer and migration plan | Document the planned persisted `hadara.evidence.v2` writer shape and dry-run-first migration path without implementing writer changes or rewriting existing evidence. |

## Scope

| In Scope | Reason |
|---|---|
| Public v2 writer/migration plan document | Future implementation needs a GitHub-visible design boundary. |
| Schema/test strategy alignment | Existing schema docs should point to the v2 plan and keep migration non-implied. |
| Docs regression test | Prevent accidental removal of dry-run/non-goal safeguards. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementing `hadara.evidence.v2` writer | This capsule is design-only. |
| Implementing migration command | Future task after design review. |
| Rewriting `evidence.jsonl` or `EVIDENCE.md` | Must remain explicit dry-run-first future behavior. |
| Init scaffold changes | Deferred until writer behavior exists. |
| MCP writes, Dashboard/TUI rendering, release strict gate | Separate Phase 4/roadmap surfaces. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-01 | In Progress | Designing v2 writer/migration after semantic read surfaces and consumer contracts. | docs/DEVELOPMENT_SLICES.md |
| 2026-06-01 | Done | Evidence v2 writer/migration plan documented and Docker validation passed. | T-0190 evidence records. |
