# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0778 |
| Title | Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle |
| Status | Draft |
| Created | 2026-08-11T22:17 |
| Updated | 2026-08-11T22:17 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

## Last Completed

| Item | Evidence |
|---|---|
| T-0778 capsule created and exact RC5 publication boundary defined. | T-0777 `closed-valid`; retained artifact hashes recorded in `TASK.md`. |
| Publish clone prepared and retained artifact verified. | `ev:T-0778:da43a3e5cb8b490b94891d25`; clone `/root/hadara-publish` at `295a645b`, logical artifact locator `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.5`. |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Run the public RC5 consumer recycle and record real close execute, `closed-valid`, idempotent retry, and fresh idle status. | actionable | no | Publication and GitHub asset parity are complete; lifecycle acceptance remains. | `docs/RELEASE_READINESS.md`; T-0778 TASK.md; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Reconcile `docs/RELEASE_READINESS.md` with the observed RC5 npm/GitHub state and record any stable-promotion blocker. | pending | yes | Only after public recycle and close proof are complete. | `docs/RELEASE_READINESS.md`; `docs/ROADMAP.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Retained artifact is outside the git worktree. | The logical locator must resolve inside the operator container; do not substitute a regenerated tarball. | Verify all three SHA-256 values immediately before publish and attach the operator report. |
| Public lifecycle raw consumer logs are disposable. | Repository evidence must retain a sanitized structured acceptance artifact with byte-bound evidence refs. | Attach the reduced report to canonical evidence before close. |
| Publication is complete but public lifecycle recycle is not. | T-0778 cannot close as release-ready until installed public RC5 lifecycle evidence is attached. | Use `hadara@next` at `0.5.0-rc.5` in a disposable consumer and attach the sanitized acceptance report. |
