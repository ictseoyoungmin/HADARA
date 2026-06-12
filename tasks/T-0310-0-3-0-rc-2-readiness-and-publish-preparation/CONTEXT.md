# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and T-0310/T-0311 state. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow and write boundaries. | Done |
| docs/TEST_STRATEGY.md | Release/package validation expectations. | Done |
| docs/ROADMAP.md | Release scope boundary. | Done |
| docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md | T-0310 goal, scope, acceptance, and validation plan. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.0-rc.1` remains the current published npm RC until an explicit operator publish occurs. | README, Release Readiness, user instruction. | README could incorrectly imply rc.2 is already published. |
| T-0310 can prepare release evidence and publish dry-run without npm registry mutation. | AGENTS/SOP release boundary and T-0310 plan. | Accidental publish or token loading would violate release boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish, GitHub Release creation, Docker image publishing, PyPI upload, and installer execution are out of scope unless explicitly approved. | T-0310 plan and release docs. | Keep validation to local artifacts, smokes, gates, and dry-runs. |
| Release artifact execution requires a clean worktree. | Release artifact dirty-worktree guard. | Artifact refresh may need a committed readiness state before it can pass. |
