# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0340 |
| TaskStatus | Blocked |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0339 selected stable `0.3.2` publish. | T-0339 `DECISIONS.md` D-2 |
| T-0340 started stable source/readiness preparation. | `package.json`; `README.md`; release docs |
| Stable source/readiness validation partially passed. | `ev:T-0340:f46635f835ed42389a0ce9c6`; `ev:T-0340:1dfd79eb8e5a4302a2afee7b`; `ev:T-0340:2d7fdf0a5fe1481782a90338`; `ev:T-0340:d364684c5ab6459498683f5c`; `ev:T-0340:c623c949e1d94c89bd87529c` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit or otherwise clean the release preparation worktree, then rerun release artifact for `0.3.2`, release dry-run, and publish dry-run. | `release artifact --execute` returned `RELEASE_ARTIFACT_WORKTREE_DIRTY`; release dry-run is blocked by stale T-0336 `0.3.2-rc.0` artifact evidence. | `docs/RELEASE_READINESS.md`; `scripts/release/manual-publish-rc.sh`; T-0340 evidence |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Draft capsule does not authorize publish by itself. | Accidental registry mutation would violate release policy. | Run dry-runs first and require explicit operator approval before execute publish. |
| T-0340 is blocked on clean worktree and explicit publish approval. | Release artifact and helper publish flow intentionally refuse dirty source state; npm publish still needs operator authentication/approval. | Do not bypass clean-worktree guard; after commit/clean state, rerun artifact/dry-runs before any publish execute. |
