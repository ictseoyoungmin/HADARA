# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-0339 decision, release readiness, release notes, and publish helper docs. | Done | Session read; T-0339 D-2; `docs/RELEASE_READINESS.md`; `docs/RELEASE_NOTES.md`; `scripts/release/manual-publish-rc.sh`. |
| 2 | Prepare stable `0.3.2` source/readiness updates if required. | Done | `package.json`; `package-lock.json`; `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md`. |
| 3 | Run release validation and publish dry-run. | Blocked | Docker check passed `ev:T-0340:f46635f835ed42389a0ce9c6`; package smoke and clean-checkout smoke passed after environment retries; npm registry pre-publish check passed `ev:T-0340:c623c949e1d94c89bd87529c`; strict gate passed `ev:T-0340:d364684c5ab6459498683f5c`; release dry-run/publish dry-run blocked until fresh 0.3.2 release artifact evidence can be generated from a clean git worktree. |
| 4 | Execute approval-gated npm publish only with explicit operator approval/authentication. | Pending | Blocked until Step 3 passes and operator provides explicit approval/authentication. |
| 5 | Verify registry visibility/dist-tags and attach evidence. | Pending | Requires publish execute. |
| 6 | Update shared state docs and handoff. | In Progress | Shared docs updated to reflect blocked T-0340 state. |
