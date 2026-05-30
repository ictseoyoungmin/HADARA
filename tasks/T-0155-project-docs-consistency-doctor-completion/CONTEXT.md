# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `docs/PROJECT_STATE.md` | Current project state and protocol doctor capability wording. | Read |
| `docs/AGENT_HANDOFF.md` | Current validation baseline and Docker workflow constraints. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0155 active row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Required workflow and Docker built-CLI refresh rules. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Phase 2 ordering and need to correct T-0154 coverage classification. | Read |
| `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` | Source plan for full Project Docs Consistency Doctor coverage. | Read |
| `tasks/T-0154-project-docs-consistency-doctor/*` | Shows the MVP checks already implemented and evidence baseline. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0155 is the numeric Task Capsule for the logical T-0154a follow-up. | HADARA task IDs are numeric and existing parsers expect `T-0000`. | Creating a literal `T-0154a` capsule would break current Task Board/task parsers. |
| Project-doc checks should stay warning-oriented unless a required document is missing or duplicate Task Board rows exist. | T-0154 exit policy and doctor-vs-harness boundary. | Overly strict diagnostics would block work on historical docs. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only doctor only. | Phase 2 plan. | No remediation writes in this capsule. |
| No Git-aware checks. | Phase 2 non-goal and user direction. | Do not inspect commit history for consistency. |
| Use Docker for validation and refresh `/workspace/dist` after CLI changes. | SOP and handoff. | Avoid stale CLI smoke results. |
