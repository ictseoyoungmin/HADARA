# T-0229 TUI Selected Task Detail Shared Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0229 |
| Title | TUI Selected Task Detail Shared Read Model |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Move TUI selected task proof/evidence semantics onto shared dashboard task-detail services. | TUI should stop deriving selected task proof from raw `evidence.jsonl`/`EVIDENCE.md` semantics and carry the same aggregate used by Dashboard. |

## Scope

| In Scope | Reason |
|---|---|
| Add dashboard task-detail aggregate to `TuiReadModel.selectedTask`. | Aligns terminal selected task state with shared operator read models. |
| Prefer shared evidence/proof data in snapshot summary. | Removes proof-status drift from TUI-local evidence Markdown heuristics for selected task cards. |
| Keep document viewer files compatible. | The current TUI viewer still needs Task Capsule Markdown bodies until a later cache/index replacement slice. |
| Update docs/evidence/validation. | Required by HADARA task workflow. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replace TUI task index/cache source signals. | Planned for the next capsule focused on `/mnt/f` broad scan reduction. |
| Remove all Task Capsule Markdown body reads. | Detail document viewer still needs file text until a dedicated document/projection strategy exists. |
| Dashboard HTTP calls. | TUI must call shared services directly. |
| New write, shell, provider, or MCP behavior. | TUI remains read-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-03 | In Progress | Scope fixed to selected task proof/evidence shared read-model replacement. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |

