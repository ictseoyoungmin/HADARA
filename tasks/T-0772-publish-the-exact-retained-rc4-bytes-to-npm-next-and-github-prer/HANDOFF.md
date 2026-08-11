# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0772 |
| Title | Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow. |
| Status | Done |
| Created | 2026-08-11T19:19 |
| Updated | 2026-08-11T19:31 |

## Last Completed

| Item | Evidence |
|---|---|
| T-0772 published hadara@0.5.0-rc.4 to npm next, made GitHub v0.5.0-rc.4 a public prerelease with three retained assets, and passed public consumer recycle. | ev:T-0772:f7fbfb98a701428ca14353e1; ev:T-0772:ca025cf911e149279e893b24; ev:T-0772:e6d2757f156949888f7e4166; ev:T-0772:fdf2b2a585f3453db1fecc0b |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Run task close dry-run, review the plan hash, then execute the proof-last close transaction. | waiting-for-operator | no | Publication, asset parity, consumer recycle, and evidence replay are complete. | docs/TASK_WORKFLOW_COMMANDS.md |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Create a separate T-0773 capsule for HANDOFF currentness hardening. | actionable | yes | Keep post-publication UX cleanup separate from the release mutation capsule. | docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Only the retained T-0770 RC4 bytes are publishable. | A rebuilt or substitute tarball would weaken provenance. | Verify the artifact hash against the T-0770 handoff before approval. |
