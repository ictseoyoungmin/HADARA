# Dogfood Report

## Setup

| Item | Result | Evidence |
|---|---|---|
| Installed package | Passed with fallback | `npm install --prefix /mnt/f/NowWorking/dev/.hadara-0.4.6-rc.0-tools --no-bin-links hadara@0.4.6-rc.0`; direct dist entrypoint reported `0.4.6-rc.0`. |
| Scenario init | Passed | Fresh `basic`, `standard`, and `governed` projects initialized under `/mnt/f/NowWorking/dev`. |

## Scenario Results

| Scenario | Profile | Outcome | Notes |
|---|---|---|---|
| S1 basic notes agent | basic | Passed | Delegated Codex built a dependency-free notes/task helper and closed `T-0001` as `closed-valid`. |
| S2 standard API checker | standard | Passed with caveat | Delegated Codex built a dependency-free API health checker and closed `T-0001` as `closed-valid`; sandbox blocked socket listeners, so validation used injected in-memory transport. |
| S3 quant battle arena | governed | Blocked before T-0616 | Delegated Codex attempted multi-capsule planning. Parallel `task create` calls produced duplicate `T-0002` capsule directories and a Task Board row outside the managed block. Quant implementation was stopped to avoid compounding corrupted task identity state. |
| S3R quant battle arena retry | governed | Passed after T-0616 | Repacked the workspace candidate after the task-create serialization fix, initialized `/mnt/f/NowWorking/dev/hadara-046rc-quant-battle-arena-retry`, created four capsules concurrently without duplicate IDs, delegated Codex implementation, and closed all four capsules as `closed-valid`. |

## Findings

| ID | Severity | Area | Finding | Evidence / Example | Disposition |
|---|---|---|---|---|---|
| F-1 | Blocker | Task identity / concurrency | Parallel `task create` was not fail-closed. Multiple concurrent creates produced duplicate `T-0002` capsule directories and Task Board drift. | Quant project contains `tasks/T-0002-api-backend-frontend-dashboard`, `tasks/T-0002-agent-guide-smoke-tests-and-closeout`, and `tasks/T-0002-backtest-engine-strategy-templates`; `docs/TASK_BOARD.md` also has a `T-0002` row outside the managed block. | Fixed in T-0616 and validated by the governed quant retry. |
| F-2 | Major | Task Board managed section | A task row was appended outside `<!-- hadara:managed:start task-board -->` during the concurrent create race. | `docs/TASK_BOARD.md` in the quant project has the agent guide `T-0002` row after `<!-- hadara:managed:end task-board -->`. | Fixed in T-0616 by serializing task creation and failing closed on missing/duplicate managed sections. |
| F-3 | Major | Installed package setup | npm bin symlink creation can fail on Windows-mounted prefixes. | Initial install failed with `EPERM: operation not permitted, symlink '../hadara/dist/cli/main.js'`. | Document `--no-bin-links` fallback or make release helpers invoke the dist entrypoint when `.bin` is unavailable. |
| F-4 | Medium | Context UX | Small fresh projects still report `CONTEXT_PACK_BUDGET_TRUNCATED` for task context even when the project is tiny. | Basic/standard context pack truncated 9/10 read-first entries to 7. | Consider clearer severity or default budget for fresh projects. |
| F-5 | Medium | Validation output | `validation run --update-task` output says `taskValidationRow=updated updated`, which reads awkwardly. | Standard project evidence recording printed `[HADARA] evidence ... taskValidationRow=updated updated`. | Polish wording. |
| F-6 | Medium | Task authoring tokens | Delegated Codex naturally used non-canonical Inputs / Constraints role tokens (`requirement`, `workflow`, `task context`) and had to query schema later. | Standard project `task status --detail full` flagged invalid role tokens; Codex then ran `schema --domain ...`. | Alias common role tokens or include allowed tokens directly in close-grade diagnostics. |
| F-7 | Medium | Help discovery | Delegated Codex reported `hadara help task create` was not useful as a help route. | Standard `CODEX_DOGFOOD_RESULT.md`. | Verify help routing for command-specific help. |
| F-8 | Medium | Sandbox validation | Codex sandbox blocked both TCP and Unix socket listeners. | Standard scenario `listen EPERM` for `127.0.0.1` and `/tmp/*.sock`. | Generated docs could recommend deterministic no-socket test seams when working in restricted agents. |
| F-9 | Low | Delegated Codex output | `codex exec` repeatedly echoed large diffs, making progress monitoring noisy. | Standard/quant delegated sessions produced thousands of lines for each patch. | External tool UX; note as dogfood observation, not HADARA source issue. |
| F-10 | Medium | Exact-package dogfood | Delegated Codex used bare `hadara` for later lifecycle commands. If PATH is not explicitly pointed at the candidate package, a retry can mix the repacked candidate with a globally installed package. | Quant retry final projection showed stale `Active Task=None` note text even though the repacked source has the fixed note logic. | For future delegated dogfood, inject PATH to the candidate `.bin` or require the exact dist entrypoint in the prompt. |
| F-11 | Medium | Task authoring tokens | Delegated Codex naturally wrote `Type=None` for "no risks"; finalize rejected it because the allowed risk type tokens are `Risk`, `Follow-up`, and `Question`. | T-0001 finalize blocked with `HARNESS_TASK_RISK_KIND_INVALID_TOKEN` until the agent rewrote rows as `Follow-up`. | Consider a scaffold example for "no open risks" or an input alias that normalizes `None` to a valid no-op row pattern. |
| F-12 | Low | Restricted runtime testing | The quant dashboard/API smoke could not bind a real socket in the delegated sandbox. | Final delegated report notes that it validated through the pure dispatcher path instead of a live listener. | This is acceptable for restricted agents; generated docs may mention no-socket test seams for small HTTP tools. |

