# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Re-ran 0.4.2 stable-preflight dogfood across fresh `basic`, `standard`, and `governed` projects. | `ev:T-0544:e44e395885524fb8802c6756` |
| Fixed the two profile-specific regressions found during the rerun: optional `AGENT_HANDOFF.md` warnings in `context pack`, and absent-doc required-reading recommendations in `task status`. | `ev:T-0544:a004da2bfd5f48b390477f2c` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Prepare stable `0.4.2` release readiness/publish capsule. | Source-built dogfood now covers the prior T-0542 findings plus the new profile-optional document issues fixed in T-0544. | `docs/HADARA_WORKFLOW.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `tasks/T-0544-0-4-2-stable-preflight-dogfood-rerun/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Stable package proof is still pending. | T-0544 validates current source-built `dist`, not an installed `hadara@0.4.2` package. | After stable publish, run installed-package recycle/dogfood before treating the release line as fully closed. |
| `context pack` can still report `CONTEXT_PACK_BUDGET_TRUNCATED`. | This is bounded-context behavior rather than a regression, but it can look alarming in fresh projects. | Keep it documented as non-blocking unless truncation hides required read-first docs. |
