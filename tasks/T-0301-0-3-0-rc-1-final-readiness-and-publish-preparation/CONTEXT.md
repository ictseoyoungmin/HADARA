# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository protocol and required reading rules. | Read |
| docs/PROJECT_STATE.md | Current rc.1 and published rc.0 state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known release blockers. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, validation, evidence, and release-readiness rules. | Read |
| docs/RELEASE_READINESS.md | Release/publish boundary and operator helper path. | Read |
| docs/RELEASE_NOTES.md | Existing release-note structure and boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.0-rc.0` remains the current published npm package until the operator runs the rc.1 helper execute step. | npm registry observations from prior capsules and release-readiness docs. | README could again point users to an unpublished package if wording is not explicit. |
| rc.1 publish evidence must attach to a new rc.1 capsule, not T-0297. | T-0297 is the rc.0 final readiness/publish capsule. | Wrong capsule evidence would repeat release-history confusion. |
| The operator wants a clone-based `/tmp` publish flow with dry-run followed immediately by execute. | User request for exact command sequence. | Helper-generated evidence/artifacts could dirty the clone and block execute. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not execute npm publish in this capsule. | User/operator approval boundary. | Publish mutation remains manual and irreversible. |
| Preserve npm package metadata guardrails before publish. | T-0298 rc.1 metadata hardening. | Missing metadata would repeat the immutable rc.0 registry gap. |
| Keep release notes feature-focused. | User request. | Release communication should emphasize protocol migration adoption value, not only internal task history. |
