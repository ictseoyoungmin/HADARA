# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | Defines Workstream C target. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON command contract. | Read |
| docs/SCHEMAS.md | Schema registry expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Evidence id friction is best solved with a compact read-only projection rather than changing append semantics. | 0.3.4 UX spec and direct HADARA-dev usage. | If wrong, agents may still prefer full `evidence list`, which remains available. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not rewrite `EVIDENCE.md` or `evidence.jsonl`. | AGENTS.md / IMPLEMENTATION_SOP.md | Summary command is read-only. |
| Keep `evidence list` compatibility. | 0.3.4 UX spec. | Added `evidence summary` instead of changing list payload shape. |
