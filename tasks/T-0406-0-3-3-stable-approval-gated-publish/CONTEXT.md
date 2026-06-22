# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state entry point and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and stable readiness status. | Read |
| docs/AGENT_HANDOFF.md | Routes current work to T-0406 publish. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and release mutation boundaries. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle. | Read |
| docs/RELEASE_READINESS.md | Release readiness and publish target. | Read |
| docs/RELEASE_NOTES.md | Stable 0.3.3 package notes. | Read |
| tasks/T-0405-0-3-3-stable-release-readiness-refresh/HANDOFF.md | Readiness evidence and carry-forward publish login blocker. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0405 readiness is sufficient for stable publish. | T-0405 closed-valid state and release dry-run ready. | Publishing without current readiness proof would violate release policy. |
| npm README should describe the package as already stable once uploaded. | User request and npm package behavior. | Leaving "after publish completes" in package README is confusing after npm upload. |
| npm login is an operator action. | T-0405 publish-helper `whoami` E401. | Helper cannot publish until the operator authenticates. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish without explicit operator approval. | Release workflow policy. | Publish is a registry mutation. |
| Use `latest` dist-tag for stable `0.3.3`. | Release readiness policy and helper default for non-rc versions. | Wrong tag would hide or misroute stable package. |
| No GitHub/Docker/PyPI mutation by default. | Scope boundary. | Keep release mutations explicit and separable. |
