# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state entry point and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and release-line history. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0405 next-task routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle and close rules. | Read |
| docs/RELEASE_READINESS.md | Release readiness source to update and validate. | Read |
| docs/RELEASE_NOTES.md | Package-facing release notes. | Read |
| README.md | Package-facing install/status surface and tested docs. | Read |
| tasks/T-0404-0-3-3-dogfood-findings-release-hardening/HANDOFF.md | Dogfood hardening source for stable readiness. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0404 resolved the stable-blocking dogfood findings. | T-0404 close state and handoff. | Stable readiness would be premature if PF-F-010/PF-F-012 were still active. |
| Stable publish remains approval-gated and separate. | Release readiness policy and user workflow. | Accidentally running publish during readiness would violate HADARA mutation boundaries. |
| Package-facing docs can be staged before publish. | Prior stable publish readiness pattern. | README may temporarily describe the intended stable package before the operator completes publish. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish from T-0405. | Release workflow policy. | Readiness only; no registry mutation or token loading. |
| Use Docker validation baseline for HADARA-dev. | AGENTS.md and known host dependency issues. | Host `node_modules` is not reliable on this workspace. |
| Keep evidence append through HADARA CLI. | Evidence integrity rules. | Do not hand-edit `evidence.jsonl`. |
