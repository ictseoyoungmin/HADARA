# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing and HADARA-dev operating rules. | Read |
| docs/PROJECT_STATE.md | Confirms T-0315 stable readiness is complete and stable publish remains T-0316. | Read |
| docs/AGENT_HANDOFF.md | Names T-0316 as the next approval-gated publish task and records validation baseline. | Read |
| docs/TASK_BOARD.md | Confirms T-0315 is Done and T-0316 is the new capsule. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, release-validation expectations, and task lifecycle. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close command semantics and close-source rules. | Read |
| docs/RELEASE_READINESS.md | Release target, publish boundary, token secrecy, and release evidence rules. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated npm publish helper that the operator will run after `npm login`. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0315 readiness evidence remains valid for this publish candidate. | T-0315 close/audit and release readiness baseline. | If source changes beyond package-facing docs invalidate release evidence, rerun release readiness before publish. |
| The README must be staged as post-publish content before `npm publish`. | User request and npm package behavior. | If left as "publish pending", npmjs package page would be confusing immediately after publish. |
| The operator will run the credentialed helper and provide output. | User request. | Without operator output, T-0316 cannot be finished or closed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish mutation is operator-approved and manual. | RELEASE_READINESS / helper design. | Codex should not run `npm publish` directly or handle credentials. |
| Evidence must be reduced and public. | SECURITY_MODEL / release readiness convention. | Do not commit tokens, auth URLs, private npm logs, or local-only paths. |
| Post-publish recycle is separate. | T-0315/T-0316/T-0317 split. | T-0316 records publish; T-0317 validates installed-package consumer behavior. |
