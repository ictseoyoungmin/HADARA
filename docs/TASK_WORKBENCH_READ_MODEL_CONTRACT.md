# TASK_WORKBENCH_READ_MODEL_CONTRACT

## Purpose

`hadara.task.workbench.v1` is the Phase 3 task-facing read model for future dashboard, TUI, MCP, and external-agent task detail views.

Consumers should prefer this report when they need task readiness, evidence health, close/audit state, protocol summaries, and next actions for one task.

## Source Command

| Surface | Command / Service | Writes |
|---|---|---|
| CLI JSON | `hadara task status --task <task-id> --json` | None |
| TypeScript service | `createTaskWorkbenchReport(projectRoot, taskId)` | None |

## Consumer Guidance

| Consumer | Guidance |
|---|---|
| Dashboard | Use workbench JSON for a selected task detail panel instead of parsing Task Capsule Markdown directly. |
| TUI | Use the service report for selected-task detail, close readiness, and next actions; keep full raw document viewing as a separate detail tab. |
| MCP | If a future read-only MCP task-workbench tool is added, wrap this report as JSON text and preserve `schemaVersion`, `command`, `ok`, `issues`, and `nextActions`. |
| External agents | Prefer `task status --json` before stitching together task show, evidence list, evidence lint, protocol doctor, ready, close, and harness reports manually. |

## Field Use

| Field | Intended Use |
|---|---|
| `task` | Identity, capsule path, task status, and board-facing status. |
| `state` | Quick close/readiness/auditability flags. |
| `summary` | Dashboard cards, badges, and compact TUI rows. |
| `sources` | Source-level health; useful for drill-down links to existing commands. |
| `issues` | Blocking/warning details; consumers should not infer blockers from text. |
| `nextActions` | Copyable commands and review/edit/remediation/audit guidance. |

## Boundaries

| Boundary | Requirement |
|---|---|
| Read-only | The report must not append evidence, mutate Task Capsules, update project docs, call providers, run shell commands, or invoke MCP writes. |
| No new source of truth | Consumers must treat Task Capsule files, Task Board, evidence, and protocol doctors as the authoritative sources. |
| No duplicate expensive validation | Workbench uses task close dry-run as the done-level validation source; consumers should not immediately rerun harness validation unless the operator asks. |
| Additive schema | `hadara.task.workbench.v1` is fixture-level and additive; breaking field changes require a new schema id. |

## Follow-up Surface Policy

| Surface | Current Status | Rule |
|---|---|---|
| Dashboard live selected-task panel | Deferred | Must remain read-only and use the workbench report or service. |
| TUI selected-task summary | Deferred | Must remain read-only and avoid shell/provider/MCP calls. |
| MCP `hadara.task.workbench` | Deferred | Read-only only; no evidence attach or remediation execution. |
