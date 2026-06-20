# T-0391 Task Next Self Referential Handoff Guidance Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0391 |
| Title | Task Next Self Referential Handoff Guidance Hardening |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Prevent `task next` from recommending self-referential handoff meta-guidance as new work. | Dogfooding showed `task next` could propose `hadara task create 'Run task next...'` when handoff only said to run/select with `task next`. |

## Scope

| In Scope | Reason |
|---|---|
| `src/task/task-next.ts` handoff-step actionability filter. | Keep handoff-first behavior but exclude meta-guidance that points back at `task next`. |
| `tests/unit/task-next.test.ts` focused regression. | Prove fallback to Development Slices remains available. |
| CLI/workflow docs and capsule findings. | Record the agent-usage finding and contract semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New task selection algorithm or ranking model. | The defect is a narrow handoff parsing issue. |
| Automatic handoff updates. | Handoff remains operator/coordinator-owned. |
| Broad project cleanup. | This is a dogfood hardening slice. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | `task create` |
| 2026-06-20 | In Progress | Dogfooded `session start` and `task next`; found self-referential handoff guidance promoted as work. | `ev:T-0391:cc9957fe4c954754bee38b41` |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
