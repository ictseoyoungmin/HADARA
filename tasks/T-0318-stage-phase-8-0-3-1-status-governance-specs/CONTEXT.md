# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository-level HADARA protocol instructions. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact context routing and project-local state anchor. | Read |
| docs/PROJECT_STATE.md | Current stable 0.3.0 state and next-line context. | Read |
| docs/AGENT_HANDOFF.md | Current known problems and next-task guidance. | Read |
| docs/TASK_BOARD.md | Task queue and T-0318 creation state. | Read |
| docs/IMPLEMENTATION_SOP.md | Required Reading registration and workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit and close-source rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and current 0.3.0 completion baseline. | Read |
| docs/ROADMAP.md | Release/scope planning context. | Read |
| docs/ARCHITECTURE.md | System boundaries for future state projection work. | Read |
| docs/TEST_STRATEGY.md | Validation expectations for docs-only planning work. | Read |
| docs/SECURITY_MODEL.md | Permission and write-boundary constraints. | Read |
| docs/DECISIONS.md | Existing Phase 7 naming decision precedent. | Read |
| docs/specs/0.3.0/* | Phase 7 spec structure to mirror. | Read |
| docs/specs/tmp_dir_hadara_work_items_architecture_specs/* | Source Work Item A/F design input. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 8 should promote Work Item A/F before context graph work. | User instruction and temporary specs. | Later graph work may encode ambiguous status if this is skipped. |
| This task is docs-first staging only. | User requested concrete spec expansion and capsule slicing. | Runtime validation would be too broad if implementation is included. |
| Completed 0.3.0 implementation specs should not remain active Required Reading rows. | User instruction. | Agents may keep reading stale planning docs by default. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Write new specs in English. | User instruction. | Avoid Korean prose in committed Phase 8 specs. |
| Keep work inside one Task Capsule. | AGENTS.md. | T-0318 is the capsule. |
| Do not hand-edit `evidence.jsonl`. | AGENTS.md. | Use `evidence add-command`. |
| Do not add runtime behavior. | T-0318 scope. | Future capsules own implementation. |
