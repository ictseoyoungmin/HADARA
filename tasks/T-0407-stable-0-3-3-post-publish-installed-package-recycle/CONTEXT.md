# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0406 stable publish completion. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and post-0.3.3 follow-up routing. | Read |
| docs/TASK_BOARD.md | Task queue and T-0407 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/RELEASE_READINESS.md | Release/package state source of truth. | Read |
| tasks/T-0406-0-3-3-stable-approval-gated-publish/HANDOFF.md | Stable publish evidence and non-run surfaces. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@latest` resolves to `0.3.3` after T-0406. | npm registry dist-tags | Recycle would fail or reveal a release-tag issue. |
| Disposable-project degraded context warnings are acceptable if commands return `ok:true`. | Fresh generated project has minimal docs/source files. | Do not overstate full HADARA-dev graph coverage from a tiny consumer project. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Use installed package binary from temp prefix, not source checkout `dist`. | T-0407 scope | Proves published package behavior. |
| Do not create GitHub Release draft or publish other targets. | Release readiness target boundaries | T-0407 is package recycle only. |
| Clean up temporary consumer paths. | Acceptance | Avoid leaving local state behind. |
