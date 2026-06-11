# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0301 |
| Status | Done |
| Last Updated | 2026-06-11 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| rc.1 release-facing docs prepared. | README, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `GITHUB_RELEASE_NOTE.md`. |
| Manual helper hardened for rc.1 publish. | T-0297 mismatch guard, dry-run cleanup smoke, `bash -n`. |
| Full check passed in `/tmp` validation copy. | 117 files / 749 tests passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit this capsule, then publish from a fresh `/tmp/hadara-publish` clone using T-0301. | Publish is operator-only and should run from a clean committed clone. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh`, this handoff. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not use T-0297 for rc.1. | Helper will reject it because T-0297 belongs to rc.0. | Use `bash scripts/release/manual-publish-rc.sh T-0301`. |
| README still shows rc.0 as current published package before helper execution. | This is intentional until npm verifies rc.1. | After publish, verify registry metadata; then a post-publish doc capsule can flip "current published" if desired. |
| Actual npm publish was not run in this capsule. | Registry remains unchanged until the operator runs `--execute`. | Use the exact commands in `docs/RELEASE_READINESS.md` and final handoff. |
