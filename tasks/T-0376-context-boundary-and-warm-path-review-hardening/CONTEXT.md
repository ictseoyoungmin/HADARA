# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Session read routing and HADARA-dev operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation path. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit lifecycle. | Read |
| docs/ARCHITECTURE.md | Store/read boundary context. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline. | Read |
| docs/SECURITY_MODEL.md | Raw read and local/generated storage constraints. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Review items 1-4 are safe to batch as one hardening capsule. | User instruction | Too broad a capsule would delay C6/C5; keep acceptance limited to these four fixes. |
| Acceptance parser v2 belongs in a later design capsule. | Review feedback and lifecycle spec context | Adding more ad-hoc status strings now could conflict with the redesign. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not write cache or project state. | C4/C6 specs and HADARA rules | Tests should snapshot no-write behavior where relevant. |
| Local/generated/private state is not canonical raw slice source. | Security/cache model | Context slice denylist must be stricter than ordinary project docs/source reads. |
| Benchmark script remains dev-only measurement, not CI gate. | T-0373 baseline docs | Timeout hardening should improve safety without adding timing assertions. |