## Positive Signals

| ID | Area | Signal | Evidence / Example |
|---|---|---|---|
| P-1 | Basic profile | A normal delegated Codex agent could read generated docs, create one capsule, implement a small tool, record evidence, and finalize to `closed-valid`. | Basic `CODEX_DOGFOOD_RESULT.md`; external `T-0001` closed-valid. |
| P-2 | Standard profile | `task status --detail full` and `task finalize --execute --auto` gave enough guidance for Codex to repair task docs and close successfully. | Standard project final status `closed-valid`. |
| P-3 | Schema command | When controlled tokens blocked close, the delegated agent successfully used `hadara schema --domain ... --json` to discover allowed values. | Standard project ran schema for acceptance, plan, and risk domains. |
| P-4 | Current-state handoff | Governed init no longer says `Resume this capsule first` when Active Task is None. | Quant `docs/AGENT_HANDOFF.md`: `No active task; use next-work selection guidance.` |
| P-5 | Finalize auto | Clean capsules closed with one guarded `task finalize --execute --auto --json` call after authoring/evidence were complete. | Basic and standard external projects. |
| P-6 | Task-create serialization | After T-0616, four concurrent task-create requests produced unique task IDs and stayed inside the managed Task Board block. | Retry project created T-0001 through T-0004 without duplicate directories or out-of-block rows. |
| P-7 | Multi-capsule delegated build | A normal delegated Codex agent completed a small real quant MVP with data, SQLite, backtesting, API, frontend, tests, docs, evidence, and closed-valid capsules. | Retry project reports T-0001, T-0002, T-0003, and T-0004 closed-valid; `python3 -m unittest discover -s tests -v` passed 4 tests. |

## Reviewer Notes

The delegated agent should not be given HADARA-dev internals. It should receive normal user-level instructions after install/init and rely on generated project docs.

The first quant scenario intentionally stopped after the task-create race. Continuing implementation in a corrupted task identity state would have hidden the root issue and weakened the dogfood signal.

After T-0616 fixed task-create serialization, the quant retry used the repacked candidate package and completed end to end. The retry validates the blocker fix, while the remaining findings are UX polish rather than release-blocking task identity corruption.
