# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0297 |
| Status | Draft |
| Last Updated | 2026-06-11 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0297 created for prepublish cleanup and final readiness. | `tasks/T-0297-0-3-0-rc-0-prepublish-cleanup-and-final-readiness/` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Complete README/test/docs cleanup, then run final readiness checks. | The npm package page must not instruct users to install the prior RC before `0.3.0-rc.0` publish. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Publish remains operator-only. | This task must not run real `npm publish` or create external releases. | Stop at release dry-run and publish dry-run; provide manual instructions. |
