# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and paused Dashboard/TUI boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and release/package next priority. | Read |
| docs/TASK_BOARD.md | Task queue and T-0242 capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation path. | Read |
| docs/TEST_STRATEGY.md | Release/package smoke and dry-run evidence contract. | Read |
| README.md | Public release command examples. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Release/package readiness hardening should stay read-only. | Release dry-run/publish docs and AGENTS boundary. | Accidentally turning planning into execution would weaken release safety. |
| Current release dry-run latency needs diagnosis, not automatic optimization in this capsule. | Built CLI smoke showed `strict-release-gate` as the slow stage. | Optimizing the wrong layer could add risk without improving operator clarity. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish, create GitHub Releases, build Docker images, or execute installers. | README, TEST_STRATEGY, release service contracts. | This capsule only changes planning/reporting surfaces. |
| Use Docker validation for CLI code changes and refresh `dist`. | AGENTS and IMPLEMENTATION_SOP. | Host `node_modules` is not the baseline. |
