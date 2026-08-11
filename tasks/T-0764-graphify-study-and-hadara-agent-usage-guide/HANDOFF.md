# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0764 |
| Title | Graphify Study and HADARA Agent Usage Guide |
| Status | Done |
| Created | 2026-08-11T14:41 |
| Updated | 2026-08-11T14:51 |
## Last Completed

| Item | Evidence |
|---|---|
| Installed Graphify study completed against the existing HADARA-dev graph. | `EVIDENCE.md` (`ev:T-0764:8c240f8566174ca9a1b14c1d`) |
| Reusable agent guide includes command recipes, refactoring workflows, source-of-truth boundaries, and historical/archive document recency warnings. | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md`; `ev:T-0764:b8ed77450e2a48a58b651b17` |

## Pre-Close Operator Action

| Step | Reason | Required Reading |
|---|---|---|
| Record the follow-up validation, run `hadara harness validate --task T-0764 --level done --json`, review `hadara task close --task T-0764 --dry-run --json`, then execute the reviewed proof-last reclose. | The guide and three-file capsule were deliberately reopened to add the historical-document authority warning. | `TASK.md`, `EVIDENCE.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No continuation until a future Graphify-focused task is explicitly selected. | terminal | no | This study capsule delivers the reusable guide and does not authorize runtime Graphify integration or agent-config mutation. | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Execute the proof-last task close after reviewing the done-level validation and dry-run. | The capsule's implementation, evidence, and handoff are complete; only lifecycle proof remains. | `TASK.md`, `EVIDENCE.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Graphify is static and the current graph contains mixed source, tests, task artifacts, and documents. | Broad queries can be noisy or miss runtime/string-based relationships. | Prefer exact labels and `affected`/`path`; inspect cited source, use `rg`, then run tests/typecheck and HADARA validation. |
| `graphify-out/` is generated local state. | It must not become committed project truth. | Keep it ignored; use Task Capsule/evidence commands for durable records. |
