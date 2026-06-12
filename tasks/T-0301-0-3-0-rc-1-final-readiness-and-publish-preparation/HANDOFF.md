# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0301 |
| Status | Done |
| Last Updated | 2026-06-12 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| rc.1 release-facing docs prepared. | README, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `GITHUB_RELEASE_NOTE.md`. |
| Manual helper hardened for rc.1 publish. | T-0297 mismatch guard, dry-run cleanup smoke, `bash -n`. |
| Full check passed in `/tmp` validation copy. | 117 files / 749 tests passed. |
| rc.1 npm publish completed. | Release artifact/package/clean-checkout evidence refreshed; npm publish completed; `npm view` verified `0.3.0-rc.1`; GitHub draft false. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open post-publish installed-package recycle for `hadara@0.3.0-rc.1`. | Registry publish is complete; next proof should install/use the published package from npm. | `docs/RELEASE_READINESS.md`, `docs/AGENT_HANDOFF.md`, T-0301 evidence. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not use T-0297 for rc.1. | Helper will reject it because T-0297 belongs to rc.0. | Use `bash scripts/release/manual-publish-rc.sh T-0301`. |
| GitHub Release draft was not requested. | npm has rc.1, but GitHub Releases will not show a draft unless requested separately. | Use `--github-draft` later only if the operator wants the optional draft. |
| Post-publish installed-package recycle is still pending. | Publish success does not by itself prove fresh install UX from npm. | Open a new capsule for registry install and migration/adoption smoke. |
