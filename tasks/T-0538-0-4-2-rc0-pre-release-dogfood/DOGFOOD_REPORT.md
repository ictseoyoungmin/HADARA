# T-0538 0.4.2-rc.0 Pre-release Dogfood Report

## Summary

| Field | Value |
|---|---|
| Date | 2026-07-09 |
| HADARA CLI | development `dist/cli/main.js` |
| Version output | `packageVersion=0.4.1`, `distLooksStale=false` |
| Source commit | `d13a71b8d604be1a90af650714a512bc44c070ca` |
| Fresh project | `/tmp/hadara-t0538-dogfood-KwAVqu` |
| Profile | governed |
| Toy task | `T-0001 Add deterministic calculator smoke` |
| Result | Passed with non-blocking UX residuals |

## Command Matrix

| Area | Command / Check | Result | Notes |
|---|---|---|---|
| Dev dist refresh | `npm run dev:docker-sync-build -- --smoke-command "version --json"` | Passed | Docker sync-build passed full Vitest `148 files / 1002 tests`; smoke reported `distLooksStale:false`. Tar copy from mounted workspace took several minutes before tests started. |
| Init | `init --profile governed --json` | Passed | Generated expected governed scaffold with AGENTS, context, workflow, state docs, registry, and task directory. |
| Init doctor | `init doctor --json` | Passed | `ok:true`, no scaffold drift issues. |
| Generated docs scan | `rg` removed-command pattern over fresh project | Passed | Only references to removed low-level lifecycle commands were explicit "removed" guidance in workflow docs; no stale positive guidance found. |
| Status baseline | `status --summary-json` before task | Passed with expected warning | Fresh project reports degraded due missing validation baseline. |
| Task create | `task create "Add deterministic calculator smoke" --json` | Passed | Created `T-0001`. |
| Session start | `session start --task T-0001 --json` | Passed | Confirmed T-0537 parity in fresh project: `readFirstCount=7`, `readFirst.length=7`, `readFirstTotalCount=9`, drift counts `0/0`. |
| Validation wrapper | `validation run --task T-0001 --check "calculator helper smoke" -- node -e ...` | Blocked then resolved | Wrapper recorded `VALIDATION_COMMAND_PERMISSION_DENIED: spawnSync node EPERM` despite direct command passing. Direct-result recovery resolved the blocked evidence. |
| Direct validation | `node -e ...` plus `validation run --direct-result passed` | Passed | Evidence `ev:T-0001:4ae666c1165641619c6c24b8` resolved blocked evidence `ev:T-0001:c94ada75c3d2439487bfb475`. |
| Finalize | `task finalize --task T-0001 --execute --auto --json` | Passed | Closed as `closed-valid`; finalize diagnostics duration `87ms`. |
| Post-close status | `task status --task T-0001 --summary-json` | Passed | `phase=closed-valid`, blockers `0`, warnings `0`, evidence records `4`. |
| Removed routes | `task lifecycle`, `task next`, `evidence summary`, `ops status` | Passed | Each fell through to default help with exit `1`; no misleading redirect stub remained. |
| Docs doctor | `docs doctor --json` | Passed | Registry present, 10 registered docs, no missing/unregistered/required-reading issues. |
| Help/schema | `help lifecycle`, `schema --domain task.acceptance.state --json` | Passed | Current lifecycle help and controlled vocabulary output were useful and current. |
| Context pack | `context pack --task T-0001 --json` | Passed with UX residual | Useful output, but included fresh-project warnings for missing HADARA-dev source/release files. |

## Good

| Observation | Impact |
|---|---|
| Fresh init and init doctor were clean. | New governed projects start from a coherent scaffold. |
| Generated docs no longer instruct users to run removed lifecycle commands. | T-0500/T-0536 cleanup appears effective for new users. |
| `session start` count parity is fixed in a fresh project. | `readFirstCount` is now shell-friendly and no longer requires defensive parsing. |
| `finalize --execute --auto` closed a clean capsule in one call. | The ordinary lifecycle path is low-friction and still records readiness/close evidence. |
| Removed command routes now fail as ordinary unknown/default-help behavior. | Command surface reduction is visible to users and does not leave stale compatibility JSON. |
| `validation run --direct-result` recovery worked. | Environment/spawn friction did not block honest evidence recording. |

## Friction / Residuals

| ID | Severity | Finding | Release Impact | Suggested Follow-up |
|---|---|---|---|---|
| DF-1 | Medium | `context pack` in a fresh user project reported warnings about missing `src/services/capability-registry.ts` and `docs/RELEASE_READINESS.md`. | Not a functional blocker for RC, but it leaks HADARA-dev/source-checkout assumptions into consumer projects. | Gate source/release extraction by profile/source availability, or treat runtime registry metadata as sufficient in packaged/fresh projects. |
| DF-2 | Low | `status --summary-json` after closing the only task reported `tasks.counts.done=1` but `lastCompleted=[]` and kept recommending "Create or select first Task Capsule". | Not a blocker; still arguably valid when no next work exists, but it reads stale because the Task Board has a Done row. | Let status derive latest completed from Task Board/capsules when generated handoff is still initial scaffold text. |
| DF-3 | Medium | `validation run` child execution hit `spawnSync node EPERM` in this environment even though the direct Node command passed. | Not a blocker because direct-result recovery exists and worked; the same environment class was known from T-0507. | Keep direct-result recovery documented; investigate why wrapper reports permission denied after child metadata shows exitCode 0. |
| DF-4 | Low | Docker sync-build spent several minutes in mounted-workspace tar copy before tests started. | Not an RC blocker; validation still passed. | Exclude large historical task artifacts or use a lean release validation copy for repeated pre-release loops. |

## Release Recommendation

Proceed to a dedicated `0.4.2-rc.0` release-readiness capsule after documenting these residuals. The dogfood did not find a functional blocker to RC publication.

Do not treat this as stable readiness. RC should still run release artifact/package smoke, npm dry-run, GitHub release-note prep, and post-publish installed-package recycle.
