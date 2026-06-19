# T-0382 Session Start JSON UX Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0382 |
| Title | Session Start JSON UX Hardening |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Harden bounded Session Start JSON/UX. | Preserve read-only/no-hidden-scan behavior while making default no-task output actionable and schema-valid. |

## Scope

| In Scope | Reason |
|---|---|
| Add structured Session Start guidance metadata. | Callers should not need to parse command arrays to understand the primary next step. |
| Make no-task bounded Session Start return actionable degraded output instead of a hard error. | `hadara session start --json` is the documented default entry point and should route users to `task next` without failing when no task is supplied. |
| Update focused tests and schema fixture. | Runtime JSON changes need unit/schema coverage. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Live graph/pack performance changes. | This capsule must not reintroduce hidden broad scans. |
| Cache warm diagnostics cleanup beyond Session Start guidance. | T-0384 owns cache diagnostics cleanup. |
| E2E smoke pack. | T-0383 owns broader built-CLI smoke coverage. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | TBD |
| 2026-06-19 | In Progress | Started Session Start JSON/UX hardening. | TBD |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
