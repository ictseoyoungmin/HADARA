# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state read routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required reading. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit and close-source rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice sequencing and completion evidence expectations. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline and task completion gates. | Read |
| docs/SECURITY_MODEL.md | File boundary and public/private safety invariants. | Read |
| docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md | C4 source-addressed original text and budget rules. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Cache-is-not-truth and context slice cache policy. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | C6 speed-first and `.hadara/local` cache boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Byte truncation is worse than failure for C4 raw slices. | User request and C4 original-text fidelity principle. | If wrong, callers may prefer partial text; current C4 spec favors source fidelity. |
| `.hadara/local` should be denied by default for raw slicing. | Cache/private local state is not canonical source text. | If future debugging needs cache reads, add an explicit reviewed flag later. |
| T-0370 AC-6 drift happened because close-source docs were not edited after close. | Session history and `ACCEPTANCE.md` state. | Fixing only the row without a gate would allow recurrence. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | HADARA SOP | Use `evidence add-command`. |
| Close-source docs must be finalized before close. | TASK_WORKFLOW_COMMANDS | T-0372 docs/shared docs must be complete before ready/close. |
| Read commands remain non-mutating. | C4/C6 specs | Context slice fixes must not add cache writes or evidence writes. |
