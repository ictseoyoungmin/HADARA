# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/TASK_WORKFLOW_COMMANDS.md | Task close/ready/finish loop and evidence order. | Read |
| tasks/T-0271-npm-installed-toy-project-interface-recycle/FINDINGS.md | Source finding for this bug. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Fake-shell tool messages are serialized as JSON before the next provider call. | `src/agent/loop.ts` and T-0271 installed-package recycle. | If observation formatting changes, a hard-coded envelope substring could become stale. |
| `"status":"completed"` is a stable success signal for generated fake-shell fixtures. | `src/tools/fake-shell.ts` observation shape. | If non-success fixtures are scaffolded later, generation should choose a status-specific matcher. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep deterministic run semantics unchanged. | T-0271 finding and existing run tests. | Fix generation, not provider matching behavior. |
| Use Docker/temp-copy validation because host dependencies are not authoritative. | AGENTS.md and docs/IMPLEMENTATION_SOP.md. | Host `node_modules` is ignored local state. |
