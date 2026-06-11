# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and release readiness state. | Done | AGENTS.md plus tracked state/release docs reviewed. |
| 2 | Harden manual publish helper for rc.1 capsule/version matching and dry-run cleanup. | Done | `scripts/release/manual-publish-rc.sh`; guard and cleanup evidence. |
| 3 | Update release-facing README/readiness/release notes. | Done | README, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, task GitHub release note draft. |
| 4 | Run validation and script guard smokes without npm publish mutation. | Done | `bash -n`, T-0297 guard smoke, dry-run cleanup smoke, `/tmp` `npm run check`. |
| 5 | Prepare capsule for close and commit the final readiness state. | Done | `task ready --level done` passed; close/audit run after close-source docs freeze. |
