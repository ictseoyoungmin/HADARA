# T-0363 C6.1 Source Manifest and Shared Discovery

## Metadata

| Field | Value |
|---|---|
| ID | T-0363 |
| Title | C6.1 Source Manifest and Shared Discovery |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add a metadata-first source manifest foundation for C6. | Let future context graph, code index, and context pack paths share one fast discovery/invalidation model before persistent cache writes are added. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.context.sourceManifest.v1` schema and runtime registration. | Gives C6 cache/index records a documented portable shape. |
| Metadata-first source discovery helper. | Avoids content reads on the common cold/warm discovery path while retaining project-relative source identity. |
| Source kind and extractor-key classification. | Lets graph/code-index/cache consumers invalidate only affected extractor families. |
| Manifest comparison and subset-hash helpers. | Provides the minimum reusable invalidation primitives for C6.2 cache store work. |
| Focused unit coverage and shared docs state updates. | Keeps schema/runtime behavior and next-task routing deterministic. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Cache file writes, cache status command, and warm-cache reads. | Deferred to C6.2 so this slice stays a narrow foundation. |
| Rewiring context graph, code index, or context pack to consume the manifest. | Deferred until the manifest/cache store contract is proven. |
| C4 `context slice` implementation. | C4 should build on the faster cache path rather than adding another broad live scan. |
| Strong content hashing of every source by default. | Content reads are intentionally avoided on the fast discovery path; hashes can be carried forward or computed by later warm paths. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
