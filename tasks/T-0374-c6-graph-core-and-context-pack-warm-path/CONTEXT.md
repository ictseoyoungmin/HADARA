# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Session read routing and project-local anchor. | Read |
| docs/PROJECT_STATE.md | Current context-routing state and next C6 priority. | Read |
| docs/AGENT_HANDOFF.md | Latest handoff and T-0373 performance baseline summary. | Read |
| docs/TASK_BOARD.md | Task queue and latest completed context-routing capsules. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required reading for C6 work. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and evidence write boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and evidence-backed work discipline. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed C6 cache/warm path design. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | Execution-focused graph-core/context-pack warm path requirements. | Read |
| docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md | Mounted/ext4 timings that motivate this work. | Read |
| docs/ARCHITECTURE.md | Runtime/storage boundary context. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline. | Read |
| docs/SECURITY_MODEL.md | Local cache and write-boundary invariants. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Fresh cache shards may be consumed by read commands but never written by them. | C6 specs | Accidental read-command writes would violate HADARA cache boundaries. |
| Non-code graph-core warm path is higher priority than code-index persistence. | T-0373 baseline and C6 spec | Pulling code-index scope in could make the capsule too large and delay C5 unblock. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache remains local and rebuildable under `.hadara/local/cache/context`. | C6 specs / security model | Do not commit generated cache artifacts. |
| Evidence must be appended through HADARA evidence commands, not hand-edited. | Workflow docs | Keep `evidence.jsonl` append-only and canonical. |
| Docker validation is the baseline for CLI/runtime changes. | TEST_STRATEGY | Host Node/npm may be unreliable on `/mnt/f`. |
