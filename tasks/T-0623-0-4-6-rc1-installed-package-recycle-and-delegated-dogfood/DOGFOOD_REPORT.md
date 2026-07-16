# T-0623 Dogfood Report

## Subject

| Field | Value |
|---|---|
| Package | `hadara@0.4.6-rc.1` |
| Installed CLI | `/mnt/f/NowWorking/dev/hadara-0.4.6-rc1-recycle/prefix/node_modules/hadara/dist/cli/main.js` |
| Dogfood root | `/mnt/f/NowWorking/dev/hadara-0.4.6-rc1-recycle` |
| Delegated project | `/mnt/f/NowWorking/dev/hadara-0.4.6-rc1-recycle/projects/quant-battle-arena` |
| Profile | `governed` |
| Delegated agent | `codex exec -m gpt-5.4-mini` |

## Installed Package Recycle

| Check | Result | Notes |
|---|---|---|
| `npm install --prefix ... hadara@next` | Failed | Windows-mounted prefix could not create the `.bin/hadara` symlink: `EPERM: operation not permitted, symlink .../hadara`. |
| `npm install --prefix ... --no-bin-links hadara@next` | Passed | Installed package without bin links. |
| Installed version | Passed | `version --verbose --json` reported `packageVersion: 0.4.6-rc.1`, `distLooksStale: false`. |

The `--no-bin-links` fallback is still required for this mounted-prefix scenario. This is not HADARA-dev-specific; any WSL/Windows-mounted npm prefix can hit it.

## Delegated Dogfood

The delegated prompt is captured in `DELEGATED_CODEX_PROMPT.md`. The maintainer agent performed install/init, then Codex received ordinary user-style instructions to follow the generated HADARA docs and build a Quant Battle Arena MVP.

### Outcome

| Area | Result |
|---|---|
| Task capsules | One capsule created: external `T-0001 Build Quant Battle Arena MVP`. |
| MVP implementation | Completed dependency-free Node MVP with deterministic data, file-backed persistence, battle engine, HTTP route resolver/server, output JSON artifacts, and strategy templates. |
| External task state | `closed-valid` according to installed `task status --task T-0001 --detail full --json`. |
| Validation | Build, local ingest, report generation, route resolver API smoke, done-level harness, and finalize auto passed. |
| Project docs | External `PROJECT_STATE.md`, `TASK_BOARD.md`, task capsule docs, and `DOGFOOD_REPORT.md` were updated. |

### External Project Deliverables

| Path | Purpose |
|---|---|
| `src/cli.js` | CLI entrypoint for build/ingest/battle/report/serve. |
| `src/data.js` | Deterministic fallback market data and local dataset loader. |
| `src/engine.js` | Toy strategy evaluation and leaderboard generation. |
| `src/store.js` | File-backed state and output paths. |
| `src/server.js` | HTTP server and route resolver. |
| `data/custom-market.json` | Local ingest fixture. |
| `outputs/*.json` | Visualization-ready artifacts. |
| `strategies/templates/strategy_template.py` | Agent-friendly Python strategy template. |
| `strategies/templates/strategy_template.md` | Strategy design template. |

## Findings

| ID | Severity | Finding | Evidence / Context | Suggested Follow-up |
|---|---|---|---|---|
| F-1 | Medium | Installed package on Windows-mounted prefix still needs `--no-bin-links`, which means generated `hadara ...` command strings are not directly executable. | Initial install failed with symlink `EPERM`; delegated prompt had to supply the absolute `node .../dist/cli/main.js` entrypoint. | Document first-user fallback clearly and consider a helper/wrapper recommendation for no-bin-links installs. |
| F-2 | Medium | `task status --json` and other read models still emit `hadara ...` command strings even when the only valid invocation is an explicit node entrypoint. | External `task status` recommended `hadara task create ...`; delegated agent used the node entrypoint because the prompt warned it. | Consider command-prefix/entrypoint configuration or a `hadara command env` projection for no-bin-links/local-entrypoint workflows. |
| F-3 | Medium | Governed minimal init conflicts with profile diagnostics: close-valid task still reports missing `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/SECURITY_MODEL.md`, and AGENTS required-reading drift. | Installed `task status --task T-0001 --detail full --json` ended `closed-valid` but retained five profile warnings. | Align profile diagnostics with 0.4.6 minimal-init + optional `docs add` policy; missing optional docs should not appear as governed required-doc warnings unless explicitly added/required. |
| F-4 | Low | `context pack --json` before a task exists fails as designed, but a fresh agent naturally tries it during startup. | Delegated Codex called `context pack --json` and got `CONTEXT_PACK_TASK_NOT_FOUND` with a useful fixHint. | Current behavior is acceptable, but first-session docs/read models could route more strongly: `task status` first, `context pack --task` after task creation. |
| F-5 | Low | The delegated agent hand-edited `TASK.md` status and `TASK_BOARD.md` during repair before finalize, then finalize made the state close-valid. | Intermediate status showed `TASK.md Done` while Task Board was still Draft. | Generated docs should be more explicit that lifecycle status cells are CLI-owned and should be finalized rather than hand-edited except during deliberate repair. |
| F-6 | Low | Real socket-bound server smoke was blocked by the Codex sandbox, so route resolver smoke was used. | External report records the route-resolver validation and sandbox caveat. | Not a HADARA blocker; package recycle can include an optional host-level socket smoke when environment permits. |

## Positive Signals

| Area | Observation |
|---|---|
| Init/adoption | Brownfield dry-run and plan-hash execute behaved clearly when `package.json` existed before init. |
| Task lifecycle | `task create`, `task status`, `context pack --task`, `validation run --update-task`, and `task finalize --execute --auto` were sufficient for an independent agent to finish the project. |
| Evidence | Evidence append and validation attempt resolution worked; the later passed HTTP API smoke resolved the earlier failed/blocked socket attempt. |
| Current-state projection | Final external `PROJECT_STATE.md` and `AGENT_HANDOFF.md` correctly showed active task `None`, latest completed `T-0001`, and a trusted validation baseline. |
| Minimal docs | The agent updated generated docs without needing broad optional docs for this one-capsule MVP. |

## Conclusion

`hadara@0.4.6-rc.1` passed installed-package recycle and delegated Codex dogfood for a fresh governed project. The main remaining release-quality issue is not core lifecycle correctness; it is profile-policy drift around optional governed docs and command strings that assume a `hadara` binary even in no-bin-links installs.
