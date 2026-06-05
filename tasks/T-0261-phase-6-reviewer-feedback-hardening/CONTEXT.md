# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Workflow command semantics and Phase 6 metadata vocabulary. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON contract documentation for `dev docker-check`. | Read |
| Reviewer pasted feedback | Source of immediate and deferred hardening items. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The only urgent code-level fix is misleading `dev docker-check --sync-dist` mutation reporting. | Reviewer feedback and existing T-0258 implementation. | Leaving it unchanged could mislead multi-agent operators about workspace output writes. |
| Actor CLI plumbing, close append races, task create collisions, and handoff fragment polish need broader capsules. | Reviewer feedback. | Implementing them inside this capsule would mix multiple workflow surfaces and expand risk. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve additive JSON compatibility. | CLI JSON contract. | Existing `projectMutation:false` remains as a compatibility alias. |
| No full multi-agent runtime. | Phase 6 boundary and reviewer feedback. | Phase 6.1 spec is hardening-only. |
| No hidden writes. | HADARA protocol. | `dev docker-check` still writes workspace `dist` only with explicit `--sync-dist`. |
