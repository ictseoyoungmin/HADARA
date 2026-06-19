# C6 Speed-First Graph Build and Warm Path Spec

## Status

Active C6 performance design specification.

This document extends:

- `05_Indexing_Cache_Invalidation_and_Performance_Spec.md`
- `07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`

Use this document when implementing the next C6 capsules after T-0368, especially code-index shard persistence, context-pack warm paths, graph-core shard reuse, and any cold-build optimization. The central requirement is speed: context routing that is slow in routine use is not operationally useful.

## Goal

Make HADARA context graph, code index, context pack, and future session-start reads fast enough that an agent can call them by default instead of manually reading broad files.

The target user experience:

1. A fresh project can produce a useful partial graph quickly, even if full extraction continues to be expensive.
2. A warmed project can answer graph/pack/index reads from local shards with minimal filesystem work.
3. A changed project recomputes only affected source subsets.
4. Every slow, partial, stale, or skipped path is explicit in JSON output.

## Non-Negotiables

| Rule | Requirement |
|---|---|
| Cache is not truth | Canonical state remains project files, docs, task capsules, source, and evidence. Cache is rebuildable. |
| Read commands do not write | `context graph`, `context pack`, `context slice`, and future `session start` may read cache but must not update cache files. |
| Writes are explicit | Cache writes happen only through `context cache warm --execute` or another accepted execute-mode command. |
| One discovery result | A command invocation must not independently walk the repository for graph, code index, and context pack. |
| Source-addressed output | Graph/pack/slice outputs must keep project-relative paths and line ranges when available. |
| Degraded beats hanging | If budgets are exceeded, return bounded partial output with issues instead of blocking indefinitely. |

## Graphify Reference

The referenced `safishamsi/graphify` project builds a queryable graph from project artifacts, emits `graph.html`, `GRAPH_REPORT.md`, and `graph.json`, supports update-style changed-file extraction, uses local tree-sitter extraction for code, keeps a portable manifest, and encourages assistants to query the graph before grepping broad files.

HADARA should absorb the fast graph workflow ideas, not the generated-graph-as-memory authority model.

| Graphify Idea | HADARA Adaptation |
|---|---|
| Build a graph once and query it repeatedly | Warm local shards under `.hadara/local/cache/context/` and route C3/C5 reads through them. |
| Re-extract changed files only | Use source manifest fingerprints, extractor versions, and subset hashes to identify stale shards. |
| Portable manifest | Persist project-relative source keys and stable fingerprints only. |
| Local code extraction | Keep C2 deterministic/offline; add parser-backed extraction only behind changed-file gates. |
| Assistant query-first workflow | Make `context pack` and future session start prefer graph/cache summaries over broad raw reads. |
| Optional hooks | Defer hooks until explicit warm/status behavior is stable and evidence-friendly. |

| Graphify Behavior | Not Adopted for C6 |
|---|---|
| Committing generated graph directories as team bootstrap state | HADARA cache is optional, ignored, local, and rebuildable. |
| Model-assisted extraction for broad docs/media | C6 must remain deterministic, local, and fast. |
| HTML/wiki/report generation | Not required for context-routing hot paths. |
| Generated graph as authoritative memory | HADARA graph/cache are projections over canonical project state. |
| Automatic write hooks by default | HADARA write surfaces require explicit execute-mode evidence. |

## Performance Targets

Targets apply to this repository profile and similar medium projects. Large mounted filesystems may degrade, but must still produce explicit partial output.

| Operation | Cold Target | Warm Target | Degraded Ceiling |
|---|---:|---:|---:|
| `context graph --json` without code | <= 1.5 s | <= 150 ms | <= 4 s partial |
| `context graph --include-code --json` | <= 5 s | <= 300 ms | <= 10 s partial |
| `context pack --task T-XXXX --json` | <= graph/index dependency | <= 200 ms | <= 750 ms partial |
| `context cache status --json` | <= 1 s | <= 250 ms | <= 2 s with stale/unknown state |
| `context cache warm --json` dry-run | <= 2 s for plan | <= 500 ms no-op | <= 5 s partial plan |
| `context cache warm --execute --json` | bounded by stale shards | <= 1 s no-op | explicit incomplete warm |

