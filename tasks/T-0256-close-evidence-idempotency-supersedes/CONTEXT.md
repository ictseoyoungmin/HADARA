# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and Phase 6 progress. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-task guidance. | Read |
| docs/TASK_BOARD.md | Task queue and close source-hash input. | Read |
| docs/IMPLEMENTATION_SOP.md | Docker validation and capsule workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Close/ready/audit command boundaries. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON report write policies and schema contracts. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 6 slice order and status tracking. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0256 idempotency/supersedes requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Close evidence v2 metadata can be additive. | Evidence v2 records already support tags; T-0256 spec allows tag-first approach. | Low; tests preserve existing evidence append behavior and add optional metadata coverage. |
| Same-hash close evidence should no-op at execute time. | T-0256 policy. | Low; tests assert evidence JSONL is unchanged on duplicate execute. |
| Changed source/report close evidence should supersede latest non-superseded proof where possible. | T-0256 policy. | Medium; legacy records without persisted ids cannot be tagged by id, so tests focus on v2 close evidence. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No readiness gate bypass. | T-0256 acceptance. | Close still runs done validation, evidence lint, and protocol doctor before any append/no-op decision. |
| No historical evidence rewrite. | HADARA evidence boundary. | Supersedes metadata is attached only to new close evidence records. |
| Additive schema behavior. | Schema compatibility rules. | Existing `hadara.task.close.v1` and `hadara.task.audit_close.v1` ids remain unchanged. |
