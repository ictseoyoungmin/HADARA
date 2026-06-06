# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current release, cleanup, and publish boundaries. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-step expectations. | Read |
| docs/TASK_BOARD.md | Task queue and T-0271 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and evidence requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard finish/ready/close/audit lifecycle. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Testing the published package in `/tmp/hadara-recycle-toy-0271` is enough to distinguish npm-installed behavior from workspace build behavior. | User request and container setup. | Findings might miss workspace-only issues, but that is outside the requested consumer-install path. |
| Representative interface coverage is more useful than literally executing every write or release mutation command. | HADARA safety model. | Some niche command edge cases may remain untested. |
| Dry-run/read-only release/package/install surfaces are sufficient for publish-safety validation. | T-0269 approval gate. | Real publish verification still belongs to T-0269. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run npm publish, release publish execute, GitHub Release creation, Docker image push, PyPI upload, or token-loading commands. | T-0269 release governance. | T-0271 is installed-interface recycle testing only. |
| Keep toy project writes isolated to the container `/tmp` project. | User request. | HADARA-dev receives only task evidence and findings docs. |
| Record both positive findings and bug/improvement candidates. | User request. | `FINDINGS.md` is the main output. |
