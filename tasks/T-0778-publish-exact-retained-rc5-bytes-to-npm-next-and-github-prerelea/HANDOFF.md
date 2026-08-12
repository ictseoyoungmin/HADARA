# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0778 |
| Title | Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle |
| Status | Done |
| Created | 2026-08-11T22:17 |
| Updated | 2026-08-12T16:55 |

## Last Completed

| Item | Evidence |
|---|---|
| T-0778 capsule created and exact RC5 publication boundary defined. | T-0777 `closed-valid`; retained artifact hashes recorded in `TASK.md`. |
| Publish clone prepared and retained artifact verified. | `ev:T-0778:da43a3e5cb8b490b94891d25`; clone `/root/hadara-publish` at `295a645b`, logical artifact locator `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.5`. |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Complete proof-last close for T-0778 after reviewing the public RC5 lifecycle evidence. | waiting-for-operator | no | Publication, asset parity, and public lifecycle acceptance are complete. | `docs/RELEASE_READINESS.md`; T-0778 TASK.md; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Reconcile `docs/RELEASE_READINESS.md` with the observed RC5 npm/GitHub state and record any stable-promotion blocker. | waiting-for-operator | no | Only after public recycle and close proof are complete; stable promotion remains a separate operator decision. | `docs/RELEASE_READINESS.md`; `docs/ROADMAP.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Retained artifact is outside the git worktree. | The logical locator must resolve inside the operator container; do not substitute a regenerated tarball. | Verify all three SHA-256 values immediately before publish and attach the operator report. |
| Public lifecycle raw consumer logs are disposable. | Repository evidence must retain a sanitized structured acceptance artifact with byte-bound evidence refs. | Attach the reduced report to canonical evidence before close. |
| RC5 stable promotion remains a separate decision. | T-0778 closes the prerelease publication/recycle capsule; it does not promote npm `latest` or create a stable release. | Review stable-promotion readiness in a separate operator capsule. |
