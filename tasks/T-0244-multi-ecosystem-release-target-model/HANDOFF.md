# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0244 |
| Status | Done |
| Last Updated | 2026-06-04 |

## Last Completed

| Item | Evidence |
|---|---|
| Release dry-run descriptor model implemented and validated. | Docker check/sync-build passed; built release dry-run emitted npm/GitHub/Docker descriptors. |
| Package smoke reports now carry npm provider metadata. | Built package smoke dry-run emitted provider `npm-package-smoke`. |
| Operator docs updated to state npm-primary support and Python preview-only detection. | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create or continue the release artifact evidence refresh capsule after T-0244 changes are committed/clean. | T-0244 did not refresh artifact evidence; release dry-run remains blocked by stale release artifact evidence. | `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Python target detection is preview-only. | Do not advertise Python release support or PyPI readiness. | Add future provider capsules before any Python build/smoke/publish behavior. |
| Release artifact evidence remains stale from before T-0243. | Release dry-run may still fail release-artifact freshness after this capsule. | Run a separate clean-worktree artifact evidence refresh capsule next. |
| Historical `package-smoke` evidence category remains unchanged. | Operators may see both `package-smoke` and `npm-package-smoke` terms. | Treat `package-smoke` as the evidence category and `npm-package-smoke` as provider profile metadata. |
