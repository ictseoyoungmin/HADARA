# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0648 |
| Title | 0.5.0-rc.0 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-18T18:13 |
| Updated | 2026-07-18T18:22 |
## Last Completed

| Item | Evidence |
|---|---|
| Source metadata prepared | `package.json` and `package-lock.json` now target `0.5.0-rc.0`. |
| Release docs prepared | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, README release status, current-state projections, and `GITHUB_RELEASE_NOTE.md` are updated for the RC. |
| Release validation passed | Build, focused status/session workflow tests, context-routing smoke, package-smoke dry-run, and strict release gate passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0648, then run operator publish helper from a clean publish workspace. | Source readiness is prepared and closed-valid; npm/GitHub publication remains explicit operator work. | `scripts/release/manual-publish-rc.sh`, `tasks/T-0648-0-5-0-rc-0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Release mutation not performed in T-0648 | npm `next`, GitHub prerelease, and installed-package recycle are still pending. | Run `scripts/release/prepare-publish-env.sh T-0648`, then `scripts/release/manual-publish-rc.sh T-0648 --execute`; create/publish GitHub prerelease; run installed-package recycle against `hadara@next` expected `0.5.0-rc.0`. |
