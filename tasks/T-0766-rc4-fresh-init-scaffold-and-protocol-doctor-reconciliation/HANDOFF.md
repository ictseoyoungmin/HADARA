# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0766 |
| Title | RC4 Fresh Init Scaffold and Protocol Doctor Reconciliation |
| Status | Done |
| Created | 2026-08-11T15:41 |
| Updated | 2026-08-11T15:55 |
## Last Completed

| Item | Evidence |
|---|---|
| Init v1 scaffold/protocol reconciliation implemented and validated across fresh minimal, standard, and governed projects; full repository check passed. | ev:T-0766:5122cc1df88b4ff5bb5811b7; ev:T-0766:564f2453d3614190b780ec1a |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Review the close dry-run plan and execute `hadara task close --task T-0766 --json` if readiness is `ready`. | Source validation is complete; this task intentionally does not publish RC4. | `TASK.md`, `EVIDENCE.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Step | Reason | Required Reading |
|---|---|---|
| Create the RC4 release capsule to rebuild and publish the corrected artifact, then rerun public consumer dogfood before stable promotion. | T-0765's RC3 warning is remediated in source, but the existing public RC3 artifact remains unchanged. | `docs/RELEASE_READINESS.md`, T-0765 reconciliation report, this capsule evidence |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Init v1 and legacy scaffold paths use different context anchor files. | A broad fix can regress older projects. | Keep legacy `HADARA_CONTEXT.md` routing and add Init v1-specific `READ_MAP.md` detection/tests. |
| RC4 source must be republished before stable. | Existing RC3 public artifact remains unchanged. | Do not mutate npm/GitHub in this capsule; hand off to a release capsule after source validation. |
