# T-0235 Evidence v2 Migration Preview

## Metadata

| Field | Value |
|---|---|
| ID | T-0235 |
| Title | Evidence v2 Migration Preview |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Provide a dry-run-only Evidence v2 migration preview for one Task Capsule. | Operators need before-hash, planned transforms, skipped records, and deterministic planned ids before any execute-mode migration exists. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara evidence migrate --task <id> --to v2 --json`. | Adds the planned migration command shape from the Evidence v2 plan without writing files. |
| Per-task preview report service. | Reports source hash, line counts, v1/v2 counts, planned v1-to-v2 transforms, skipped records, and issues. |
| Deterministic planned v2 records. | Preview output must be stable enough for review and future execute hash guards. |
| Schema fixture and tests. | External consumers need a parseable report contract before execute mode. |
| Built CLI smoke against a historical v1 task. | Proves the command works on real legacy evidence. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Execute-mode migration. | Explicitly rejected in this capsule; execute requires a later hash-guarded writer. |
| Repository-wide migration. | First implementation remains per-task. |
| `EVIDENCE.md` rewrite. | Human Markdown frame remains unchanged. |
| Init scaffold changes. | New scaffolds stay unchanged until migration behavior is proven. |
| Dashboard/TUI UI work. | UI work remains paused. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to dry-run-only per-task Evidence v2 migration preview. | Task capsule update |
| 2026-06-03 | Done | Migration preview CLI/service/schema implemented and validated without evidence rewrites. | Focused tests, Docker sync-build, built CLI smoke |
