# T-0582 Major CLI Dogfood Report

## Summary

| Area | Result | Notes |
|---|---|---|
| Repo read models | Passed | `version --verbose`, `commands`, `help lifecycle`, `schema`, `status`, `task status`, `docs doctor`, and `release gate` returned usable JSON or completed successfully. |
| Fresh init profiles | Passed | `basic`, `standard`, and `governed` projects initialized in `/tmp`; each passed `init doctor`, `docs doctor`, and first `task status`. |
| Governed task lifecycle | Passed | A fresh governed toy task recorded validation evidence and reached `closed-valid` through `task finalize --execute --auto`. |
| Release blocker status | Clear | One real bug was found and fixed: legacy `docs/DEVELOPMENT_SLICES.md` was incorrectly treated as latest-task currentness authority when no canonical slice state exists. |

## Command Matrix

| Project | Command family | Representative checks | Result |
|---|---|---|---|
| HADARA-dev | Runtime/help/schema | `version --verbose --json`, `commands --json`, `help lifecycle --json`, `schema --domain task.acceptance.state --json` | Passed |
| HADARA-dev | Status/currentness | `status --summary-json`, `status --state-only --json`, `task status --task T-0582 --detail full --json`, `docs doctor --json` | Passed after T-0582 fix |
| HADARA-dev | Release diagnostics | `release gate --mode strict --json` | Passed; mounted workspace latency remains a known non-blocking UX issue |
| `/tmp` basic | Init/readiness | `init --profile basic`, `init doctor`, `docs doctor`, `task status` | Passed |
| `/tmp` standard | Init/readiness | `init --profile standard`, `init doctor`, `docs doctor`, `task status` | Passed |
| `/tmp` governed | Init/context/lifecycle | `init --profile governed`, `session start --task`, `context pack --task`, `context slice`, `validation run`, `task finalize --execute --auto`, `evidence list` | Passed |

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| F-1 | Blocker | `status --state-only --json` warned that `docs/DEVELOPMENT_SLICES.md` latest completed task was T-0565 while projected latest Done was T-0581. In this repo `.hadara/state/slices.json` is absent, so the Markdown file is legacy/roadmap material, not canonical current-state authority. | Fixed in T-0582: state projection only compares Development Slices latest task when canonical slice state exists. |
| F-2 | Minor | `release gate --mode strict --json` completed successfully but took over 60 seconds on the mounted workspace. | Non-blocking known latency class; ext4 publish clone remains the release path. |
| F-3 | Minor | `context pack --json` without `--task` exits with `CONTEXT_PACK_TASK_NOT_FOUND` in a fresh governed project. | Intentional guard; docs and `task status` route agents to task-scoped context pack. |
| F-4 | Minor | Fresh governed `docs doctor` warns on Product metadata placeholders after completed task history exists. | Intentional 0.4.4 policy; not a CLI bug. |
| F-5 | Minor | Toy close was smooth, but final validation row authoring still requires a deliberate TASK.md edit before the final close pass. | Existing tradeoff: close-source prose remains agent-owned and hashed. |

## Fix Validation

| Check | Result | Evidence |
|---|---|---|
| `npm run test:focused -- tests/unit/state-projection.test.ts` | Passed: 1 file / 6 tests | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| `npm run build` | Passed | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| `npm run dev:docker-sync-build` | Passed: 153 files / 1068 tests; `dist` refreshed | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| `node dist/cli/main.js status --state-only --json` | Passed; only active T-0582 Task Board drift remains before finalize | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| `node dist/cli/main.js docs doctor --json` | Passed: healthy/currentness clean | `ev:T-0582:305a0964bd6c4b6c8071713b` |

## Stable Recommendation

Proceed to stable `0.4.4` source/readiness preparation after T-0582 closes. The major CLI dogfood found no remaining release-blocking bug.
