# C6 Fast Context Cache and Performance Implementation Spec

## Status

Draft detailed implementation specification for C6.

This document extends `05_Indexing_Cache_Invalidation_and_Performance_Spec.md`. The `05` spec remains the compact contract for cache location, invalidation, degraded output, and default budgets. This document defines the speed-first implementation shape for future capsules.

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

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Committed graph artifacts | HADARA source of truth remains project files, docs, task capsules, command registry, evidence, and code. |
| Provider or LLM-based indexing | C6 performance must work offline and deterministically. |
| HTML/wiki graph output | Useful for exploration, but not needed for agent session-start speed. |
| Full filesystem watcher runtime | Optional future convenience. C6 should work from explicit CLI reads and cache warm commands first. |
| Replacing C3/C4/C5 behavior | C6 accelerates graph/index/pack inputs; it does not redefine context ranking or slicing semantics. |

## Design Principles

| Principle | Requirement |
|---|---|
| Cache is not truth | Every cache record must be derivable from canonical sources. Cache miss or corrupt cache must fall back to live reads or explicit degraded output. |
| Speed is a product requirement | Context routing that is too slow will not be used. Budgets and fast paths are part of correctness. |
| Read commands do not write | `context graph`, future `context pack`, and future `session start` may read cache, but must not create or update cache files unless a later accepted command contract explicitly allows it. |
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
| future `context pack`, warm graph/index | < 75 ms | < 150 ms | < 300 ms |
| `context cache status --json`, manifest check only | < 75 ms | < 250 ms | < 1 s |

Cold first graph creation can be slower than warm reads, but must still avoid broad unnecessary IO. On mounted filesystems, degraded output is better than blocking indefinitely.

## Graphify Lessons

Graphify's useful ideas for HADARA:

| Graphify Pattern | HADARA Adaptation |
|---|---|
| Persistent graph output | Keep local rebuildable graph/index cache under `.hadara/local/cache/context/`; do not commit it by default. |
| Manifest and update mode | Use a source manifest plus extractor-version stamps to identify stale shards. |
| Watch/post-commit convenience | Defer to future optional cache-warm integrations. First implement explicit status/warm commands. |
| Query-first graph representation | Store compact adjacency and source-addressed nodes so pack/ranking can avoid rescanning project files. |
| Cache split for changed/unchanged files | Shard by extractor and source kind, then update only affected shards. |

Graphify behaviors not adopted for C6:

| Behavior | Reason |
|---|---|
| Committing generated graph directories | HADARA cache must remain optional and ignored. |
| Model/API extraction for docs/images/PDFs | C6 must remain deterministic, local, and fast. |
| HTML/wiki/report generation | Not needed for agent context routing fast path. |
| Global graph as truth | HADARA graph is a projection over canonical project state. |
| Automatic write hooks by default | HADARA write surfaces must be explicit and evidence-friendly. |

## Source Manifest Contract

The existing `hadara.context.sourceManifest.v1` sketch should be implemented with enough metadata to avoid unnecessary reads.

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

Future explicit cache commands:

```bash
hadara context cache status --json
hadara context cache warm --json
hadara context cache warm --execute --json
```

`context cache status` is read-only. `context cache warm` without `--execute` is a dry-run plan. `context cache warm --execute` writes local ignored cache files using atomic temp+rename. If these commands are added, they need command registry metadata and CLI JSON contract documentation.

## Cache Metadata in Reports

Graph, code index, and future context pack reports should share additive cache metadata:

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

## Required Existing Code Changes

| Area | Current State | Required Future Change |
|---|---|---|
| `src/context/context-graph-builder.ts` | Builds graph by collecting extractors and merging results in one read path. | Add a cache-aware orchestration layer that can load fresh extractor shards, recompute stale shards, and merge once. |
| `src/context/context-graph-extractor.ts` | Extractors return graph fragments, state sources, and issues. | Extend extractor metadata with `extractorKey`, `extractorVersion`, source kinds, and source subset hashing. |
| `src/context/code-index.ts` | Has file/byte/single-file budgets and placeholder cache metadata. | Split discovery/stat collection from content extraction so source manifest and code index share one file list; populate real cache metadata. |
| `src/context/code-graph-extractor.ts` | Projects code index output into context graph state. | Read from cached code-index shard when fresh; preserve budget/degraded projection. |
| `src/context/*extractor*.ts` | Existing extractors read their own inputs directly. | Make each extractor declare input source entries or source patterns so invalidation can be extractor-specific. |
| `src/cli/context.ts` or equivalent command handler | `context graph` is read-only and computes live output. | Add cache read support without writes; add future `context cache status/warm` only with command registry and JSON contract updates. |
| `src/schemas/*` | Graph and code-index schemas exist; source manifest/cache schema is not implemented. | Add source manifest, cache status, and cache record schema fixtures before public cache commands. |
| `tests/unit/context-graph*.test.ts` | Covers graph builder and CLI behavior. | Add cache-hit, cache-miss, stale-shard, corrupt-cache, and read-command-no-write tests. |
| `tests/unit/code-index.test.ts` | Covers ignore, extraction, relations, and budgets. | Add shared discovery and manifest carry-forward tests. |

New implementation modules should be small and focused:

| Proposed Module | Responsibility |
|---|---|
| `src/context/source-manifest.ts` | Source discovery, stat metadata, source subset hashing, manifest comparison. |
| `src/context/context-cache-store.ts` | Read/write cache records, schema guard, atomic temp+rename write. |
| `src/context/context-cache.ts` | Cache orchestration, stale analysis, report metadata. |
| `src/context/context-cache-commands.ts` | Optional future CLI surfaces for status/warm. |

## Implementation Capsules

Recommended C6 capsule split:

| Capsule | Scope | Acceptance |
|---|---|---|
| C6.1 Source Manifest and Shared Discovery | Add source manifest types, schema, ignore-aware stat collector, and source subset hash helpers. | Manifest records project-relative paths, kinds, size/mtime metadata, extractor versions, and budget issues. |
| C6.2 Cache Store and Status Read Model | Add cache record envelope, safe read path, corrupt-cache diagnostics, and optional read-only status report. | Cache status can report missing/hit/stale/corrupt without writing. |
| C6.3 Extractor Shards and Invalidation | Add extractor keys/versions and stale-shard recomputation planning. | Task docs changes do not invalidate code index; source-code changes do not invalidate task-board shard. |
| C6.4 Fast Cold Build and Graph Budgets | Share directory discovery, parallelize independent extractors, and enforce graph node/edge/time budgets. | Cold graph build avoids duplicate walks and returns explicit degraded output when capped. |
| C6.5 Code Index Cache Integration | Connect code index to manifest/cache store and real cache metadata. | Warm include-code graph can use cached code-index output. |
| C6.6 Context Pack Warm Path | Make C3 context pack consume cached graph/index summaries when present. | Warm pack generation avoids project-wide rescans. |
| C6.7 Cache Warm Command | Add explicit dry-run/execute cache warm command if needed. | Read commands remain non-mutating; warm execute writes atomically and is registered. |

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
| C6-AC10 | Future C3 context pack can consume cached graph/index summaries without rescanning the full project. |
