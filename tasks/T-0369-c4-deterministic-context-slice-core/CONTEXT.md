# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing and HADARA-dev operating anchor. | Read |
| `docs/PROJECT_STATE.md` | Current project state after C6.5 and next C4/C6.6 choice. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and validation baseline. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0369 capsule row. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Slice ordering and latest C6.5 completion row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow, Docker validation, and dist sync rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit semantics. | Read |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | C4 JSON contract, CLI surface, safety rules, and acceptance criteria. | Read |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | C3 slice candidate contract for future integration. | Read |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | C4 capsule sequence and done criteria. | Read |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | Speed/read-only/cache boundaries that C4 should preserve. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C4 core can ship before symbol and context-candidate strategies. | Worker plan lists safe line reader/range/tail/keyword/managed section before symbol/candidate integration. | If consumers expect all spec strategies at once, mark unsupported strategies explicit in CLI errors and follow-up scope. |
| Context slice should not discover broadly. | C4 spec. | Reading arbitrary graph/pack candidates before explicit integration could recreate slow broad reads. |
| Existing managed-section markers are parseable from raw Markdown. | Managed-section parser behavior from earlier docs patch work. | If marker variants differ, implement a simple marker-boundary reader and return not-found/degraded issues for malformed input. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Return original text only. | C4 spec. | No summarization, proof claims, validation execution, or evidence append. |
| Keep paths project-relative and bounded. | C4/C6 specs. | Reject absolute/outside paths, ignored dependency/cache paths, binary files, excessive line counts, and oversized reads. |
| Public command must be registered. | Worker plan/SOP. | Add command registry metadata and CLI JSON coverage. |
