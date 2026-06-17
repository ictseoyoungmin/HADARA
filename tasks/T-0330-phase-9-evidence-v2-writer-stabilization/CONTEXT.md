# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle/evidence command write boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Completed Evidence v2 and next-slice ordering. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | Existing v2 writer and migration contract. | Read |
| docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/B_Evidence_V2_Writer_Stabilization.md | Phase 9 source note for writer stabilization. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 9 can start as a focused implementation capsule without staging a new broad program spec. | `task next` recommendation and Work Item B scope. | If broader roadmap registration is required, shared docs will need additional rows before close. |
| Existing historical evidence remains mixed v1/v2. | T-0233 through T-0236 state and migration plan. | Accidentally treating v2-only behavior as global could create historical false positives. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | AGENTS/SOP/task workflow docs. | Use evidence writer for records. |
| Preserve append-only, idempotency-key-only dedupe semantics. | T-0284/T-0329 handoff state. | Fingerprints must not become dedupe keys. |
| No broad migration or automatic Markdown rebuild. | Evidence v2 migration plan and Work Item B non-goals. | This task must stay focused on writer semantics. |
