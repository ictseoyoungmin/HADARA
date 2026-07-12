# R2 External Dogfood Report

## Summary

| Field | Value |
|---|---|
| Run | v0.4.4 R2 |
| Project | `/tmp/hadara-r2-standard-dogfood-rerun3` |
| Profile | standard |
| CLI source | Local packed package installed into the project (`node_modules/.bin/hadara`) |
| Package version string | `0.4.3` candidate build from local tarball |
| Result | Passed with non-blocking findings |

R2 validated a fresh non-HADARA service project through 8 ordinary Task Capsules. The final run completed all capsules with `task finalize --execute --auto`, kept the final task in `closed-valid`, and left `.hadara/state/current.json` with no active task and no stale next-work recommendation.

## Capsule Run

| Task | Title | Final State | Validation Evidence |
|---|---|---|---|
| T-0001 | Add task listing store | finalized | `ev:T-0001:b87c00cf890646ac92c2d2f6` |
| T-0002 | Add task creation validation | finalized | `ev:T-0002:5f6d7edfd71f41189086dae5` |
| T-0003 | Add task completion workflow | finalized | `ev:T-0003:ed7b1603a52e4fe7b324264d` |
| T-0004 | Add task state filtering | finalized | `ev:T-0004:a81ec7b3ca744ce193e4615c` |
| T-0005 | Add snapshot import export | finalized | `ev:T-0005:964a9bb4f371451985d5f00b` |
| T-0006 | Add task summary read model | finalized | `ev:T-0006:9605b28d226e45728f7ad648` |
| T-0007 | Add CLI smoke script | finalized | `ev:T-0007:1ab29b0a99794bf699604ade` |
| T-0008 | Add seeded data and API docs | finalized | `ev:T-0008:e62828409d884369ba2e8cec` |

## Metrics

| Operation | Count | Average | Min | Max |
|---|---:|---:|---:|---:|
| `task create` | 8 | 102ms | 91ms | 125ms |
| `validation run` wrapper attempt | 8 | 411ms | 343ms | 551ms |
| `task finalize --execute --auto` | 8 | 208ms | 173ms | 256ms |
| Timed HADARA lifecycle operations | 24 | 5,765ms total | N/A | N/A |
| `task status --task T-0008 --detail full --json` | 1 | 44ms | 44ms | 44ms |

## Rechecked R1 Surfaces

| Surface | Result | Notes |
|---|---|---|
| `hadara --version` / `hadara -v` | Passed | Both commands returned the package version. |
| Installed-package stale diagnostic | Passed after T-0576 fix | `version --json` reported `sourceMtime: null` and `distLooksStale: false` in the external project. |
| Bootstrap next-work retirement | Passed | Final `task status --json` had zero recommendations and `.hadara/state/current.json` had `nextWork: null`. |
| Profile-optional docs | Passed | Standard profile did not require absent `docs/AGENT_HANDOFF.md` or `docs/DEVELOPMENT_SLICES.md`. |
| Done-level task status | Passed | `task status --task T-0008 --detail full --json` returned phase `closed-valid`, zero issues, and zero next actions. |
| Docs doctor metadata warning | Passed | `docs doctor` emitted `DOC_PROJECT_METADATA_PLACEHOLDER` as a warning after completed task history existed. |

## Findings

| ID | Severity | Finding | Release Impact | Follow-up |
|---|---|---|---|---|
| R2-F1 | Medium | In this host/tool environment, `validation run -- npm test` hit `VALIDATION_COMMAND_PERMISSION_DENIED` for every capsule. Direct `npm test` passed, and `validation run --direct-result passed --update-task` recovered cleanly each time. | Not blocking v0.4.4 because the fallback path is explicit and evidence residuals are resolved, but it remains recurring friction for automated dogfood. | Keep tracking host spawn EPERM separately; consider making fallback instructions shorter and easier to script. |
| R2-F2 | Low | Fresh task selection no longer injects absent profile docs, but an empty standard project still needs an operator to name the first real task. | Not blocking. This is acceptable after the previous generic command-title cleanup. | Future UX can improve first-task prompts without writing generic titles into commands. |
| R2-F3 | Low | `docs doctor` intentionally keeps Product Name/Purpose placeholders as warning-only metadata drift. | Not blocking. The warning is clear and does not block lifecycle close. | Consider an optional `project metadata set` command only if repeated external users ask for it. |

## Good UX

| Area | Observation |
|---|---|
| Lifecycle speed | `task create` and `finalize --execute --auto` were fast enough for repeated capsule work. |
| Close path | `finalize --execute --auto` closed all eight authored capsules without manual plan-hash copying. |
| Status detail | Closed task detail was compact, issue-free, and fast. |
| Evidence recovery | The blocked wrapper evidence and passed direct-result evidence were linked cleanly in each capsule. |
| Profile awareness | Standard profile avoided stale recommendations for handoff/slices files that it does not scaffold. |

## Release Decision

R2 does not reveal a new v0.4.4 release blocker. The installed-package stale diagnostic fix in T-0576 should remain in scope for v0.4.4 because the issue is visible only when the CLI is installed under a non-HADARA project root.