The warm targets are product requirements. If they are not met, the implementation must either optimize further or report measured cache miss/stale/degraded state so the caller knows why the slow path happened.

## Observed Baseline

T-0373 measured the built CLI against both the current `/mnt/f` mounted workspace and an ext4 `/tmp` copy. Full results are recorded in `docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md`.

| Workload | Mounted `/mnt/f` | ext4 `/tmp` | Mounted / ext4 |
|---|---:|---:|---:|
| `context cache status --json` | 14.1 s | 1.7 s | 8.4x |
| `context cache warm --json` dry-run | 14.0 s | 1.6 s | 8.6x |
| `context graph --json` | 44.7 s | 2.2 s | 20.6x |
| `context graph --include-code --json` | 65.0 s | 2.9 s | 22.7x |
| `context pack --task T-0373 --json` | 53.6 s | 2.2 s | 24.7x |

The ext4 numbers are close enough to keep cold graph work usable while still above the cold targets for several commands. The mounted numbers are operationally unacceptable for session-start consumption. C5 must not call live graph/pack paths on mounted workspaces unless a bounded degraded mode or warm shard hit is already proven.

Immediate implementation priority from this measurement:

1. Add mounted-safe fast freshness proofs that avoid full manifest rebuilds for status/warm dry-runs.
2. Persist and consume graph-core/task/docs/command/current-state shards before expanding code-index scope.
3. Make `context pack` consume graph-core/pack-index shards instead of rebuilding the live graph.
4. Keep code-index shard persistence as the next code-aware speed step, but do not let it delay non-code graph/pack warm paths.

## Cold First Graph Strategy

Cold graph creation cannot be free, but it can avoid waste.

### Ordered Work

1. Read compact current-state files:
   - `.hadara/context/HADARA_CONTEXT.md`
   - `docs/PROJECT_STATE.md`
   - `docs/AGENT_HANDOFF.md`
   - `docs/TASK_BOARD.md`
2. If a task is requested, read only that active task capsule first.
3. Read docs registry and command registry sources.
4. Build one metadata-first source manifest.
5. Partition sources by extractor key and priority.
6. Run high-value non-code extractors first.
7. Run code-index extraction in a bounded lane.
8. Merge available shards once.
9. Return partial output if time/file/byte budgets are hit.

### Priority Lanes

| Lane | Sources | Target |
|---|---|---|
| P0 current-state | current-state docs, task board, active capsule | Always attempt before broad scans. |
| P1 routing | docs registry, command registry, implementation docs linked by active task | Needed for agent read routing. |
| P2 task graph | active task, direct prerequisites, current board row | Avoid reading all historical capsules. |
| P3 code summary | source/test files selected by manifest and budget | Needed only for `--include-code` or code-aware pack. |
| P4 historical context | old capsules, old evidence, release history | Load only when requested or budget permits. |

### Cold Build Requirements

- Use `git ls-files --cached --others --exclude-standard -z` in git worktrees before filesystem fallback.
- Apply `.gitignore`, `.hadara/local`, generated output, dependency, and cache exclusions before stat/read.
- Stat files before reading content; skip over-budget files early.
- Never let code extraction delay P0/P1 graph output beyond the cold target.
- Run independent extractors with bounded concurrency.
- Store extractor source dependency declarations so the next warm path can invalidate by subset.
- Emit `SOURCE_MANIFEST_PARTIAL`, `CONTEXT_GRAPH_TIMEOUT`, or `CONTEXT_GRAPH_BUDGET_EXCEEDED` when caps are reached.

## Warm Path Strategy

Warm reads should do the least possible work.

### Header-First Cache Read

Each shard must have a small envelope that can be parsed before the full payload:

