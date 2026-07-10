# T-0555 Optimize mounted context pack fingerprint hot path

## Identity

| Field | Value |
|---|---|
| ID | T-0555 |
| Title | Optimize mounted context pack fingerprint hot path |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reduce mounted-workspace context-pack hot path latency without weakening write/finalize safety. | Add a bounded, explicit assumed-hot cache path for task-scoped context reads when Git fingerprint verification is too slow, and surface the trust level in JSON diagnostics. |

## Scope

| Boundary | Items |
|---|---|
| In | Source-manifest fast freshness options; task-scoped context pack/cache analysis hot path; JSON diagnostics/tests; built CLI smokes on the mounted workspace. |
| Out | Persistent daemon/cache service, release/finalize safety semantics, changing explicit `--live` broad diagnostics, hiding stale-risk warnings. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and measure current mounted hot-path latency. | Done |
| 2 | Add an explicit bounded assumed-hot freshness path for read-only context surfaces. | Done |
| 3 | Validate with focused tests, Docker-built dist, and mounted built-CLI smokes. | Done |
| 4 | Update evidence/state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `context pack --task` can avoid the long Git status path on a mounted repo when a valid graph-core/cache exists, while reporting an assumed-hot/trust diagnostic instead of pretending full proof. | Done | `ev:T-0555:33d5e8e3e5f841aeb6a41b40` | `.hadara/local/feedback/T-0554-context-pack-hot-path-latency.md` |
| AC-2 | Full freshness verification remains available for cache warm/rebuild paths and stale-cache detection when the Git fingerprint check completes within budget. | Done | `ev:T-0555:7e6433054c7a4792bf00d694` | `src/context/source-manifest.ts` |
| AC-3 | Focused tests cover the assumed-hot path and normal fingerprint-hit/mismatch behavior. | Done | `ev:T-0555:7e6433054c7a4792bf00d694` | HADARA workflow |
| AC-4 | Docker-built dist is refreshed and built CLI smokes show improved mounted task-scoped context-pack latency. | Done | `ev:T-0555:b66f86723e4049ccb4c9d568`, `ev:T-0555:33d5e8e3e5f841aeb6a41b40` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Baseline mounted context cache/pack timing | No | Not Applicable | Direct timing: `git status --untracked-files=all` ~8.90s, `context cache status --json` ~20.01s, `context pack --task T-0554` stale path ~67.67s. |
| Focused context cache/source-manifest tests | Yes | Passed | `ev:T-0555:7e6433054c7a4792bf00d694` |
| Docker sync-build full validation | Yes | Passed | `ev:T-0555:b66f86723e4049ccb4c9d568` |
| Built CLI mounted context smokes | Yes | Passed | `ev:T-0555:33d5e8e3e5f841aeb6a41b40` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0554-context-pack-hot-path-latency.md` | reference | active | Local-only residual: task-scoped pack and cache status still around 10s after T-0554. |
| `src/context/source-manifest.ts` | implementation-source | active | Git worktree fingerprint and freshness logic. |
| `src/context/context-cache-store.ts` | implementation-source | active | Cache status/analysis and graph-cache metadata. |
| `src/context/session-start.ts` / `src/context/context-graph-builder.ts` | implementation-source | active | Context read surfaces that consume source-manifest freshness. |

## Changes

| Area | Summary |
|---|---|
| Baseline | Mounted workspace baseline shows the slow path is Git status plus full source-manifest rebuild after a fingerprint mismatch; task-scoped pack spent ~67.67s when only state docs and a new task capsule were dirty. |
| Source manifest cache | `createSourceManifestCacheAnalysis` can use Git status entries from a fingerprint mismatch as an explicit metadata-only `assumed-hot` freshness mode for read-only context status/task-scoped graph reads, with `trust:"assumed"` and `fullManifestBuilt:false` diagnostics. |
| Context graph/cache | Task-scoped graph reads can reuse stale graph-core with bounded live overlays when dirty extractor keys are bounded; overlay reads for task capsules/evidence are now limited to the selected task plus dirty task ids. |
| JSON diagnostics | Context cache and context pack metadata now surface `sourceManifestFastPath:"assumed-hot"`, `sourceManifestTrust:"assumed"`, and `sourceManifestFullManifestBuilt:false` instead of implying full verification. |
| Performance | Built Docker-refreshed CLI mounted smokes improved stale `context cache status --json` from ~20.01s to 8.30s and `context pack --task T-0554` from ~67.67s to 9.50s. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Mounted latency is now dominated by raw Git status on the WSL-mounted repo, measured around 6-9s. Reaching sub-3s likely needs a stronger operator-selected trust/cache strategy instead of more manifest work. | Open | `.hadara/local/feedback/T-0554-context-pack-hot-path-latency.md` |
| RF-2 | Follow-up | Docker sync-build spent several minutes in the workspace tar step because it copies broad repo artifacts into ext4; consider excluding historical task artifacts or adding a narrower dev-build path. | Open | `scripts/dev-docker-sync-build.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Scoped mounted context-pack fingerprint hot-path optimization. |
| 2026-07-10 | In Progress | Implemented assumed-hot source-manifest analysis, bounded task/evidence overlays, Docker validation, and mounted built-CLI smokes. |
| 2026-07-10 | Done | Acceptance met; ready for finalize close proof. |
