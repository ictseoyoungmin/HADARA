# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Project-local context anchor and routing guide. | Read |
| `docs/PROJECT_STATE.md` | Current project state and latest completed 0.4 registration task. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and T-04A2 next-step guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0428 capsule path. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Current repository workflow rules until 0.4 scaffold changes are implemented. | Read |
| `docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md` | Authoritative T-04A2 scaffold file-set and metadata requirements. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | Confirms T-04A2 slice scope and excludes release work. | Read |
| `src/cli/init.ts` | Current init scaffold generation and doctor implementation. | Read |
| `src/services/docs-registry.ts` | Current registry seed and context template implementation. | Read |
| `tests/unit/init.test.ts` | Focused test coverage for init scaffold behavior. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-04A2 should change the default init scaffold surface directly instead of adding compatibility options. | 0.4 productization spec plus ponytail review. | Legacy tests and helpers may need focused updates. |
| Detailed template prose polish can remain minimal in this capsule. | Worker plan assigns AGENTS/HADARA_WORKFLOW/HADARA_CONTEXT polish to T-04A3. | T-04A2 should avoid over-editing long template content. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Generated scaffold must stay generic and must not include HADARA-dev-specific commands or history. | `01_Project_Scaffold_Model.md` | Avoid Docker/npm/release details in generated defaults. |
| 0.4 generated projects do not create `docs/IMPLEMENTATION_SOP.md` or `docs/TASK_WORKFLOW_COMMANDS.md` by default. | `01_Project_Scaffold_Model.md` | Workflow ownership moves to `docs/HADARA_WORKFLOW.md`. |
| Release, publish, package, and installer work are out of this capsule. | User direction and worker plan. | No release-line commands. |
