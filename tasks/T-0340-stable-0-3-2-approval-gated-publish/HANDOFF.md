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
| Stable source/readiness validation and dry-runs passed. | `ev:T-0340:f46635f835ed42389a0ce9c6`; `ev:T-0340:1dfd79eb8e5a4302a2afee7b`; `ev:T-0340:2d7fdf0a5fe1481782a90338`; `ev:T-0340:d364684c5ab6459498683f5c`; `ev:T-0340:c623c949e1d94c89bd87529c`; `ev:T-0340:06a838ce79be45d4978a2dfd` |
| Capsule-local stable release note added. | `tasks/T-0340-stable-0-3-2-approval-gated-publish/RELEASE_NOTE.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Obtain explicit operator approval/authentication, then run the approval-gated helper execute path if publishing now. | Release artifact, release dry-run, release publish dry-run, and npm tarball dry-run passed after commit `14c840f`; actual npm publish remains blocked on approval/token. | `scripts/release/manual-publish-rc.sh`; `tasks/T-0340-stable-0-3-2-approval-gated-publish/RELEASE_NOTE.md`; T-0340 evidence `ev:T-0340:06a838ce79be45d4978a2dfd` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Draft capsule does not authorize publish by itself. | Accidental registry mutation would violate release policy. | Run dry-runs first and require explicit operator approval before execute publish. |
| T-0340 is blocked on explicit publish approval/authentication. | npm publish still needs operator authentication/approval, and `NPM_TOKEN` was absent in publish dry-run. | Do not run `--execute` publish until the operator explicitly approves and authenticates. |
