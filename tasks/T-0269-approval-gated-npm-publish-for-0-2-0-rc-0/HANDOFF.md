# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0269 |
| Status | Draft |
| Last Updated | 2026-06-05 |

## Last Completed

| Item | Evidence |
|---|---|
| Created T-0269 publish-prep capsule. | `task create --from release-read-model` returned T-0269. |
| Confirmed pre-capsule HEAD/worktree was clean. | `git status --short` returned no output before T-0269 creation. |
| Re-ran release dry-run. | `release dry-run` returned `ok:true`, readiness ready, blockers 0, warnings 0. |
| Re-ran release publish dry-run. | `release publish --mode dry-run` returned `ok:true`; token absence warnings only; all mutation flags false. |
| Updated README for `0.2.0-rc.0` publish state. | README now includes top image, install/npx guidance, release discipline, and current boundaries. |
| Polished README release wording. | Added compact top package/runtime metadata, changed install wording to current RC, moved previous RC into a short note, clarified release artifact non-publish boundaries, and documented optional Phase 6 actor/run metadata. |
| Hardened the manual npm publish helper. | `manual-publish-rc.sh` now requires an explicit task id, checks for a clean worktree, uses T-0269 examples, passes approval metadata to publish dry-run gates, and records evidence after post-publish `npm view` verification. |
| Fixed reviewer-provided focused regressions. | README init-profile command/comment and optional/deferred integration heading were restored; dashboard cache TTLs were widened; Docker focused tests passed `init.test.ts` and `dashboard-static.test.ts`. |
| Fixed slow-container dashboard cache test flake. | In `hadara-rc-dryrun`, the test source was current, but the cache hit assertion was still placed after slow later read-model calls; moving hit/bypass checks next to the first bootstrap miss made `dashboard-static.test.ts` pass. |
| Fixed dashboard cache self-expiry for slow report creation. | Cache miss/stale writes now compute `generatedAt` and `expiresAt` after report creation completes, so a slow first bootstrap report is still hittable immediately afterward. |
| Clarified task lifecycle docs. | README, TASK_WORKFLOW_COMMANDS, and IMPLEMENTATION_SOP now include the `task create` branch and place `task complete` as optional post-ready workflow compression rather than an early mandatory step. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Review README and publish blockers before any execute request. | README changes require fresh package/release artifact evidence before actual publish. | `README.md`, `docs/RELEASE_READINESS.md`, T-0269 evidence. |
| Provide explicit approval and token setup only if real publish should proceed. | `NPM_TOKEN` is missing and no publish execute approval has been given. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `NPM_TOKEN` is missing. | npm publish cannot proceed. | Set token outside repository; verify presence without printing token value. |
| GitHub Release token is missing. | GitHub Release draft path cannot proceed. | Keep GitHub Release deferred or configure token outside repository. |
| README changed after T-0268 release artifact evidence. | Actual package contents would differ from release artifact evidence. | Commit README/asset changes and refresh package/release evidence before publish. |
| `release publish --mode execute` is currently non-mutating. | It will not itself run `npm publish`. | Treat it as a gate/audit report; use the manual publish script only after explicit approval. |
| Manual publish helper now refuses dirty worktrees. | Current T-0269 README/docs edits are intentionally uncommitted. | Commit the publish source state and refresh evidence before running the helper. |
