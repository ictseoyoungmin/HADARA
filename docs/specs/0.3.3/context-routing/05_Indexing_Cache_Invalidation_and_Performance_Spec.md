# Indexing, Cache, Invalidation, and Performance Spec

## Status

Merged final planning specification.

## Detailed Implementation Spec

For speed-first C6 implementation details, read:

```text
docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md
docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md
```

Those documents extend this compact cache contract with cold-build optimization, warm-cache fast paths, Graphify-adapted manifest/update lessons, command write boundaries, and existing code changes required for implementation. Use `08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` for the most speed-focused graph/code-index/context-pack implementation sequence.

## Goal

Define how context graph, code index, and context pack projections can be computed efficiently without becoming new sources of truth.

## Core Rule

Caches are optional, local, ignored, and rebuildable.

```text
cache != truth
```

## Cache Location

All context-routing cache files must live under:

```text
.hadara/local/cache/context/
```

Suggested files:

```text
.hadara/local/cache/context/context-graph.json
.hadara/local/cache/context/code-index.json
.hadara/local/cache/context/source-manifest.json
```

These should not be committed by default.

Do not use:

```text
.hadara/cache/
```

## Source Manifest

### `hadara.context.sourceManifest.v1`

```ts
export interface ContextSourceManifest {
  schemaVersion: 'hadara.context.sourceManifest.v1';
  generatedAt: string;
  projectRoot: string;
  manifestHash: string;
  sources: ContextSourceEntry[];
}
```

### Entry

```ts
export interface ContextSourceEntry {
  path: string;
  kind:
    | 'task-board'
    | 'task-capsule'
    | 'evidence'
    | 'docs-registry'
    | 'command-registry'
    | 'managed-section-source'
    | 'source-file'
    | 'test-file'
    | 'release-doc'
    | 'handoff-doc'
    | 'project-state-doc';
  hash: string;
  sizeBytes: number;
  mtimeMs?: number;
}
```

## Invalidation Rules

A projection is stale if any input source:

- is missing;
- has a different hash;
- has changed mtime and hash is not available;
- has schemaVersion mismatch;
- has parse errors not present in prior projection;
- extractor version changed.

## Cache Policy

| Projection | Cache allowed | Authoritative? |
|---|---:|---:|
| context graph | Yes | No |
| state projection | Yes, as part of graph cache | No |
| code index | Yes | No |
| context pack | Optional, usually no | No |
| context slice | No, compute directly | No |
| session start | No, compose current reads | No |

## Performance Budget

### Context graph + state projection

| Metric | Target |
|---|---:|
| small project | < 500 ms |
| medium project | < 2 s |
| large project degraded mode | < 5 s |

### Code index

| Metric | Target |
|---|---:|
| small TypeScript project | < 1 s |
| medium TypeScript project | < 5 s |
| large project degraded mode | < 10 s |

### Context pack

| Metric | Target |
|---|---:|
| existing graph/index | < 300 ms |
| rebuild needed | inherited from graph/index |

## Degraded Mode

If limits are exceeded, return partial output only with explicit degraded issue.

Example:

```json
{
  "degraded": true,
  "issues": [
    {
      "severity": "warning",
      "code": "CONTEXT_INDEX_BUDGET_EXCEEDED",
      "message": "Code index exceeded file budget; partial results returned."
    }
  ]
}
```

Never silently return incomplete output.

## File Budgets

Defaults:

| Budget | Default |
|---|---:|
| max indexed files | 2,000 |
| max indexed bytes | 20 MB |
| max single file full read | 1 MB |
| max graph nodes | 20,000 |
| max graph edges | 100,000 |

These can be configurable later, but start with hardcoded limits and clear warnings.

## Atomic Cache Write

If writing cache:

1. write to temp file under `.hadara/local/cache/context/`;
2. fsync if helper supports it;
3. rename into place;
4. never corrupt previous cache on failure.

## CLI Flags

Potential flags:

```bash
--no-cache
--refresh
--max-files <n>
--max-bytes <n>
```

Do not add all flags immediately unless needed.

## JSON Cache Metadata

Each cached projection should include:

```json
{
  "cache": {
    "used": true,
    "hit": true,
    "manifestHash": "sha256:...",
    "createdAt": "2026-06-18T00:00:00.000Z",
    "cachePath": ".hadara/local/cache/context/context-graph.json"
  }
}
```

## Development Plan

1. Define source manifest schema.
2. Implement source collector.
3. Implement hash calculator with path filters.
4. Implement stale check.
5. Implement optional local cache read/write.
6. Add degraded mode budget warnings.
7. Add performance tests or smoke fixtures.

## Tests

```bash
npm run test:focused -- tests/unit/context-cache.test.ts tests/unit/context-source-manifest.test.ts
npm run build
npm test
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| IC-AC1 | Source manifest records paths/hashes/kinds. |
| IC-AC2 | Changed source invalidates cache. |
| IC-AC3 | Missing source invalidates cache. |
| IC-AC4 | Cache writes are atomic. |
| IC-AC5 | Cache is under `.hadara/local/cache/context/`. |
| IC-AC6 | Cache is never authoritative. |
| IC-AC7 | Degraded mode is explicit. |
| IC-AC8 | Budget limits prevent runaway indexing. |
