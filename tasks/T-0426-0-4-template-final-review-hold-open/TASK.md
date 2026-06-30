# T-0426 0.4 Template Final Review Hold Open

## Metadata

| Field | Value |
|---|---|
| ID | T-0426 |
| Title | 0.4 Template Final Review Hold Open |
| Status | Done |
| Created | 2026-06-29 |
| Updated | 2026-06-29 |

## Goal

| Goal | Notes |
|---|---|
| Continue 0.4 template final review while keeping the capsule open until the operator explicitly accepts the document set. | Do not run `task finalize --execute` or close this capsule until the operator says the 0.4 documents are final. |

## Scope

| In Scope | Reason |
|---|---|
| Clarify `AGENTS.md` versus `.hadara/context/HADARA_CONTEXT.md` ownership. | Required Reading belongs in `AGENTS.md`; HADARA_CONTEXT is a compact routing anchor, not a duplicate required-reading authority. |
| Simplify the 0.4 `TASK.md` template by removing `Scope`, `Out of Scope`, and task-local `Decisions`. | Reduce default capsule writing burden and avoid duplicating decision records. |
| Clarify `HANDOFF.md` `Next Recommended Step` semantics. | It should recommend next capsule/global-state work, not same-capsule lifecycle chores. |
| Strengthen `HADARA_WORKFLOW.md` with read authority, context-pack next actions, lifecycle entry gate, evidence truthfulness, finalize dry-run review, common failure modes, and a minimal loop. | The reviewer feedback identifies practical agent failure modes that should be prevented by the default workflow doc. |
| Set the 0.4 post-acceptance implementation budget to 24 capsules and exclude release work from that budget. | The operator requested room for self-review hardening, polish, cleanup, and a final review/docs cleanup capsule before any release line. |
| Keep T-0426 open after edits and validation. | The operator explicitly requested not to close until document finalization. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Registering 0.4 specs in Required Reading or docs registry. | T-04A1 remains the registration capsule after operator acceptance. |
| Implementing 0.4 CLI behavior or generated init output. | This capsule is spec/template review only. |
| Including 0.4 release readiness, publish, package recycle, or stable release work in the implementation budget. | The operator requested release work stay outside this budget for now. |
| Closing/finalizing T-0426 without explicit operator acceptance. | The operator explicitly requested an open capsule until document finalization. |
| Editing already closed T-0424/T-0425 capsule docs. | T-0426 owns this follow-up review. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-29 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-29 | In Progress | Opened final 0.4 template review capsule; keep open until operator acceptance. | T-0426 plan |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
