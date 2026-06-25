# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local routing. | Read |
| `docs/PROJECT_STATE.md` | Current project state and T-0415 active status. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next task guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0415 capsule path. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules. | Read via AGENTS/session constraints |
| `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` | Workstream G acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Context pack should remain a read-only projection. | 0.3.3 context routing contract and Workstream G | Mutating cache/evidence from context pack would violate release-line scope. |
| Additive action hints are preferable to changing existing buckets. | HADARA-dev dogfood friction and schema compatibility | Replacing `readFirst` semantics could break existing consumers. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No cache/write mutation from context pack. | CLI JSON contract | `agentActions` must be suggestions only. |
| Raw source text remains owned by `context slice`. | Context routing architecture | Context pack should provide commands/args, not raw text. |
| Validate in Docker and refresh workspace `dist` after CLI code changes. | AGENTS.md | Host npm/node_modules are not the baseline. |
