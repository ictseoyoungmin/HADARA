# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0768 |
| Title | Init v1 Profile and RC4 Release Provenance Reconciliation |
| Status | Draft |
| Created | 2026-08-11T17:23 |
| Updated | 2026-08-11T17:23 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

## Last Completed

| Item | Evidence |
|---|---|
| Corrective capsule created; implementation and evidence are pending. | `TASK.md` |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Finish profile/workflow fixes, regenerate RC4 evidence, and review the T-0767 continuation repair before close. | waiting-for-operator | no | This capsule is implementation-active; no external publish mutation is authorized here. | `TASK.md`, `docs/RELEASE_READINESS.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Publish the reviewed RC4 artifact to npm/GitHub and run public consumer recycle only in a separately approved operator capsule. | waiting-for-operator | yes | Corrective source changes invalidate the prior RC4 bytes; this task only regenerates and proves local readiness. | `docs/RELEASE_READINESS.md`, T-0767 handoff |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Existing T-0767 RC4 artifact is stale after this task changes `src/**`. | Uploading it would misrepresent current source. | Regenerate exact tarball/checksum/manifest after source validation; keep version `0.5.0-rc.4`. |
| Host-private release paths must not enter committed evidence. | Public evidence would leak machine-local details. | Record a stable `$HADARA_RELEASE_WORKSPACE/...` logical locator in operator handoff and keep actual path in ignored local state. |
