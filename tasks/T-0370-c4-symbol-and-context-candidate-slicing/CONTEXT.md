# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Session routing and operating rules. | Read |
| `docs/PROJECT_STATE.md` | Current 0.3.3 context-routing state. | Read |
| `docs/AGENT_HANDOFF.md` | Current next-task handoff and known validation baseline. | Read |
| `docs/TASK_BOARD.md` | Task queue and current T-0370 capsule row. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit lifecycle rules. | Read |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | C3 slice candidate contract. | Read |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | C4 required CLI and JSON behavior. | Read |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | C6 speed/read-only/cache boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C2 symbol index currently records symbol declaration line but usually not exact body end line. | `src/context/code-index.ts` | Symbol slicing must use bounded neighborhoods until C2 stores precise ranges. |
| Context-pack candidate ids are deterministic within a context-pack report but depend on ranking order. | `src/context/context-pack.ts` | Candidate slicing must resolve from a fresh pack report for the given task and reject unknown ids. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No summarization and no proof claims. | C4 spec | Return original text only. |
| No implicit cache writes. | C6 spec | Candidate and symbol resolution may read graph/pack/index data but must not warm cache automatically. |
| Preserve T-0369 safety boundaries. | T-0369 implementation | Continue rejecting unsafe paths, binary files, and oversized reads. |
