# T-0195 Dashboard Selected Task Evidence Lens

## Metadata

| Field | Value |
|---|---|
| ID | T-0195 |
| Title | Dashboard Selected Task Evidence Lens |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add selected-task evidence proof lens to the dashboard using shared read models. | The dashboard should select a task, read task workbench and evidence lint/list reports, derive proof status from semantic issue codes/summary, and avoid raw evidence meaning parsing. |

## Scope

| In Scope | Reason |
|---|---|
| Read-only `/api/task-workbench?taskId=` route | Dashboard selected task detail must reuse the shared workbench service. |
| Read-only `/api/evidence-lint?taskId=` route | Evidence proof status must come from shared semantic lint output. |
| Browser selected-task lens binding | User can select a task and see proof status, semantic counts, issues, and identity warning. |
| Proof priority and private-only warning wording | T-0195 must distinguish blockers from auditability warnings. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence writer or migration changes | Evidence v2 writer/migration is deferred. |
| Raw `evidence.jsonl`/Markdown proof parsing in UI | Dashboard must consume shared read models. |
| Browser-persisted selected task state | The selected task is in memory only. |
| Timeline read model | Reserved for T-0196. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | Created with `task create`. |
