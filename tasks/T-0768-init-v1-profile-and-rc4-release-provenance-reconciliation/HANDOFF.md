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
| Init v1 canonical profile authority, minimal READ_MAP workflow alignment, and profile regression matrix implemented; full validation passed. | Pending final validation evidence attachment |
| RC4 exact artifact regenerated from source commit `b41cbb7210b9e807d83ebf85ce033393b6d3bc3b`; package smoke passed against the same tarball bytes. | `ev:T-0768:574618e1931c47718869c2ce`; `ev:T-0768:ab000bf620c8436b95d71943` |

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

## RC4 Corrective Artifact Provenance

| Item | Value |
|---|---|
| Logical artifact root | `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.4/` |
| Actual local retention metadata | `.hadara/local/release-workspace.json` (ignored) |
| Source commit | `b41cbb7210b9e807d83ebf85ce033393b6d3bc3b` |
| Release input hash | `sha256:cd38f6afeab4312f426d00a5357ade0665b2ab70a111ebf95b20ac367d25104d` |
| Tarball | `hadara-0.5.0-rc.4.tgz`, 428507 bytes |
| Tarball SHA-256 | `171d03568fb6f6424aaf90560927837d89b558171ce5f4858b45115d18415b89` |
| Checksum SHA-256 | `857f55c6fa2dee29d1c15086767c16913c0e14e191d298f7c455a1d9baaa7c67` |
| Manifest SHA-256 | `37010b1b6b6f5654822dfe0606bcd68747d3b624c8b0fe72c354d72f64d79e09` |
| Retention | Keep these exact three files under the logical operator workspace through any selected secondary upload. |
