# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state read-routing anchor. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation constraints. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation requirement. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command semantics and write boundaries. | Read |
| docs/LIFECYCLE_GUIDE.md | Agent-facing lifecycle guide updated by this capsule. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Low-level finish/ready/close/audit commands should remain available. | User direction and existing HADARA proof-boundary design. | Removing them would break recovery/debugging and existing command contracts. |
| The default agent path should be visible through both docs and CLI help/projection. | User request to make agents follow the new 0.3.3 cycle. | Agents could keep seeing the old sequence as primary. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task finalize --execute` must remain guarded by a reviewed `planHash`. | docs/TASK_WORKFLOW_COMMANDS.md | This capsule must not weaken write-boundary safety. |
| HADARA-dev source changes require Docker validation and refreshed `dist`. | AGENTS.md and docs/IMPLEMENTATION_SOP.md | Built CLI smokes must use current dist. |
| Evidence append is append-only and failed checks remain visible. | AGENTS.md | Host vitest failure was recorded and resolved by Docker/built CLI evidence, not deleted. |
