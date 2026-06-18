# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local context anchor and read-routing guide. | Read |
| `docs/PROJECT_STATE.md` | Current project state and 0.3.3 progress. | Read |
| `docs/AGENT_HANDOFF.md` | Latest completed task, validation baseline, and next-step guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0360 capsule row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and project-specific Required Reading registration policy. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit workflow. | Read |
| `docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md` | Existing C6 cache, invalidation, and budget baseline. | Read |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | C6 worker routing and capsule breakdown. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C6 can be specified now as a detailed implementation plan even though C3 is otherwise the next planned phase. | User explicitly requested C6 spec and speed-first design. | If phase order must remain strict, future workers can keep this spec as reference and implement C3 first. |
| Graphify-style manifest/update ideas are useful, but HADARA must keep caches local, optional, and non-authoritative. | Existing C6 spec and HADARA cache rule. | Copying Graphify output/commit behavior directly would violate HADARA source-of-truth boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache files must live under `.hadara/local/cache/context/`. | Existing C6 spec. | Do not use `.hadara/cache/`. |
| Read-only context commands must not mutate project files. | Worker plan. | Cache writes need an explicit cache warm/write surface or future accepted boundary. |
| Incomplete output must be explicit degraded output. | Existing C6 spec and C2 budget hardening. | Never silently omit sources, nodes, or edges. |
| Existing code changes must be captured as future implementation work, not applied in this docs-only capsule. | User request and task scope. | This task edits specs and state docs only. |
