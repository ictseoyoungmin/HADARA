# Context Pack Freshness Diagnostic

## Summary

The current context-pack stack works well for bounded `session start`, but the live full graph path is stale, slow, and too broad for ordinary agent startup on this repository.

`session start --task T-0548 --json` returned a bounded no-live envelope in about 7.5s and preserved useful read-map counts. In contrast, live `context pack --task T-0548 --json` and `context graph --json` each took about 52s, while no-task `context pack --json` took about 99s before failing with `CONTEXT_PACK_TASK_NOT_FOUND`.

## Commands Run

| Command | Observed Result | Diagnostic Value |
|---|---|---|
| `node dist/cli/main.js task status --json` | Selected backlog work and recommended creating this diagnostic capsule. | Confirms status-first work selection remains healthy. |
| `node dist/cli/main.js context pack --json` | Exited 6 after broad degraded scan, then reported `CONTEXT_PACK_TASK_NOT_FOUND`. | Reproduces slow fail path when no task is selected. |
| `node dist/cli/main.js context pack --task T-0548 --json` | Exited 0, but degraded with stale extractor shards, budget truncation, and no code index. | Shows current live task pack quality. |
| `node dist/cli/main.js context graph --json` | Exited 0, degraded, large output, historical evidence warnings, zero code graph nodes. | Shows current graph/cache/index freshness. |
| `node dist/cli/main.js session start --task T-0548 --json` | Exited 0 with bounded no-live context-pack envelope and read-map counts. | Positive baseline for the default agent entry path. |
| `node dist/cli/main.js task status --task T-0548 --json` | Fast selected-task cockpit. | Positive baseline for task-loop guidance. |

## Findings

| ID | Priority | Finding | Impact | Recommended Fix |
|---|---|---|---|---|
| CP-1 | P0 | No-task `context pack --json` performs a broad live scan before failing with `CONTEXT_PACK_TASK_NOT_FOUND`. | Agent startup can spend about 99s only to learn it needs a task. | Fail fast before graph extraction, or return the same task-selection guidance as `task status --json`. |
| CP-2 | P0 | Live `context pack --task` and `context graph` are too slow and broad for normal startup. | About 52s per call on this mounted workspace, with a very large graph payload. | Keep bounded `session start` as default; make live pack explicitly heavy or add a compact/freshness-first mode. |
| CP-3 | P1 | Context cache is effectively unused: extractor shards are stale, `sourceManifestFastPath` misses, and source fingerprinting is unavailable. | The system redoes broad extraction and reports degraded state instead of refreshing or using cache. | Add a cache freshness/remediation path with clear `context cache warm` or automatic shard refresh semantics. |
| CP-4 | P1 | Code graph is absent from context graph: `SourceFile`, `TestFile`, `FixtureFile`, `ConfigFile`, and `Symbol` counts are zero. | Context pack is mostly docs/tasks/evidence and cannot route code-change work well. | Restore code-index integration or explicitly separate doc-pack from code-pack behavior. |
| CP-5 | P1 | Historical missing `evidence.jsonl` files for early tasks degrade current context graph. | Old bootstrap-era capsules pollute current-task diagnostics. | Downgrade historical missing evidence to informational, or scope graph warnings to current/read-first tasks by default. |
| CP-6 | P1 | `docs/AGENT_HANDOFF.md` prose is over-extracted into 72 known-problem nodes, including historical/resolved notes. | Current context pack carries stale problems such as old command-surface notes. | Require explicit current-known-problem sections or markers; treat historical index prose as history, not active problems. |
| CP-7 | P1 | State projection reports `releaseState:"blocked"` after stable `0.4.2` npm/GitHub/recycle completion. | Release status in context pack contradicts current handoff/project state. | Split current release-line state from deferred future release capability blockers in release-readiness projections. |
| CP-8 | P2 | Task-scoped pack routes stale or overly broad active specs, including old context-routing and 0.4.1 rc0 docs. | Agents may read outdated design docs for 0.4.2-era maintenance work. | Clean docs-registry lifecycle for completed specs and tighten active-task matching. |
| CP-9 | P2 | Budget truncation is reported, but omitted high-priority docs are not easy to inspect from the compact path. | Agents know truncation happened but not which important reads were dropped. | Add compact omitted-doc counts and top omitted read-first paths. |

## Positive Signals

| Area | Observation |
|---|---|
| Bounded session path | `session start --task` avoids the full live scan and returns useful read-map counts quickly enough to be the normal agent entry point. |
| Task loop | `task status --task` remains fast and gives the right authoring phase for the newly created diagnostic capsule. |
| Read-map count parity | The T-0537 count fix is visible: preview counts and total counts are separate. |
| Profile-aware missing docs | The T-0544 profile-aware optional-doc fix does not regress in this HADARA-dev diagnostic path. |

## Recommended Follow-up Capsules

| Order | Capsule | Scope |
|---:|---|---|
| 1 | Context pack fail-fast and compact default | Make no-task pack return immediate task-selection guidance or fail before extraction; document live/full mode cost. |
| 2 | Context graph freshness and cache remediation | Fix stale extractor shard handling, source manifest fingerprinting, and cache refresh guidance. |
| 3 | Current-state extraction cleanup | Stop historical handoff prose and old evidence files from degrading current context; fix stale release-state projection. |
| 4 | Code index integration decision | Either restore code graph nodes to context graph/pack or rename/scope the current pack as docs/task routing. |
| 5 | Docs registry lifecycle cleanup | Move completed context-routing/state-first specs out of active routing and tighten task-keyword matching. |

## Release Relevance

This is not a stable `0.4.2` release blocker because the published package/recycle line is already complete and the default bounded session path is usable. It is a strong 0.4.3 or 0.5 context-system hardening candidate because it affects agent startup latency, routing freshness, and trust in current-state diagnostics.
