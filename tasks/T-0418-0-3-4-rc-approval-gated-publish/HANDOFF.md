# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0418 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-25 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0418 scoped for approval-gated npm `next` publish of `hadara@0.3.4-rc.0`. | TASK.md |
| Registry pre-check found `hadara@0.3.4-rc.0` absent; current dist-tags are `latest=0.3.3`, `next=0.3.3-rc.0`. | npm registry pre-check |
| Ext4 release publish dry-run returned `ok:true` with expected approval/token warnings and no mutation. | release publish dry-run |
| `/root/hadara-publish` ext4 clone was recreated cleanly, `npm ci` and build passed, built CLI reports `0.3.4-rc.0`, and strict release gate passed. | `ev:T-0418:d834f79b3a96479098c96d4d` |
| Operator publish attempt failed once because `/root/hadara-publish` was stale at `d349586`; the clone has now been refreshed to `f097ad5`, rebuilt, and strict release gate passed. | `ev:T-0418:e5dcae54f6fa43309b713862` |
| After T-0419/T-0420 hotfixes, `/root/hadara-publish` was refreshed to `9f2640f`; build, full Vitest suite, and version smoke passed. | `ev:T-0418:9a2654535ebf4fc8b579af9f` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Operator publishes from `/root/hadara-publish` with `bash scripts/release/manual-publish-rc.sh T-0418 --execute`, then types exactly `publish`. | The clone is now refreshed to `9f2640f` and full-suite validation passed; npm authentication and interactive confirmation are still required. | `PUBLISH_OPERATOR_STEPS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| This capsule should not be closed as Done until npm publish and registry verification complete, unless the operator explicitly defers publish. | Publish requires external authentication and confirmation. | Keep status In Progress/Blocked until operator action is complete or explicitly deferred. |
| Earlier publish attempts used stale or pre-hotfix clones. | A stale clone can fail release-capsule checks or full-suite validation. | The clone is now refreshed to `9f2640f`; before publishing, use task `T-0418` and rerun `git status --short` plus `node dist/cli/main.js version --json` in `/root/hadara-publish` if anything changes. |
