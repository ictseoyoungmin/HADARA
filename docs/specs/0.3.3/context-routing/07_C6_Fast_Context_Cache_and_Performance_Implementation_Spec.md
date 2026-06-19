# C6 Fast Context Cache and Performance Implementation Spec

## Status

Detailed C6 implementation specification with readiness snapshot.

Updated 2026-06-19 by T-0385 to reflect implementation and cleanup through T-0384. Use `09_Context_Routing_Implementation_Completion_Audit.md` for the current completion snapshot and remaining follow-up queue.

This document extends `05_Indexing_Cache_Invalidation_and_Performance_Spec.md`. The `05` spec remains the compact contract for cache location, invalidation, degraded output, and default budgets. This document defines the speed-first implementation shape and records what has landed.

For the most execution-focused C6 performance blueprint after the initial source-manifest/cache/shard work, also read `08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md`. It narrows the next C6 work around cold graph ordering, warm shard reads, code-index persistence, context-pack warm paths, and the concrete code changes required to keep graph routing fast.

## Goal

Make context graph, state projection, code index, and context pack startup fast enough that agents can use them on every session start without hesitation.

The design must:

- minimize first graph build latency;
- make warm graph/index reads very fast;
- keep cache files local, ignored, optional, and rebuildable;
- never make cache output authoritative;
- preserve read-only semantics for context read commands;
- expose degraded output explicitly when budgets are exceeded;
- define the existing code changes needed for implementation.

## Implementation Status Snapshot

| Slice | Current State | Next Requirement |
|---|---|---|
| C6.1 Source Manifest and Shared Discovery | Implemented through T-0363. | Reuse it as the single source discovery/stat path for graph, code index, and cache warm. |
| C6.2 Cache Store and Status Read Model | Implemented through T-0364. | Keep `context cache status` read-only; use it to prove hit/stale/corrupt states before writes. |
| C6.3 Cache Warm / Integration | Source-manifest warm, extractor shards, graph-core, code-index shard, per-file code-index summaries, context-pack warm graph consumption, Session Start warm consumption, advisory performance regression fixtures, E2E smoke coverage, and cache diagnostics are implemented through T-0384. | Continue with T-0386/T-0387 hardening; do not add hidden default scans. |
| C4 Context Slice | Implemented through T-0370 and hardened through T-0372/T-0376. | Keep raw slices bounded, source-addressed, and excluded from cache/local generated surfaces. |
| C5 Session Start | Bounded no-live MVP implemented through T-0378; T-0379 added proven-fresh warm-cache consumption before fallback; T-0382 added structured guidance/no-task UX. | Preserve bounded default behavior and explicit live opt-in. |

T-0382 through T-0385 completed the post-T-0380 readiness cleanup. A slow live graph remains unacceptable as a default on mounted workspaces, so C5 must consume warmed cache when freshness is proven and otherwise degrade explicitly. Broad cache/graph/pack reads may remain slower explicit operations on mounted filesystems.

## Speed-First Decision Summary

| Decision | Requirement |
|---|---|
| Optimize first build, not only warm reads | Cold graph generation still scans sources, but it must avoid duplicate walks, historical deep reads, and oversized file reads. |
| Build a manifest before extracting content | Metadata-first discovery is the gate for all extractors. Content reads happen only for relevant, in-budget sources. |
| Shard by extractor and source subset | A task doc edit must not invalidate code index output; a code file edit must not invalidate Task Board or evidence shards. |
| Make writes explicit | Read commands may report stale/missing cache but must not warm cache implicitly. |
| Keep graph/cache lower authority than files | Cache corruption, misses, or stale state fall back to live reads or explicit degraded output. |
| Measure and report speed state | JSON outputs should say whether cache was used, skipped, stale, partial, or unavailable. |

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Committed graph artifacts | HADARA source of truth remains project files, docs, task capsules, command registry, evidence, and code. |
| Provider or LLM-based indexing | C6 performance must work offline and deterministically. |
| HTML/wiki graph output | Useful for exploration, but not needed for agent session-start speed. |
| Full filesystem watcher runtime | Optional deferred convenience. C6 works from explicit CLI reads and cache warm commands first. |
| Replacing C3/C4/C5 behavior | C6 accelerates graph/index/pack inputs; it does not redefine context ranking or slicing semantics. |

