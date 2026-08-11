# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0772 |
| Title | Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow. |
| Status | Draft |
| Created | 2026-08-11T19:19 |
| Updated | 2026-08-11T19:19 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

## Last Completed

| Item | Evidence |
|---|---|
| T-0772 is the version-specific operator publication capsule for hadara@0.5.0-rc.4; T-0770 remains the exact-artifact retention source. | TASK.md; tasks/T-0770-rc4-exact-artifact-retention-and-publication-handoff/HANDOFF.md |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Run the prepared clean-clone publication helper, review npm/GitHub results, and replay the operator evidence. | waiting-for-operator | no | External publication is operator-owned and must finish before proof-last close. | docs/RELEASE_READINESS.md; docs/TASK_WORKFLOW_COMMANDS.md |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| After public recycle succeeds, create a separate capsule for closed-HANDOFF currentness hardening. | actionable | yes | Keep post-close UX cleanup separate from the release mutation capsule. | docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Only the retained T-0770 RC4 bytes are publishable. | A rebuilt or substitute tarball would weaken provenance. | Verify the artifact hash against the T-0770 handoff before approval. |
