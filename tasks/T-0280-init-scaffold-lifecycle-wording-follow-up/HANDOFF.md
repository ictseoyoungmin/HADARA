# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0280 |
| Status | Done; ready for ready/close/audit |
| Last Updated | 2026-06-07 |

## Last Completed

| Item | Evidence |
|---|---|
| Created T-0280 and scoped it as an init wording/current release-state follow-up. | `TASK.md`, `ACCEPTANCE.md`, `PLAN.md`, `FILES.md`, `CONTEXT.md`, `RISKS.md`, and `TESTS.md` updated. |
| Patched generated init templates and current status docs. | `src/cli/init.ts`, README, root SOP/workflow docs, Project State, V1.0 implementation schema doc, and PyPI Trusted Publishing runbook updated. |
| Corrected the standard lifecycle order. | `task ready --level done` reported `finish-first`, so docs now use evidence, finish, ready, close, audit. |
| Validated the change. | Focused init/workflow tests passed 2 files / 24 tests; three-profile generated scaffold smoke passed; `git diff --check` passed; Docker full check passed 100 files / 681 tests; workspace built CLI init smoke passed. |
| Attached evidence. | `ev:T-0280:883a3d3ff3ca4620bb27131f`; `ev:T-0280:6435924f102a4021af2a6de3`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `task ready`, `task close`, and `task audit-close`. | Complete the standard HADARA lifecycle after `task finish --execute` marked the capsule Done. | `docs/TASK_WORKFLOW_COMMANDS.md`, T-0280 evidence. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| This task does not verify the live PyPI registry itself. | It records the user-reported PyPI publish status and aligns docs. | Add a future registry/install smoke capsule if stronger PyPI verification is needed. |
