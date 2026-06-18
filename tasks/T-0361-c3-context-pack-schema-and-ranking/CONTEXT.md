# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state read routing and operating rules. | Read |
| `docs/PROJECT_STATE.md` | Current 0.3.3 progress and T-0360 C6 spec result. | Read |
| `docs/AGENT_HANDOFF.md` | Latest validation baseline and next work recommendation. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0361 capsule row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | HADARA workflow and Required Reading rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit flow. | Read |
| `docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md` | Context routing architecture and no-model/no-summary/read-only constraints. | Read |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | C3 context pack contract and ranking rules. | Read |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | C4 slice dependency and source-addressed slice candidate shape. | Read |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | Cache-aware performance constraints for context pack warm paths. | Read |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | C3/C4 capsule sequence and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C3 should proceed now even though T-0360 handoff suggested C6.1 if speed remains priority. | User explicitly requested C3-C4 progression with C6 in mind. | If speed becomes the immediate blocker, pause after this capsule and implement C6.1 before public C3 CLI. |
| First C3 capsule should not add a public CLI yet. | Worker plan splits schema/ranking before graph-only/CLI/docs examples. | If users need CLI immediately, next capsule should expose the existing internal builder through `context pack`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context pack must be read-only and deterministic. | C3 spec and architecture overview. | No validation execution, evidence append, document patching, models, or summarization. |
| Ranking must be bounded. | C3 spec. | Default `maxReadFirstItems` is 7 and truncation must be explicit. |
| C3 should not independently rescan project state when an existing graph report is supplied. | C6 spec. | Builder accepts injected graph report; future cache/warm graph can feed the same API. |
| C4 output remains original source slices, not summaries. | C4 spec. | This capsule can prepare slice candidate metadata but not perform slicing. |
