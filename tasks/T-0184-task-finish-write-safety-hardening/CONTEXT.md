# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and phase marker. | Read |
| docs/AGENT_HANDOFF.md | Validation baseline and known runtime caveats. | Read |
| docs/TASK_BOARD.md | Task queue and status source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, evidence, and close rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Recent Phase 3.5 capsule ordering. | Read |
| src/services/protocol-remediation.ts | Existing safe write pattern. | Read |
| src/task/task-upgrade-scaffold.ts | Existing task-level atomic write pattern. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `task finish` should match existing temp-file/rename patterns. | User feedback and existing implementation precedent. | Low; same style already used elsewhere. |
| Hash metadata can be additive in `hadara.task.finish.v1`. | Schema allows additive properties. | Low; existing consumers should ignore unknown fields. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep finish bounded. | User feedback and T-0180 decision. | No Development Slices/Project State/Handoff/evidence writes. |
| Do not invent a new transaction framework. | Existing repo patterns use temp-file/rename plus rollback-attempt. | Reuse local pattern with focused checks. |
