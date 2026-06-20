# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Session context anchor and routing guide. | Read |
| docs/PROJECT_STATE.md | Current project state after T-0387. | Read |
| docs/AGENT_HANDOFF.md | Active/next task state and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice status updates for new follow-up work. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, evidence, and close rules. | Read |
| docs/SECURITY_MODEL.md | Security boundaries for raw reads and local state. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | Context pack JSON contract and readFirst/readIfNeeded semantics. | Read |
| docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md | Raw slice adapter safety rules. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | Current completion audit and T-0387 boundary status. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `readFirst` and `readIfNeeded` express graph relevance, not guaranteed raw text readability. | Reviewer comment and context pack spec. | Removing items could hide useful graph context. |
| Slice candidates should remain limited to raw-sliceable paths. | T-0387 implementation. | Publishing unusable suggested commands causes operator confusion. |
| Consumers need machine-readable metadata to distinguish these cases. | User accepted follow-up direction. | Without metadata, agents may treat all read recommendations as slice commands. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep read commands write-free. | Context routing specs. | Do not introduce cache or evidence writes in context pack. |
| Additive schema change only. | Backward compatibility. | Do not change schema id or remove fields. |
| Prefer Docker validation and dist refresh for CLI/source changes. | AGENTS.md / SOP. | Host npm is not the baseline. |
