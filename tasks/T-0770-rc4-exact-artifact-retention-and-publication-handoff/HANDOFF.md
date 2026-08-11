# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0770 |
| Title | RC4 Exact Artifact Retention and Publication Handoff |
| Status | Done |
| Created | 2026-08-11T19:00 |
| Updated | 2026-08-11T19:05 |

## Last Completed

| Item | Evidence |
|---|---|
| RC4 exact retention verified: logical locator, three files, hashes, checksum content, manifest provenance, source commit, and no-publish boundary all pass. | ev:T-0770:b23dcb8573b04738bfc00aa9 |
| Evidence projection lint passed with zero errors or warnings. | ev:T-0770:f7f0d7f5709e4509bdbc7863 |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Exact retained RC4 files, provenance, and evidence lint are complete; no pending pre-close action remains. | terminal | no | The current continuation is the separate operator publication flow below. | `TASK.md`, `docs/RELEASE_READINESS.md` |

## RC4 Exact Artifact Handoff

| Item | Value |
|---|---|
| Logical artifact root | `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.4/` |
| Tarball | `hadara-0.5.0-rc.4.tgz`; SHA-256 `5ccbb838940af4bad1e65308a7bed9e561ae682401d359df181c04ab89dc30ce` |
| Checksum file | `hadara-0.5.0-rc.4.tgz.sha256`; SHA-256 `a669125d5c0cb0b28be3fab113c39db470bbfbc30be1b23654572ea760d4feca` |
| Manifest file | `hadara-0.5.0-rc.4.tgz.manifest.json`; SHA-256 `4910bffd76c97c7ba5204854207837b89498eb533034dfbb5f9929e23d18c5da` |
| Source | Commit `67d5935cfb4cd27bc4d79679e25789417917f4c5`; release input `sha256:c7c31f8e4d80647a6e0aebe72bd6077df86425dba0faa6802f951e76e33e377c` |
| Publish rule | Publish these exact bytes; do not rebuild or substitute a regenerated artifact. |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Publish the exact retained RC4 bytes to npm `next` and GitHub prerelease in the separately approved operator flow. | actionable | yes | Use the verified logical locator and do not rebuild or substitute artifact bytes. | `docs/RELEASE_READINESS.md`, docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not edit T-0769 after close. | Reopening or editing close-source docs would invalidate the prior terminal proof. | Record the current locator and publication handoff in T-0770 and the active release readiness doc. |