```ts
export interface ContextCacheShardHeader {
  schemaVersion: 'hadara.context.cacheRecord.v1';
  cacheKey: string;
  projection: string;
  projectionSchemaVersion: string;
  createdAt: string;
  manifestHash: string;
  sourceSubsetHash: string;
  extractorVersions: Record<string, string>;
  payloadBytes: number;
  degraded: boolean;
}
```

Warm graph flow:

1. Read cached source-manifest header/fingerprint.
2. Prove freshness through git worktree fingerprint when possible.
3. If the fingerprint is clean and extractor versions match, avoid full manifest rebuild.
4. Read only shard headers needed by the requested projection.
5. Parse payloads only for fresh required shards.
6. Merge compact projections once.
7. Report `cache.mode:"hit"` or `cache.mode:"partial-hit"`.

### Partial Stale Update

For explicit warm execute:

1. Identify changed/deleted/added/metadata-uncertain sources.
2. Map changed sources to extractor keys.
3. Recompute only stale shards.
4. Reuse fresh shard payloads without reparsing unrelated large payloads.
5. Atomically write changed shards.
6. Write the source manifest last.

For read-only graph/pack commands, the same stale analysis may happen in memory, but writes are skipped and reported.

## Required Shards

| Shard | Payload | Invalidated By | Priority |
|---|---|---|---|
| `source-manifest.json` | source entries, fingerprints, subset hashes | eligible path metadata, ignore config, extractor versions | P0 |
| `extractors/task-board.json` | task board nodes and active/next state | `docs/TASK_BOARD.md` | P0 |
| `extractors/current-state.json` | project state, handoff, context anchor summaries | current-state docs | P0 |
| `extractors/task-capsule-current.json` | active/requested task docs | requested task capsule files | P1 |
| `extractors/docs-registry.json` | docs registry nodes and read routing | docs registry files | P1 |
| `extractors/command-registry.json` | command nodes and implementation/test hints | command registry source | P1 |
| `extractors/code-index.json` | C2 code index report or compact summary | eligible source/test file subsets | P2 |
| `graph-core.json` | merged non-code graph/state projection | P0/P1 shards | P2 |
| `graph-code.json` | merged code graph projection | code-index shard | P3 |
| `pack-index.json` | compact task-to-candidate ranking hints | graph-core, optional graph-code | P3 |

Do not create one monolithic cache as the primary implementation. A compatibility export may exist later, but hot paths should be shard-local.

## Context Pack Warm Path

C3 `context pack` should not rebuild the whole graph when warm C6 shards exist.

Required behavior:

1. Resolve requested task id from task-board/current-task shards.
2. Load graph-core shard for state/task/doc relationships.
3. Load code-index or graph-code shard only when `--include-code` is requested or the ranking requires code links.
4. Generate `sliceCandidates[]` from cached source addresses and line hints.
5. Report cache metadata inherited from graph/index shards.

If any required shard is stale or missing:

- read-only `context pack` may compute live output in memory;
- it must not write cache;
- it must report `cache.writeSkipped:true` when a newer projection could be warmed.

## Code Index Warm Path

C2 code index is the largest remaining performance risk for code-heavy C4/C5 flows.

Required behavior:

1. Split code source discovery from content extraction.
2. Accept a source manifest or source entries from graph/cache orchestration.
3. Cache per-file extraction summaries keyed by:
   - project-relative path;
   - size and mtime fingerprint;
   - optional content hash;
   - extractor version;
   - language/parser mode.
4. Recompute only changed files.
5. Merge per-file summaries into the public `hadara.codeIndex.v1` shape.
6. Expose real cache metadata instead of placeholder `used:false` fields.

Parser-backed extraction is allowed only when it improves accuracy without making warm reads slower. Regex/static extraction remains acceptable for unchanged files and bounded cold paths.

## Current Code Changes Required

