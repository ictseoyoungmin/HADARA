# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0275 |
| Status | Draft |
| Last Updated | 2026-06-06 |

## Last Completed

| Item | Evidence |
|---|---|
| Created T-0275 publish-readiness capsule. | `hadara task create --from release-read-model` returned T-0275. |
| Started rc.1 metadata alignment. | Package/docs/script edits in progress. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Complete Docker validation and T-0275 release evidence refresh. | Needed before the operator can safely run the manual publish helper after npm login. | `docs/TEST_STRATEGY.md`, `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| This capsule must not run npm publish. | Publish is operator-only. | Stop at dry-run/evidence readiness and hand off exact commands. |
