# T-0535 Dogfood Report

## Environment

| Field | Value |
|---|---|
| Source repo | `/mnt/f/NowWorking/HADARA-dev` |
| CLI entry | `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js` |
| Dogfood project | `/tmp/hadara-t0535-dogfood-XzmP7N` |
| Profile | governed |
| Version report | `packageVersion=0.4.1`, `distLooksStale=false` |
| Purpose | Fresh-project dogfood after T-0534 dead-code removal and Docker dist-sync hardening. |

## Commands Exercised

| Area | Command / Surface | Result |
|---|---|---|
| Build | `npm run dev:docker-sync-build` | Passed Docker `npm ci`, TypeScript build, full Vitest, refreshed workspace `dist`, and built version smoke reported `distLooksStale:false`. |
| Init | `init --profile governed --json` | Passed; generated governed scaffold in `/tmp`. |
| Init health | `init doctor --json` | Passed with `ok:true` and no scaffold issues. |
| Project status | `status --summary-json` | Passed; expected `VALIDATION_BASELINE_MISSING` warning for a fresh project. |
| Task selection | `task status --summary-json` | Passed; no recommendation before a task exists. |
| Removed-command scan | `rg` over generated docs | Passed; generated docs do not instruct agents to use removed lifecycle commands. The only matches are removed-command migration notes. |
| Task create | `task create "Implement word statistics utility" --json` | Passed; created `T-0001`. |
| Session guidance | `session start --task T-0001 --json` | Passed; guidance points at `task status`, context, and finalize surfaces, not removed lifecycle commands. |
| Toy implementation | `src/word-stats.mjs`, `tests/word-stats.test.mjs` | Passed direct Node assertion test. |
| Validation wrapper | `validation run --task T-0001 --check "Word statistics tests" --update-task -- node tests/word-stats.test.mjs` | Blocked by this tool environment's `spawnSync node EPERM`; the CLI returned structured fallback guidance. |
| Validation recovery | `validation run --direct-result passed --update-task --json` | Passed; recorded `ev:T-0001:b35c98839f0c4223962bbff5` and resolved the blocked wrapper attempt. |
| Finalize | `task finalize --task T-0001 --execute --auto --json` | Passed; task reached `closed-valid` with close proof appended. |
| Post-close status | `task status --task T-0001 --summary-json` | Passed; `phase=closed-valid`, blockers `0`, warnings `0`, duration `7ms`. |
| Docs registry | `docs doctor --json` | Passed; registered documents `10`, missing `0`, unregistered active-looking documents `0`. |
| Command registry | `commands --json` | Passed; registry emits current command metadata. |
| Removed lifecycle route | `task lifecycle --task T-0001 --json` | Correctly falls through to default help/unknown behavior after public removal. |
| Lifecycle help | `help lifecycle --json` | Passed; primary path points at status/create/validation/finalize surfaces. |

## Positives

| ID | Observation | Impact |
|---|---|---|
| G-1 | Docker sync-build refreshed `dist` cleanly after T-0534 changed dist-copy semantics. | The dogfood used current development output rather than stale compiled files. |
| G-2 | Fresh governed init plus `init doctor` produced a clean scaffold. | New users do not inherit the removed-command guidance that previously leaked through init templates. |
| G-3 | `session start` and `help lifecycle` route agents to `task status`, `validation run`, and `task finalize`. | The primary lifecycle path is coherent after command-surface reduction. |
| G-4 | `validation run --direct-result` recovered cleanly from wrapper spawn EPERM and auto-resolved the blocked attempt for the same check. | T-0507's fallback path is effective for restricted tool environments. |
| G-5 | `task finalize --execute --auto` closed the toy capsule in one guarded call after docs were authored. | The low-ceremony close path works for a fresh project. |
| G-6 | Post-close `task status --summary-json` is fast and unambiguous for the selected task. | The status cockpit is practical for repeated agent use. |

## Findings

| ID | Severity | Finding | Evidence / Reproduction | Suggested Follow-up |
|---|---|---|---|---|
| F-1 | High | `task status --task T-0001 --detail full --json` still emits blocker fix hints that tell the user to run removed `hadara task finish --task ... --execute --json`. | During pre-close diagnostics, status full reported finish-related blockers with stale fix hints even though `task finish` is no longer a public route. | Replace stale fix hints with `task finalize --task T-XXXX --execute --auto --json` or `task finalize --task T-XXXX --json` depending on whether the issue is write-resolvable. |
| F-2 | Medium | `session start --task T-0001 --json` reported `docsReadMap.readFirstCount=9`, while the visible `readFirst` list contained fewer entries in the output inspected during dogfood. | Session start succeeded, but the count/list relationship looked inconsistent. | Add a focused contract test that count fields equal the emitted arrays or clarify if the count intentionally includes hidden/omitted entries. |
| F-3 | Medium | Top-level `status --summary-json` after close still recommended "Finalize T-0001" because the handoff was manually updated before final close proof. | Post-close project status had `done:1` but `nextRecommended` still carried the pre-close handoff next step. | Consider deriving stale handoff recommendations away when the referenced task is already closed-valid, or make the generated handoff wording less action-specific before finalize. |
| F-4 | Low | Fresh non-git `/tmp` project version output warns that git metadata is unavailable. | Expected for a generated project without `.git`. | No product fix required unless the warning becomes noisy in ordinary init workflows. |
| F-5 | Low | Validation wrapper spawn EPERM still occurs in this tool environment for `node`, but the direct-result fallback works. | Blocked evidence `ev:T-0001:b7ccf0773de345daacd81219`; resolved by `ev:T-0001:b35c98839f0c4223962bbff5`. | Keep direct-result guidance visible; treat the wrapper issue as environment friction unless it reproduces outside this tool sandbox. |

## Dogfood Artifact

| Artifact | Path / ID |
|---|---|
| Fresh project | `/tmp/hadara-t0535-dogfood-XzmP7N` |
| Toy task | `/tmp/hadara-t0535-dogfood-XzmP7N/tasks/T-0001-implement-word-statistics-utility` |
| Toy implementation | `/tmp/hadara-t0535-dogfood-XzmP7N/src/word-stats.mjs` |
| Toy tests | `/tmp/hadara-t0535-dogfood-XzmP7N/tests/word-stats.test.mjs` |
| Blocked wrapper evidence | `ev:T-0001:b7ccf0773de345daacd81219` |
| Passing validation evidence | `ev:T-0001:b35c98839f0c4223962bbff5` |
| Close readiness evidence | `ev:T-0001:1ffd75bbf77e4830b18ea57b` |

## Conclusion

The current development `dist` is usable in a fresh governed project after T-0534. The core lifecycle path works: init, docs doctor, task create, validation evidence, direct-result recovery, and `task finalize --execute --auto` all passed. The next UX cleanup should target the stale `task finish` fix hints in full status diagnostics, because that is the only finding that directly points agents at a removed command.