| Area | Required Change |
|---|---|
| `src/context/source-manifest.ts` | Expose reusable discovery results and git fingerprint proofs to graph, cache warm, and code index callers. |
| `src/context/context-cache-store.ts` | Add shard listing, header-first reads, payload size metadata, and atomic writes for multiple shard kinds. |
| `src/context/context-graph-builder.ts` | Add a cache-aware orchestration layer that can load fresh shards, recompute stale extractors, and merge once. |
| `src/context/context-graph-extractor.ts` | Require extractor key, version, source kind dependencies, and source subset hash inputs for each extractor. |
| `src/context/code-index.ts` | Accept caller-provided source entries; persist/reuse per-file extraction summaries; emit real cache hit/stale metadata. |
| `src/context/code-graph-extractor.ts` | Consume cached code-index summaries when fresh and preserve degraded budget issues. |
| `src/context/context-pack.ts` | Prefer cached graph/code summaries and avoid rebuilding graph/index when a warm projection is available. |
| `src/cli/context.ts` | Keep read commands non-mutating; add JSON cache metadata consistently across graph, pack, status, and warm outputs. |
| `src/schemas/*` | Add shard header/payload schemas only when the corresponding shard becomes public or persisted. |
| `tests/unit/*` | Add cache hit/miss/stale/corrupt/no-write tests and measured fixture smokes for cold vs warm behavior. |

## Implementation Sequence

| Capsule | Scope | Done When |
|---|---|---|
| C6.6 Code Index Shard Persistence | Per-file code extraction cache and manifest-fed code index. | Warm `context graph --include-code` avoids unchanged file parsing. |
| C6.7 Graph-Core Shard Reuse | Cache-aware graph orchestration for P0/P1/P2 shards. | Warm non-code `context graph` reads from shards within target. |
| C6.8 Context Pack Warm Path | C3 pack consumes cached graph/code summaries. | Warm `context pack --task` does not rebuild graph/code index. |
| C6.9 Warm Execute Shard Phases | Extend `context cache warm --execute` to extractor/code/graph/pack shards. | Dry-run predicts stale shards; execute writes only planned shards. |
| C6.10 Performance Budgets and Regression Fixtures | Add cold/warm timing fixtures and degraded tests. | CI or focused tests fail on major repeated-walk regressions where deterministic. |

## Validation Requirements

Focused tests:

```bash
npm run test:focused -- tests/unit/context-source-manifest.test.ts
npm run test:focused -- tests/unit/context-cache-store.test.ts
npm run test:focused -- tests/unit/context-graph-cli.test.ts
npm run test:focused -- tests/unit/code-index.test.ts
npm run test:focused -- tests/unit/context-pack.test.ts
```

Public command smokes after implementation:

```bash
node dist/cli/main.js context cache status --json
node dist/cli/main.js context cache warm --json
node dist/cli/main.js context cache warm --execute --json
node dist/cli/main.js context graph --json
node dist/cli/main.js context graph --include-code --json
node dist/cli/main.js context pack --task T-XXXX --json
```

Performance evidence should record:

- cold command duration;
- warm command duration;
- cache mode;
- source count and skipped count;
- read shard count;
- recomputed shard count;
- whether writes were skipped because the command was read-only.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| C6-SF-AC1 | First graph build uses one manifest/discovery path shared by graph, code index, and pack dependencies. |
| C6-SF-AC2 | Warm graph and pack reads can prove freshness without full repository walks when git fingerprint and shard headers are fresh. |
| C6-SF-AC3 | Code index cache integration recomputes only changed eligible files. |
| C6-SF-AC4 | Context pack consumes cached graph/code summaries and avoids broad source reads on warm paths. |
| C6-SF-AC5 | Read commands never write `.hadara/local/cache/context/`. |
| C6-SF-AC6 | Warm execute writes only through explicit dry-run/execute cache warm semantics. |
| C6-SF-AC7 | Missing, stale, corrupt, partial, timeout, and budget-exceeded cache states are explicit in JSON issues. |
| C6-SF-AC8 | Cold paths return useful P0/P1 partial output before expensive code or historical extraction can block indefinitely. |
| C6-SF-AC9 | Cache records persist project-relative paths only. |
| C6-SF-AC10 | Runtime JSON contracts remain additive-compatible with C1/C2/C3/C4 outputs. |

## Reference

- `safishamsi/graphify`: https://github.com/safishamsi/graphify
