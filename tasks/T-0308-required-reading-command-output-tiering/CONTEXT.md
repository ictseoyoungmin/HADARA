# Context

T-0308 implements the machine-readable output side of the required-reading tier model introduced by T-0307.

The existing `docs required-reading --json` report already returns backward-compatible `documents` and `excluded` arrays from the docs registry. This task adds a semantic `tier` field to each entry without removing existing fields.

Tier names must be semantic: `current-state`, `task-work`, `conditional-reference`, `historical`, and `excluded`.

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| TBD | TBD | TBD |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| TBD | TBD | TBD |
