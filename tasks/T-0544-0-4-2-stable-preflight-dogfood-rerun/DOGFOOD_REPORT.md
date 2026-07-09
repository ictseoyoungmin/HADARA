# T-0544 Dogfood Report

## Summary

| Area | Result | Notes |
|---|---|---|
| Runtime | Passed | Built CLI `node dist/cli/main.js version --json` reported `packageVersion=0.4.2-rc.0` and `distLooksStale=false` at commit `0828c9fd` before the rerun; after the profile-aware fixes Docker build also reported `distLooksStale=false`. |
| Init profiles | Passed | Fresh `/tmp/hadara-t0544-dogfood/{basic,standard,governed}` projects initialized with `ok:true`. |
| First-task guidance | Improved | Empty projects now recommend `hadara task create 'Create first Task Capsule'` with `taskId:TBD`, no issues, and no duplicate task creation. |
| Context pack source leakage | Fixed | The T-0542/T-0543 source-checkout leaks for `src/services/capability-registry.ts` and `docs/RELEASE_READINESS.md` did not recur. |
| Context slice EOF clamp | Fixed | `context slice --from 1 --to 80` on short `PROJECT_STATE.md` files returned `CONTEXT_SLICE_RANGE_CLAMPED` with `summary.truncated:false` across all profiles. |
| Handoff matching | Fixed | Governed handoff step `Build workflow summary panels` bound to existing open `T-0002 Build workflow summary panel`; `createCommand:null`. |
| Governed toy lifecycle | Passed | `T-0001 Build governed toy workflow` created `src/workflow.json`, recorded validation evidence, blocked once on placeholder HANDOFF without writes, then closed with `task finalize --execute --auto` as `closed-valid`. |

## Finding Matrix

| Prior Finding | Rerun Result | Evidence / Observation |
|---|---|---|
| T-0542 P-1: consumer `context pack` leaked HADARA-dev source/release warnings. | Fixed for source-checkout files; an additional profile-optional handoff warning was found and fixed in this capsule. | Before T-0544 fix, basic/standard `context pack` had `STATE_UNKNOWN` for missing `docs/AGENT_HANDOFF.md`; after fix, state projection is `consistent` with `issues:[]`. |
| T-0542 P-2: empty project `task status --json` lacked a useful next action. | Fixed. | All profiles returned one recommendation and one next action for first task creation. |
| T-0542 P-3: handoff recommendation title could cause duplicate task creation. | Fixed. | Similar open Task Board row reused: recommended `T-0002`, `sourceKind:handoff`, `createCommand:null`. |
| T-0542 P-5: EOF clamp marked output as truncated. | Fixed. | All profiles returned `summary.truncated:false` when range end was clamped to file length. |
| Lifecycle recovery after blocked auto finalize. | Good. | Placeholder `HANDOFF.md` blocker was explicit (`HARNESS_HANDOFF_PLACEHOLDER`) and `finalize --execute --auto` rerun succeeded after the document was repaired. |

## New Issues Found And Resolved

| ID | Severity | Status | Summary |
|---|---|---|---|
| DF-1 | Medium | Fixed in T-0544 | `extractAgentHandoff` treated missing `docs/AGENT_HANDOFF.md` as a warning even for `basic` and `standard`, where the scaffold intentionally does not generate it. The extractor now reads `.hadara/scaffold.json` and suppresses the warning for profiles that do not expect handoff. |
| DF-2 | Low | Fixed in T-0544 | Task-selection recommendations used a static required-reading list that included profile-absent docs such as `docs/AGENT_HANDOFF.md` and `docs/DEVELOPMENT_SLICES.md`. Recommendations now list only docs that actually exist in the project. |

## Remaining Notes

| Type | Note |
|---|---|
| Non-blocking | `context pack` can still report `CONTEXT_PACK_BUDGET_TRUNCATED` when read-first docs exceed the bounded default. This is expected bounded-context behavior, not a release blocker. |
| Non-blocking | `task status --json` still includes `loop.deprecatedCommands` explaining that `task lifecycle` was removed. This is informational and not a recommended command path. |
| Follow-up | After stable `0.4.2` is published, run installed-package recycle/dogfood again from npm to prove these source-built fixes are present in the package. |
