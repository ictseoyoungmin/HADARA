# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current compact context anchor and routing guide. | Read |
| `docs/PROJECT_STATE.md` | Current project state and active task markers. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and T-04A4 next-work note. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0430 capsule row. | Read |
| `docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md` | Defines `.hadara/docs-registry.json` as canonical registry and forbids prose-row mutation for registration. | Read |
| `docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md` | Defines 0.4 `hadara docs register` compatibility and schema expectations. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | Assigns T-04A4 to docs registry storage/register surface. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `docs register` can be additive over the current registry model. | Existing `DocumentRegistryEntry` fields are sufficient for the first registration surface. | Future read-map metadata may need later additive fields. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not append per-document rows to AGENTS/context/workflow/SOP prose. | 0.4 productization design. | Tests assert dry-run/execute registration does not create optional projection prose by default. |
| Evidence must reflect real execution. | HADARA workflow rules. | Validation evidence records actual Docker and built CLI results. |
