# T-0376 Context Boundary and Warm Path Review Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0376 |
| Title | Context Boundary and Warm Path Review Hardening |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Review hardening before returning to C6/C5 plan | Apply the four actionable review items: context-slice generated/local boundary alignment, graph-core stale/corrupt regression coverage, benchmark timeout robustness, and structured context-pack suggested command args. |

## Scope

| In Scope | Reason |
|---|---|
| Context slice denylist alignment | Keep raw slice reads away from ignored/generated/local surfaces before C5 consumes slices broadly. |
| Graph-core warm path regression tests | Prove high-risk graph-core stale/corrupt and include-code combinations without changing cache semantics unnecessarily. |
| Benchmark timeout hardening | Keep the dev-only mounted/ext4 benchmark from hanging indefinitely when a child ignores SIGTERM. |
| Context pack `suggestedCommandArgs` | Preserve copyable command UX without shell-quoting ambiguity. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Acceptance parser v2 | Lifecycle close contract redesign needs a separate 0.3.4/parser-v2 design and should not be solved by adding ad-hoc status strings here. |
| Incremental/per-file code-index recompute | Return to the existing C6/C5 plan after this review hardening capsule. |
| New public command surfaces | This task only hardens existing read models and tests. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Scope set to review hardening items 1-4 before returning to C6/C5 plan. | user review |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
