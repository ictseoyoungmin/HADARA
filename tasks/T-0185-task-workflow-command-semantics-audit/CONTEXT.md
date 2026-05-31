# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and Phase 3.5/Phase 4 boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, validation baseline, and known workflow frictions. | Read |
| docs/TASK_BOARD.md | Task queue and T-0185 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and validation expectations. | Read |
| docs/CLI_JSON_CONTRACT.md | Existing command-specific JSON semantics. | Read |
| README.md | Public quick-start command surface. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and next row placement. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0185 should not change command behavior. | User requested a semantics audit/UX cleanup before Phase 4. | Unexpected implementation changes could widen risk without a command-specific capsule. |
| `task.status.ok` remains report-generation success. | T-0177 decision and CLI JSON contract. | Consumers could confuse status with readiness if documentation drifts. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve existing write boundaries. | `task finish` and `task close` contracts. | Finish remains bounded to `TASK.md` and Task Board; close remains close-evidence-only. |
| Keep docs testable. | Phase 3.5 schema/docs hardening pattern. | Add unit tests that assert key loop commands and semantics stay present. |
