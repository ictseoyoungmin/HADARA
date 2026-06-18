# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact session anchor and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow and command ownership. | Read |
| docs/DEVELOPMENT_SLICES.md | Current 0.3.3 slice ordering and T-0363 completion state. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | C3 context pack consumer expectations. | Read |
| docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md | C4 should remain read-only and avoid broad discovery. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Compact C6 cache contract. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed C6 speed-first cache/status plan. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Cache status can be public before cache warm writes. | C6 spec read/write boundary. | If wrong, users may expect status to create cache; report must explicitly remain read-only. |
| T-0364 should not unblock C4 by itself; it prepares C6.3/C6.4 integration. | T-0363 handoff and C6 spec. | Stopping at status leaves graph/pack live reads slow until later cache integration. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not create `.hadara/local/cache/context`. | C6 cache command boundary. | `context cache status --json` must tolerate missing cache and report miss. |
| Cache is not truth. | C6 core rule. | Corrupt/missing/stale cache must never fail source-of-truth reads unless status report itself cannot be generated. |
| Keep persisted cache paths project-relative. | HADARA portable/project boundary. | No absolute cache/source paths in cache records or status payload. |
