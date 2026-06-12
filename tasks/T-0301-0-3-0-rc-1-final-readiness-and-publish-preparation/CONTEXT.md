# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository protocol and required reading rules. | Read |
| docs/PROJECT_STATE.md | Current rc.1 publish state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known release blockers. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, validation, evidence, and release-readiness rules. | Read |
| docs/RELEASE_READINESS.md | Release/publish boundary and operator helper path. | Read |
| docs/RELEASE_NOTES.md | Existing release-note structure and boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.0-rc.1` is now the current published npm package after operator execution. | T-0301 publish evidence and npm view verification. | README and release docs must no longer describe rc.1 as pending. |
| rc.1 publish evidence must attach to a new rc.1 capsule, not T-0297. | T-0297 is the rc.0 final readiness/publish capsule. | Wrong capsule evidence would repeat release-history confusion. |
| The operator wants a clone-based `/tmp` publish flow with dry-run followed immediately by execute. | User request for exact command sequence. | Helper-generated evidence/artifacts could dirty the clone and block execute. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Record npm publish only after explicit operator execution. | User/operator approval boundary. | Publish mutation is irreversible and should remain approval-gated. |
| Preserve npm package metadata guardrails before publish. | T-0298 rc.1 metadata hardening. | Missing metadata would repeat the immutable rc.0 registry gap. |
| Keep release notes feature-focused. | User request. | Release communication should emphasize protocol migration adoption value, not only internal task history. |
