# T-0243 Create an explicit release artifact evidence refresh capsule

## Metadata

| Field | Value |
|---|---|
| ID | T-0243 |
| Title | Create an explicit release artifact evidence refresh capsule |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Prevent misleading release artifact freshness and prepare the next clean refresh. | T-0242 exposed stale release artifact evidence; attempting refresh from the current dirty worktree would attach git metadata that does not fully describe artifact contents. |

## Scope

| In Scope | Reason |
|---|---|
| Add a release artifact dirty-worktree guard before evidence refresh. | `release artifact` evidence records `gitCommit`; with uncommitted files, that commit does not fully describe the artifact contents. |
| Run release artifact evidence refresh only when the guard makes the state trustworthy, or record the blocker if it cannot run. | The next release dry-run must not pass on false freshness. |
| Update release readiness handoff/docs with the result. | Operators need to know whether the artifact was refreshed or intentionally blocked. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publishing, GitHub Release creation, Docker image build, or installer execution. | This capsule only concerns local release artifact evidence. |
| Broad release gate performance optimization. | T-0242 made slow stages visible; this capsule handles artifact evidence trustworthiness. |
| Dashboard/TUI work. | UI work remains paused. |
| Forcing a commit or cleaning the worktree. | The current task should not rewrite or commit unrelated pending work just to satisfy release freshness. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to guarded release artifact evidence refresh. | Capsule update |
| 2026-06-04 | Done | Dirty-worktree guard prevents release artifact evidence refresh from creating false git freshness; refresh is deferred until the worktree is clean. | Docker sync-build, built CLI blocked-refresh smoke, and v2 evidence. |
