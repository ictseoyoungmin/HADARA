# T-0647 Dogfood Report

## Summary

Verdict: 050-C06 status-first dogfood passed for the current built CLI.

The public `session start` route remains unrouted, current guidance points to `hadara status --json` / `hadara task status`, and disposable `basic`, `standard`, and `governed` projects all reached the expected status-first task loop.

## Setup

| Item | Value |
|---|---|
| CLI | `dist/cli/main.js` from the current workspace build |
| Projects | `/tmp/hadara-t0647-basic`, `/tmp/hadara-t0647-standard`, `/tmp/hadara-t0647-governed` |
| Profiles | `basic`, `standard`, `governed` |
| Task title | `Cross profile smoke` |

## Public Route Currentness

| Check | Result | Notes |
|---|---|---|
| `node dist/cli/main.js session start --json` | Passed as removed route | Exit 1 with default help; no `session start` command is routed. |
| `node dist/cli/main.js help lifecycle` | Passed | Help teaches `task status` and `task finalize`, not `session start`. |
| `node scripts/context-routing-e2e-smoke.mjs --project . --cli dist/cli/main.js --task T-0647 --timeout-ms 20000` | Passed | Fast profile covered `status_ingress`, `task_status`, `context_slice_range`, and `context_slice_symbol`; no cache mutation. |

## Cross-Profile Flow

| Profile | Init | `status --json` | `task create` | `task status --task T-0001 --json` | `task finalize --task T-0001 --json` |
|---|---|---|---|---|---|
| basic | Passed | `hadara.project.status.v2`, `phase=select-work`, `health=ok` | `T-0001` created | `hadara.task.status.v2`, `phase=author-task` | Safe dry-run returned finish plan with deferred checks. |
| standard | Passed | `hadara.project.status.v2`, `phase=select-work`, `health=ok` | `T-0001` created | `hadara.task.status.v2`, `phase=author-task` | Safe dry-run returned finish plan with deferred checks. |
| governed | Passed | `hadara.project.status.v2`, `phase=select-work`, `health=ok` | `T-0001` created | `hadara.task.status.v2`, `phase=author-task` | Safe dry-run returned finish plan with deferred checks and governed handoff write path. |

## Degraded-State Checks

| Fixture | Result | Notes |
|---|---|---|
| Malformed optional context cache in standard project | Passed | `status --json` preserved canonical active-task facts and stayed `health=ok`. |
| Malformed canonical `.hadara/state/current.json` in basic project | Passed | `status --json` returned `phase=degraded`, `health=blocked`, `PROJECT_CURRENT_STATE_INVALID_JSON`, and `inspect-status-full` as primary action. |

## Findings

No stable blocker was found in this pass.

The historical internal `hadara.sessionStart.v1` adapter still exists for schema/test history, but current public guidance and smokes no longer teach it as an ingress.
