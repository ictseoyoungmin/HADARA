# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and active T-0414 routing. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and T-0414 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation preference. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | Defines Session Start primary-action hardening workstream. | Read |
| docs/CLI_JSON_CONTRACT.md | Session Start JSON contract. | Read |
| docs/SCHEMAS.md | Session Start schema documentation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing `guidance.primaryNextAction` is a compatibility category, not enough for copyable first action UX. | Current `hadara.sessionStart.v1` output. | Agents keep inferring whether to run status, context pack, lifecycle, or live context. |
| With a task id, the safest first command is `task lifecycle`. | 0.3.3 finalize-first lifecycle policy. | Starting with finalize/status/context can skip the canonical lifecycle phase check. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Session Start remains read-only. | Context-routing contract. | No cache warm, evidence append, validation execution, raw slice read, or project mutation. |
| Additive schema evolution only. | External consumers may already read `hadara.sessionStart.v1`. | Existing fields remain present; new fields are additive. |
