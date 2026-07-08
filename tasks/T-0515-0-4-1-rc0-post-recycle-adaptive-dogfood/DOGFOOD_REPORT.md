# T-0515 Post-Recycle Adaptive Dogfood Report

## Scope

| Field | Value |
|---|---|
| Source request | T-0507-style dogfood after T-0514 |
| Source CLI | `/mnt/f/NowWorking/HADARA-dev/dist/cli/main.js` |
| Package target | `hadara@next`, expected `0.4.1-rc.0` |
| Fresh toy project | `/tmp/hadara-t0515-toy-vv65sh` |
| Toy task | `T-0001 Implement toy calculator smoke` |
| Toy result | `closed-valid` |

## Fresh Toy Lifecycle

| Step | Result |
|---|---|
| `init --profile governed` | Passed; generated docs and registry scaffold were created. |
| Generated-doc scan | Passed; removed lifecycle commands appear only in explicit removed-command guidance, not as normal workflow commands. |
| `init doctor --json` | Passed with `ok:true` and no issues. |
| `task create` | Created `T-0001`. |
| Toy implementation | Added `src/calculator.mjs` and `tests/calculator.test.mjs`. |
| Direct command | `node tests/calculator.test.mjs` printed `calculator smoke passed`. |
| Direct-result recording | `validation run --direct-result passed --update-task` recorded `ev:T-0001:848b1140bfd945a3afb194de` and updated the existing Validation row. |
| Finalize | `task finalize --execute --auto` closed the toy task as `closed-valid`. |
| Status/state | `task status --summary-json` reported `phase: closed-valid`; `state verify --json` reported `consistent:true`, 0 errors, 0 warnings, and two expected info-only missing optional docs. |

## Package Recycle Adaptive Path

| Check | Result |
|---|---|
| Dry-run | `package recycle --package hadara@next --expected-version 0.4.1-rc.0 --json` passed and planned `command-surface` plus `task-status` steps. |
| Sandboxed execute | First live execute failed at npm registry metadata lookup after about 70s per npm command. The reduced evidence was recorded as `ev:T-0515:a327f97670c24806a29343c4`. |
| Approved network rerun | Passed in about 4s end to end and attached `ev:T-0515:d2ff92a938974a5983536eac`. |
| Adaptive flags | Passed report has `commandSurfaceExecuted:true`, `taskStatusExecuted:true`, and `taskLifecycleExecuted:false`. |
| Installed command surface | Installed `hadara@next` exposed 73 command ids. |
| Package metadata | `observedVersion=0.4.1-rc.0`, `latest=0.4.0`, `next=0.4.1-rc.0`. |

## Findings

| ID | Severity | Summary | Disposition |
|---|---|---|---|
| F-1 | Low | In sandboxed mode, npm registry lookup can take about 70s per command before failing, so package recycle appears silent for a long time. | Environment/network boundary, not a package blocker. Consider progress output or shorter registry lookup timeout in a future UX capsule. Resolved for this dogfood by approved network rerun `ev:T-0515:6a518f6681b248139ea1f343`. |
| F-2 | Low | `task finalize --execute --auto` progress lines are useful, but `task-finalize` smoke in package recycle treats exit code 6 as passed when the JSON is a dry-run report. This is correct but slightly surprising in reduced evidence. | Documented behavior; no code change required here. |

## Positives

| Area | Observation |
|---|---|
| Fresh init docs | Generated workflow docs no longer tell agents to use removed lifecycle commands as normal commands. |
| Direct-result validation | The T-0507 path remains smooth: direct command first, then `validation run --direct-result --update-task`, then finalize. |
| Auto finalize | The clean toy capsule closed in a single `task finalize --execute --auto` call with readiness and close evidence handled automatically. |
| Package recycle T-0514 behavior | The live installed-package recycle exercised the new command-surface read and selected `task status`, not the removed `task lifecycle` surface. |
| Reduced package evidence | Public package recycle evidence stayed compact and redacted while still exposing enough step metadata to diagnose the sandboxed failure and approved rerun. |

## Conclusion

T-0515 found no product blocker for `0.4.1-rc.0` after T-0514. The only friction was sandboxed network behavior during live registry lookup; an approved network rerun passed and proved the adaptive package recycle path against the published `hadara@next` package.
