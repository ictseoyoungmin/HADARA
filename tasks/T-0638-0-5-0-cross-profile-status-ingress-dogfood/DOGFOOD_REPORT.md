# T-0638 Dogfood Report

## Summary

Verdict: 0.5.0 status-first ingress is usable after one blocker fix.

Cross-profile disposable projects passed with the current built CLI. Basic, standard, and governed projects initialized, reported `hadara.project.status.v2` from `status --json`, preserved explicit v1 compatibility via `status --compat v1 --json`, selected first work through `hadara.taskSelection.status.v2`, created a task, reported selected-task `hadara.task.status.v2`, and used `context pack` as the file-routing replacement for removed public `session start`.

## Environment

| Item | Value |
|---|---|
| CLI entrypoint | `dist/cli/main.js` |
| Disposable roots | `/tmp/hadara-0638-dogfood-shell.*`, `/tmp/hadara-0638-package.*` |
| Profiles | `basic`, `standard`, `governed` |
| Package-style install | `npm pack` tarball installed into isolated `--prefix` with `--no-bin-links` |

## Passed Checks

| Scenario | Result |
|---|---|
| `basic` init/status/task/context path | Passed |
| `standard` init/status/task/context path | Passed |
| `governed` init/status/task/context path | Passed |
| `status --compat v1 --json` | Passed for all profiles |
| `commands --json` public registry | Passed; `session.start` absent |
| malformed optional local cache | Passed; status ingress stayed usable |
| malformed canonical `.hadara/state/current.json` | Passed after fix; status v2 reports `PROJECT_CURRENT_STATE_INVALID_JSON`, `health: blocked`, and routes to `status --detail full` |
| package-style local tarball entrypoint | Passed; installed entrypoint emitted status v2 and task-selection v2, with no `session.start` registry entry |

## Blocker Found And Fixed

| ID | Finding | Fix |
|---|---|---|
| B-1 | `status --json` ignored parse/validation errors from `.hadara/state/current.json`; malformed canonical state could still return `health: ok` and a create-task action. | `project-status-v2` now promotes current-state read issues into top-level issues, marks the current-state evaluation `invalid`, sets `health: blocked`, and routes to full status diagnostics before next-work actions. |

## Non-Blocking Feedback

| ID | Finding | Disposition |
|---|---|---|
| UX-1 | `hadara init --json > init.json` inside an empty target creates the output file before init inspects the directory, so init treats it as brownfield. | Recorded in `.hadara/local/feedback/T-0638-init-output-redirection-brownfield-trap.md`; not a 0.5.0 status ingress blocker. |

## Validation

| Check | Result |
|---|---|
| `npm run test:focused -- tests/unit/status-json.test.ts` | Passed, 19 tests |
| `npm run build` | Passed |
| Cross-profile shell dogfood | Passed |
| Package-style local tarball entrypoint dogfood | Passed |
| `npm run test:focused -- tests/unit/status-json.test.ts tests/unit/task-selection.test.ts tests/unit/task-workbench.test.ts tests/unit/package-recycle.test.ts` | Passed, 60 tests |
