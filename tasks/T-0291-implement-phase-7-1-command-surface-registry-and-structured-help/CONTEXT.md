# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required workflow. | Read |
| docs/PROJECT_STATE.md | Current project state and Phase 7 staging status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, validation constraints, and T-0290 status. | Read |
| docs/TASK_BOARD.md | Task queue and T-0291 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Task/evidence/validation workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Ready/close/audit command sequence and close-source boundaries. | Read |
| docs/specs/0.3.0/00_Phase_7_Surface_Refactor_Program.md | Phase 7 ordering and cross-phase scope boundaries. | Read |
| docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md | Direct implementation specification for this capsule. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 7.1 can be implemented without removing public commands. | Phase 7.1 Non-Goals | Removing commands would violate compatibility and belongs in Phase 7.2. |
| `src/services/capability-registry.ts` must remain the single authoritative inventory. | Phase 7.1 Authoritative Inventory Decision | A second command metadata file would create drift and fail acceptance. |
| Existing command handlers should keep their runtime behavior. | Phase 7.1 Non-Goals | Behavior changes increase regression risk beyond discovery/help scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not create `src/cli/command-registry.ts`. | Phase 7.1 Existing Surface Integration | Helper modules may render/project only. |
| `tools list` must remain compatible and registry-derived. | Phase 7.1 Goal | Preserve existing machine consumers while reducing duplicate inventory. |
| New schemas must be registered in `src/schemas/schema-index.json` and documented. | Phase 7.1 Files/Acceptance | Schema drift must be testable. |
| Use Docker workflow where host Node/npm is unavailable. | `AGENTS.md`, `docs/IMPLEMENTATION_SOP.md` | Record blocked validation honestly if environment prevents a required check. |
