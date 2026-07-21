# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0667 |
| Title | 0.5.0-rc.1 release-readiness recycle |
| Status | Done |
| Created | 2026-07-21T19:57 |
| Updated | 2026-07-21T20:30 |
## Last Completed

| Item | Evidence |
|---|---|
| Fresh Docker environment | `node:22-bookworm` was freshly pulled at digest `sha256:5647be709086c696ff32edaaf1c70cd26d1da6ab2b39c32f3c7b4c4a31957e37`; new `hadara-dev` container `d031e781b9af` ran Node `v22.23.1` / npm `10.9.8`. |
| Release readiness recycle | Package smoke, clean-checkout smoke, release artifact, strict release gate, release dry-run, and publish dry-run passed for `0.5.0-rc.1`; summary evidence `ev:T-0667:17932d8a4a684db18a62dbe8`. |
| Registry observation | `npm view hadara dist-tags version --json` still reports `next=0.5.0-rc.0`, `latest=0.4.6`, `version=0.4.6`; no publish mutation was executed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| No follow-up task is queued from this recycle capsule. | T-0667 release-readiness recycle is green; publish/deploy remains a separate explicit operator-approved mutation requiring npm/GitHub auth. | `docs/RELEASE_READINESS.md`; `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Package smoke installed core smoke is slow in this repository. | Default 120s timeout failed twice; 300s passed with installed core smoke at about 92s. | Use `--timeout 300` for HADARA-dev rc package smoke until the installed smoke path is optimized or decoupled from the large project root. |
| Release artifact requires a clean git worktree. | `/workspace` had untracked `.claude/` state, so direct artifact attempts failed dirty-worktree preflight. | Use a clean ext4 clone for release artifact generation; T-0667 passed from `/root/hadara-rc1-src`. |
| Publish is still not done. | npm `next` remains `0.5.0-rc.0`; GitHub `v0.5.0-rc.1` remains pending. | Run the approval-gated publish flow only after operator confirmation and token/auth setup. |
