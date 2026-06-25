# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact session routing. | Read |
| docs/PROJECT_STATE.md | Current release state and active task. | Read |
| docs/AGENT_HANDOFF.md | Current T-0418/T-0419 status and publish retry guidance. | Read |
| docs/TASK_BOARD.md | Task queue and capsule paths. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and Docker validation expectations. | Read |
| Attached publish-clone timeout log | Shows the exact full-suite false failures blocking publish. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The publish clone failure came from full-suite resource contention plus a bootstrap default mismatch, not from six independent logic regressions. | Timeout-only failures and local focused/full reruns. | A hidden logic failure could reappear; mitigated by full suite rerun. |
| T-0418 remains the correct publish capsule. | Release helper preflight and Task Board. | Publishing with T-0420 would fail the release-capsule check. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep release mutation out of T-0420. | HADARA release boundary. | T-0418 owns npm publish. |
| Keep validation evidence public and reduced. | Evidence policy. | No private logs or machine-local secrets copied. |