## Design Principles

| Principle | Requirement |
|---|---|
| Cache is not truth | Every cache record must be derivable from canonical sources. Cache miss or corrupt cache must fall back to live reads or explicit degraded output. |
| Speed is a product requirement | Context routing that is too slow will not be used. Budgets and fast paths are part of correctness. |
| Read commands do not write | `context graph`, `context pack`, `context slice`, and `session start` may read cache, but must not create or update cache files unless a later accepted command contract explicitly allows it. |
| Explicit write surface | Cache writes belong behind an explicit warm/status command or an operator-accepted lifecycle surface. |
| Manifest before content | Fast invalidation should use path, size, mtime, and extractor version before content reads. Hash content only when metadata indicates possible change or stronger proof is needed. |
| Incremental by extractor | Recompute only stale extractor groups. Do not rebuild code index because Task Board changed, and do not rescan task capsules because a source file changed. |
| Partial means degraded | Any skipped source, file budget cap, parse cap, timeout, or stale subset must appear in `issues` and summary metadata. |
| Local portable paths | Cache paths and graph source addresses must be project-relative. Absolute paths are diagnostic-only and should not be persisted in cache payloads. |

## Cache Location

All C6 cache artifacts must live under:

```text
.hadara/local/cache/context/
```

Do not use `.hadara/cache/`.

Recommended layout:

```text
.hadara/local/cache/context/
  source-manifest.json
  file-stat-index.json
  graph-core.json
  state-projection.json
  code-index.json
  pack-index.json
  extractors/
    task-board.json
    task-capsules.json
    docs-registry.json
    command-registry.json
    evidence.json
    managed-sections.json
    decisions.json
    handoff-known-problems.json
    release-readiness.json
    project-state.json
    code-files.json
```

The layout is intentionally sharded. A single large `context-graph.json` is acceptable as a compatibility export, but the implementation should prefer extractor-level shards for invalidation and update speed.

## Performance Targets

Targets are measured on a warm Node process when possible and include JSON serialization.

| Operation | Small Project | Medium Project | Large/Mounted Degraded |
|---|---:|---:|---:|
| `context graph --json`, no cache, no code | < 300 ms | < 1.5 s | < 4 s |
| `context graph --json`, warm cache hit | < 75 ms | < 150 ms | < 500 ms |
| `context graph --include-code --json`, no cache | < 900 ms | < 4 s | < 10 s degraded |
| `context graph --include-code --json`, warm cache hit | < 125 ms | < 300 ms | < 750 ms |
| `context pack`, warm graph/index | < 75 ms | < 150 ms | < 300 ms |
| `context cache status --json`, manifest check only | < 75 ms | < 250 ms | < 1 s |

Cold first graph creation can be slower than warm reads, but must still avoid broad unnecessary IO. On mounted filesystems, degraded output is better than blocking indefinitely.

## Latency Architecture

C6 should make context routing fast by changing the shape of work, not by hiding slow work behind cache alone.

| Layer | Cold Path | Warm Path | Failure / Degraded Behavior |
|---|---|---|---|
| Source discovery | One ignore-aware walk produces a source manifest and source-kind buckets. | Stat-only comparison against prior manifest. | Return `SOURCE_MANIFEST_PARTIAL` if file/byte/time caps stop discovery. |
| Extraction | Run only extractors whose source buckets are requested and in budget. | Load fresh shard records and recompute only stale shards. | Return partial graph with extractor-level warning issues. |
| Merge | Merge extractor fragments once into graph/state/code projections. | Merge cached shards, or read a compact merged graph shard when fresh. | If merge budget is exceeded, emit `CONTEXT_GRAPH_BUDGET_EXCEEDED`. |
| Context pack | Rank from graph/code summaries and active task hints. | Use cached graph/index summaries; avoid source rereads. | Return bounded pack with excluded candidates and reasons. |
| Context slice | Read exact source ranges requested by pack or explicit command. | No persistent slice cache by default; source hash guards each read. | Fail or degrade per slice; never use stale text. |

The target architecture is:

```text
single source manifest
  -> extractor source subsets
  -> extractor cache shards
  -> merged graph/state/code summaries
  -> context pack candidates
  -> deterministic source slices
```

Avoid this anti-pattern:

```text
context graph walks files
context pack walks files again
code index walks files again
context slice guesses ranges from broad reads
```

## Graphify Comparison and Lessons

The referenced [`safishamsi/graphify`](https://github.com/safishamsi/graphify) project builds a queryable knowledge graph from code, docs, SQL schemas, scripts, media, and other project artifacts. Its README describes three default outputs under `graphify-out/`: `graph.html`, `GRAPH_REPORT.md`, and `graph.json`; an update mode that re-extracts changed files; a portable manifest; optional cache sharing; local tree-sitter extraction for code; and assistant integrations that nudge agents toward querying the graph before grepping or opening many files.

HADARA should absorb the performance ideas, not the authority model.

Graphify patterns worth adapting:

| Graphify Pattern | HADARA Adaptation |
|---|---|
| Persistent graph output | Keep rebuildable graph/index shards under `.hadara/local/cache/context/`; do not commit them by default. |
| `--update` changed-file extraction | Use source-manifest comparison, extractor versions, and subset hashes to recompute only stale shards. |
| Portable manifest | Persist project-relative paths and stable hashes; never persist machine-local absolute paths as cache keys. |
| Local AST extraction for code | Keep C2 deterministic and offline; optionally add parser-backed extraction later behind per-file changed-source gates. |
| Assistant query-first UX | Make `context pack` and Session Start consume graph/cache summaries so agents do not reread broad docs manually. |
| Optional hooks | Treat hooks as a future convenience only after explicit cache warm works and is evidence-friendly. |
| Graph query server / MCP | Future read-only MCP can serve cached graph projections, but C6 does not add new truth or write tools. |

Graphify behaviors not adopted for C6:

| Behavior | Reason |
|---|---|
| Committing generated graph directories as team bootstrap state | HADARA cache must remain optional and ignored; canonical state is committed docs/tasks/code/evidence. |
| Model/API extraction for docs/images/PDFs | C6 must remain deterministic, local, and fast. |
| HTML/wiki/report generation | Not needed for agent context routing fast path. |
| Global graph as truth | HADARA graph is a projection over canonical project state. |
| Automatic write hooks by default | HADARA write surfaces must be explicit and evidence-friendly. |
| Broad multimodal ingestion | HADARA 0.3.3 context routing is scoped to project docs, tasks, evidence, commands, and code links. |

The practical distinction:

| Dimension | Graphify | HADARA C6 |
|---|---|---|
| Primary artifact | Queryable generated graph/report output. | Fast local cache for deterministic read models. |
| Default output location | `graphify-out/`, optionally committed as team map. | `.hadara/local/cache/context/`, ignored and rebuildable. |
| Extraction scope | Broad corpus including media and model-assisted semantic extraction. | Deterministic project protocol/code/docs sources only. |
| Agent UX | Ask graph queries instead of grepping. | Use graph/pack/slice/session-start to route exact source-addressed context. |
| Freshness model | Update changed files, hooks, portable manifest. | Manifest + extractor versions + subset hashes + explicit warm/write boundary. |
| Authority | Generated graph is useful project memory. | Graph/cache never satisfy proof, evidence, release, or state truth alone. |

## Source Manifest Contract

The implemented `hadara.context.sourceManifest.v1` contract is the base for metadata-first freshness checks. Future cache integration should preserve at least the following shape and extend it additively when shard-level invalidation needs more metadata.

```ts
export interface ContextSourceManifest {
  schemaVersion: 'hadara.context.sourceManifest.v1';
  generatedAt: string;
  projectFingerprint: string;
  cacheVersion: string;
  manifestHash: string;
  ignoreConfigHash: string;
  extractorVersions: Record<string, string>;
  sources: ContextSourceEntry[];
  summary: ContextSourceManifestSummary;
}

export interface ContextSourceEntry {
  path: string;
  kind: ContextSourceKind;
  sizeBytes: number;
  mtimeMs?: number;
  mtimeNs?: string;
  contentHash?: string;
  metadataHash: string;
  extractorKeys: string[];
  parseState?: 'ok' | 'skipped' | 'failed';
  issueCodes?: string[];
}

export interface ContextSourceManifestSummary {
  sourceCount: number;
  totalBytes: number;
  hashedSourceCount: number;
  skippedSourceCount: number;
  generatedByCommand?: string;
}
```

`metadataHash` is computed from stable path, kind, size, mtime, ignore config hash, and extractor version. `contentHash` is optional on the fast path. When size and mtime match a prior entry, the implementation should carry forward the prior `contentHash` without rereading the file.

## Cache Record Contract

Every shard should use a common envelope:

```ts
export interface ContextCacheRecord<TPayload> {
  schemaVersion: 'hadara.context.cacheRecord.v1';
  cacheKey: string;
  projection: string;
  projectionSchemaVersion: string;
  createdAt: string;
  manifestHash: string;
  sourceSubsetHash: string;
  extractorVersions: Record<string, string>;
  degraded: boolean;
  issues: ContextCacheIssue[];
  payload: TPayload;
}
```

The `sourceSubsetHash` lets a task-capsule shard stay valid when only source-code files changed.

## Fast Path Algorithm

Warm cache hit:

1. Read cache headers and prior `source-manifest.json`.
2. Perform one bounded source discovery pass with ignore rules.
3. Stat files needed for source metadata.
4. Compare path, kind, size, mtime, ignore config hash, schema versions, and extractor versions.
5. If all relevant subsets are fresh, assemble graph/index/pack from cached shards.
6. Return cache metadata with `used:true`, `hit:true`, and no cache writes.

Partial stale update:

1. Identify added, deleted, changed, and metadata-uncertain sources.
2. Map changed sources to extractor groups.
3. Recompute only stale extractor groups.
4. Rebuild merged graph from fresh cached shards plus newly computed shards.
5. If the command is read-only, return the new merged projection in memory and report `cache.writeSkipped:true`.
6. If the command is an explicit cache warm/write command, atomically write changed shards and the new manifest.

Cold first build:

1. Perform one ignore-aware directory walk.
2. Stop source discovery when file-count or byte budgets are reached.
3. Use file stats to skip oversized files before reading.
4. Read small required docs first: Task Board, Agent Handoff, Project State, docs registry, command registry, active capsule docs.
5. Run independent extractors concurrently after the source list is known.
6. Run code index extraction with byte/file budgets and file-type filters before content reads.
7. Merge extractor results once, then derive state projection and summaries.
8. Return degraded partial output if budgets or time caps are reached.

Cold first build must not wait for expensive non-essential sources before returning the core project state. The order should be:

1. read compact state docs: `.hadara/context/HADARA_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`;
2. read active task capsule docs if a task is requested;
3. read docs registry and command registry surfaces;
4. discover eligible source/test files by metadata only;
5. run task/doc/evidence/command extractors and code index in bounded parallel lanes;
6. stop or degrade before broad historical capsule/code reads exceed budget.

This keeps first-run behavior useful even before any cache exists.

## First Build Optimizations

| Area | Required Optimization |
|---|---|
| Directory walking | Use one shared discovery result for source manifest, code index, and graph extractors. Do not let each extractor walk the tree independently. |
| Ignore rules | Apply `.gitignore`, HADARA local/generated exclusions, and context-routing ignore defaults before stat/read. |
| Stats before reads | Use `stat` size and mtime to reject over-budget files before `readFile`. |
| Required docs first | Load compact state docs and active capsule docs before historical or broad task capsule scans. |
| Task capsules | Prefer `docs/TASK_BOARD.md` for task list routing, then load only necessary capsule files for graph extraction. Do not deeply read every historical capsule for session-start output unless requested. |
| Extractor concurrency | Run independent read-only extractors through bounded parallelism. Serialize only shared merge and output assembly. |
| Code parsing | Keep current regex/static extraction fast. If a parser such as tree-sitter is added later, make it optional and run it only for changed eligible files. |
| JSON work | Store compact shards and avoid repeated stringify/parse loops during one command. |
| Time caps | Support internal caps that return explicit degraded output rather than blocking large mounted workspaces. |

## Warm Cache Optimizations

| Area | Required Optimization |
|---|---|
| Header-first cache reads | Read small cache headers or envelopes before parsing large payloads. If manifest/schema/extractor versions mismatch, skip full payload parse. |
| Shard-local JSON | Prefer multiple compact shard files over one monolithic graph cache for invalidation and parse cost. |
| Stable source subset hashes | Use subset hashes to prove unaffected shards fresh without comparing every source against every projection. |
| Carry-forward hashes | If path, kind, size, mtime, ignore config, and extractor version match, carry forward prior content hashes. |
| Lazy code index payload | `context graph` without `--include-code` should not parse full code-index payloads. |
| Bounded cache repair | Corrupt cache should be reported and ignored; repair only through explicit warm execute. |
| In-memory reuse per command | Within one CLI invocation, build the manifest once and pass it through graph/index/pack assembly. |

## Required Cache Shards

The initial shard set should be biased toward high-impact reuse:

| Shard | Projection | Inputs | Why First |
|---|---|---|---|
| `source-manifest.json` | `hadara.context.sourceManifest.v1` | all eligible source metadata | Foundation for every cache decision. |
| `extractors/task-board.json` | Task nodes and task state source | `docs/TASK_BOARD.md` | Small, high-value routing source. |
| `extractors/active-task-capsule.json` | Active task docs/evidence edges | active task capsule files | Needed by context pack/session start. |
| `extractors/docs-registry.json` | Document nodes/edges | docs registry surfaces | Required for read-routing. |
| `extractors/command-registry.json` | Command nodes/implementation hints | command registry source | Required for workflow suggestions. |
| `extractors/code-index.json` | Source/test/symbol/import summaries | source/test files | Largest performance win for include-code graph/pack. |
| `graph-core.json` | merged non-code graph/state projection | extractor shards | Lets common graph/pack calls avoid recomputing merge. |

Historical task capsules, release readiness, managed sections, decisions, and full evidence shards can follow once the first high-impact path is fast.

## Cache Command Boundary

Read-only commands:

```bash
hadara context graph --json
hadara context graph --include-code --json
```

These commands may:

- read cache files;
- compute fresh in-memory projections;
- report stale or missing cache;
- report what cache writes would be useful.

They must not:

- create `.hadara/local/cache/context/`;
- update cache shards;
- mutate manifests;
- hide degraded output.

Explicit cache commands:

```bash
hadara context cache status --json
hadara context cache warm --json
hadara context cache warm --execute --json
```

`context cache status` is read-only. `context cache warm` without `--execute` is a dry-run plan. `context cache warm --execute` writes local ignored cache files using atomic temp+rename. T-0366 implements the phase 1 source-manifest write surface, command registry entry, schema, and CLI JSON contract documentation.

`context cache warm` should be the first write surface because it lets operators pay the cold-build cost once, inspect the plan, and keep all ordinary context reads non-mutating. It should start narrow:

| Warm Phase | Write Scope | Acceptance |
|---|---|---|
| Warm phase 1 | `source-manifest.json` only | `context cache status` can move from miss/stale/corrupt to hit after execute. |
| Warm phase 2 | source manifest plus high-impact extractor shards | Task/docs/command shards can be reused by `context graph`. |
| Warm phase 3 | code-index shard | `context graph --include-code` can avoid unchanged source parsing. |
| Warm phase 4 | merged graph-core shard | `context pack` can rank from cached summaries without broad graph rebuild. |

Do not add implicit background writes to `context graph`, `context pack`, or C4 `context slice`.

T-0366 also adds a safe source-manifest discovery optimization: git worktrees use `git ls-files --cached --others --exclude-standard -z` to avoid broad generated/local directory walks before falling back to the existing ignore-aware filesystem walk. This reduces cold candidate discovery while preserving explicit stat-based freshness checks. It is not a full hot-cache solution; fresh status/warm checks still compare current metadata and remain too slow on large mounted worktrees until C6.4/C6.5 add shard fingerprints, watch/index acceleration, or bounded degraded checks.

## Cache Metadata in Reports

Graph, code index, context pack, and Session Start reports should share additive cache metadata:

```ts
export interface ContextCacheMetadata {
  used: boolean;
  hit: boolean;
  stale: boolean;
  mode: 'disabled' | 'miss' | 'hit' | 'partial-hit' | 'refresh-needed';
  cacheRoot: string;
  manifestHash?: string;
  staleExtractorKeys?: string[];
  readShardCount?: number;
  recomputedShardCount?: number;
  writeSkipped?: boolean;
  issues: ContextCacheIssue[];
}
```

Current `CodeIndexReport.cache` already has a placeholder shape. Future C6 work should replace placeholder-only fields with this metadata without breaking additive compatibility.

## Degraded Mode

Degraded output must be explicit at both projection level and cache level.

Required issue codes:

| Code | Meaning |
|---|---|
| `CONTEXT_CACHE_MISS` | No usable cache record was available. |
| `CONTEXT_CACHE_STALE` | A cache record exists but source metadata or extractor versions changed. |
| `CONTEXT_CACHE_CORRUPT` | Cache JSON could not be parsed or failed schema checks. |
| `CONTEXT_CACHE_WRITE_SKIPPED` | A read-only command computed a fresher projection but did not write cache. |
| `CONTEXT_GRAPH_BUDGET_EXCEEDED` | Graph node/edge/source limits were exceeded. |
| `CONTEXT_GRAPH_TIMEOUT` | Internal context graph time cap was reached. |
| `CODE_INDEX_TOO_LARGE` | Existing code-index budget warning, preserved. |
| `SOURCE_MANIFEST_PARTIAL` | Source discovery or hashing was incomplete by budget. |

## Existing Code Change Status

| Area | Implementation State After T-0385 | Residual Follow-up |
|---|---|---|
| `src/context/context-graph-builder.ts` | Cache-aware orchestration can consume fresh graph-core/extractor shards read-only, fall back live, and report clearer stale/corrupt/partial cache diagnostics through the cache status/warm surface. | Keep new extractor cache metadata additive and source-addressed. |
| `src/context/context-graph-extractor.ts` | Extractor keys/versions and source subset validation support the warmed shard path. | Keep extractor metadata additive when new extractors land. |
| `src/context/code-index.ts` | Source-manifest-fed code-index caching and incremental per-file reuse are implemented. | Parser-backed extraction remains deferred. |
| `src/context/code-graph-extractor.ts` | Fresh code-index cache can feed `context graph --include-code`; stale/corrupt/missing cache falls back live; explicit full-profile smoke coverage exists. | Keep include-code reads out of default fast smoke/session-start paths unless freshness is proven. |
| `src/context/context-pack.ts` | Context pack can consume cached graph/code summaries when fresh. | Pack-specific persisted shard is not required for 0.3.3 unless later measurements justify it. |
| `src/context/source-manifest.ts` | Source manifests, git candidate enumeration, git fingerprint fast proof, and subset hashes are implemented. | Mounted cold broad graph reads can still be slow; bounded Session Start avoids this by default. |
| `src/context/context-cache-store.ts` | Schema-guarded cache records, source manifest cache, extractor/graph-core/code-index writes, and atomic writes are implemented. | Header-first optimization remains a design preference, not a required separate 0.3.3 deliverable. |
| `src/cli/context.ts` or equivalent command handler | `context graph`, `context pack`, and Session Start consume cache read-only; `context cache warm --execute` is the explicit write surface; cache status/warm expose structured diagnostics and warm command args. | Preserve the read/write split. |
| `src/schemas/*` | Public context-routing schemas include graph/code/source-manifest/cache/status/warm/pack/slice/session-start surfaces. | Add new shard schemas only when a new public persisted shard is exposed. |
| `tests/unit/*` | Cache hit/miss/stale/corrupt/no-write coverage exists across graph/cache/code/session-start work, and built-CLI smoke coverage exists for the default context-routing path. | Keep full-profile mounted workloads explicit because they can exceed short budgets. |

New implementation modules should be small and focused:

| Proposed Module | Responsibility |
|---|---|
| `src/context/source-manifest.ts` | Source discovery, stat metadata, source subset hashing, manifest comparison. |
| `src/context/context-cache-store.ts` | Read/write cache records, schema guard, atomic temp+rename write. |
| `src/context/context-cache.ts` | Cache orchestration, stale analysis, report metadata. |
| `src/context/context-cache-commands.ts` | Cache status/warm command services and reports. |

The module names can follow the current codebase naming (`source-manifest.ts`, `context-cache-store.ts`) rather than the sketch above. The architectural requirement is separation of concerns: discovery, cache storage, cache orchestration, and CLI reporting should not collapse into one large graph builder.

## Implementation Capsules

Recommended C6 capsule split:

| Capsule | Scope | Acceptance |
|---|---|---|
| C6.1 Source Manifest and Shared Discovery | Add source manifest types, schema, ignore-aware stat collector, and source subset hash helpers. | Manifest records project-relative paths, kinds, size/mtime metadata, extractor versions, and budget issues. Completed by T-0363. |
| C6.2 Cache Store and Status Read Model | Add cache record envelope, safe read path, corrupt-cache diagnostics, and read-only status report. | Cache status can report missing/hit/stale/corrupt without writing. Completed by T-0364. |
| C6.3 Cache Warm Command, Phase 1 | Add explicit dry-run/execute warm command for source-manifest cache population. | Read commands remain non-mutating; warm execute writes atomically and makes status hit when sources are unchanged. Completed by T-0366. |
| C6.4 Extractor Shards and Invalidation | Add extractor keys/versions and stale-shard recomputation planning. | Completed through T-0367/T-0374; T-0376 added stale/corrupt coverage. |
| C6.5 Fast Cold Build and Graph Budgets | Share discovery/fingerprint work and avoid repeated mounted scans where freshness can be proven. | Implemented as fast freshness/source-manifest reuse through T-0368; broad cold graph latency remains a residual measured risk, mitigated by warm/bounded defaults. |
| C6.6 Code Index Cache Integration | Connect code index to manifest/cache store and real cache metadata. | Completed through T-0375/T-0377. |
| C6.7 Context Pack Warm Path | Make C3 context pack consume cached graph/index summaries when present. | Completed through T-0374/T-0375; T-0379 extends this to default Session Start warm consumption. |
| C6.8 Cache Warm Command, Shard Phases | Extend warm to extractor/code/graph shards. | Implemented for source-manifest, extractor, graph-core, code-index, and per-file code summaries through T-0374/T-0377; no pack-specific persisted shard is required for 0.3.3. |
| C6.9 Performance Regression Fixtures | Add advisory mounted/ext4/session-start performance thresholds. | Completed through T-0373/T-0380 with optional `--fail-on-regression`. |

T-0381 audit note: C4/C5 proceeded after C6.3 through C6.5 were implemented or scoped with explicit residual performance risk. Remaining work is cleanup/hardening, not prerequisite graph/cache construction.

## Tests

Required focused tests for implementation capsules:

```bash
npm run test:focused -- tests/unit/context-source-manifest.test.ts
npm run test:focused -- tests/unit/context-cache.test.ts
npm run test:focused -- tests/unit/context-graph-cache.test.ts
npm run test:focused -- tests/unit/code-index.test.ts
```

Required smokes once a public cache command exists:

```bash
node dist/cli/main.js context cache status --json
node dist/cli/main.js context cache warm --json
node dist/cli/main.js context cache warm --execute --json
node dist/cli/main.js context graph --json
node dist/cli/main.js context graph --include-code --json
```

Performance tests should include:

- a small fixture with no cache;
- the same fixture with warm cache;
- a fixture with one changed source file;
- a fixture with one changed task capsule;
- an oversized source file;
- a mounted-workspace or synthetic slow-stat smoke when practical.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| C6-AC1 | Cache artifacts live only under `.hadara/local/cache/context/`. |
| C6-AC2 | Read-only context commands can read cache but do not write cache. |
| C6-AC3 | Source manifest supports metadata-first freshness checks and optional content hashes. |
| C6-AC4 | Extractor-level invalidation avoids recomputing unrelated shards. |
| C6-AC5 | Warm graph/index reads meet the target budget or report measured misses/degradation. |
| C6-AC6 | Cold first build uses one shared discovery pass and skips over-budget files before reading. |
| C6-AC7 | Corrupt, stale, missing, or partial cache states are explicit in JSON issues. |
| C6-AC8 | Existing C1/C2 graph and code-index JSON contracts remain additive-compatible. |
| C6-AC9 | Cache writes, when added, use atomic temp+rename and preserve the previous cache on failure. |
| C6-AC10 | C3 context pack can consume cached graph/index summaries without rescanning the full project when fresh shards are available. |
