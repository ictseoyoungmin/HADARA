# T-0553 Implement code-index and docs registry routing cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0553 |
| Title | Implement code-index and docs registry routing cleanup |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore useful task-scoped context routing signal without reintroducing broad live scans. | T-0548 CP-4/CP-8 showed code-index signal was absent from ordinary context pack output and docs registry matching could promote stale reference specs into active task reads. |

## Scope

| Boundary | Items |
|---|---|
| In | Bounded code-index use in context graph/pack; explicit live-code fallback preservation; docs registry active-spec matching cleanup; focused tests; built CLI smokes. |
| Out | Full code-index redesign, automatic cache warming, docs registry mass migration, broad context-pack ranking redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and capture baseline routing behavior. | Done |
| 2 | Add a cache-only code-index strategy for default context pack while preserving explicit live fallback. | Done |
| 3 | Tighten docs registry active-spec inference so reference specs do not become active reads by token overlap alone. | Done |
| 4 | Validate with focused tests, Docker sync-build, and built context smokes. | Done |
| 5 | Update evidence, handoff/current-state notes, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default task-scoped context pack can expose a fresh cached code-index signal without doing stale/missing live code extraction. | Done | `ev:T-0553:06af419d19144bab937b06cb` | T-0548 CP-4 |
| AC-2 | Explicit code-aware context graph/pack behavior still falls back to live code extraction when the code-index shard is stale or missing. | Done | `ev:T-0553:9dfcaa17c78d494c84aac8b6` | Existing include-code contract |
| AC-3 | Reference specs with only token overlap no longer become active-spec/readFirst unless explicitly marked active, active-spec, or activeForTasks. | Done | `ev:T-0553:06af419d19144bab937b06cb` | T-0548 CP-8 |
| AC-4 | Validation evidence covers focused tests, Docker-built dist refresh, and built current-repo context smokes. | Done | `ev:T-0553:9dfcaa17c78d494c84aac8b6`, `ev:T-0553:b990814a52c44d89b38b499f`, `ev:T-0553:06af419d19144bab937b06cb` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Baseline routing diagnostic | Yes | Passed | ev:T-0553:5337fdfa720f4061a6610ee6 |
| Focused context routing tests | Yes | Passed | ev:T-0553:9dfcaa17c78d494c84aac8b6 |
| Docker sync-build full validation | Yes | Passed | ev:T-0553:b990814a52c44d89b38b499f |
| Built context routing smokes | Yes | Passed | ev:T-0553:06af419d19144bab937b06cb |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | CP-4 and CP-8 define the remaining cleanup target. |
| `src/context/context-pack.ts` | implementation-source | active | Context pack graph/read-map assembly and code-index availability reporting. |
| `src/context/context-graph-builder.ts` | implementation-source | active | Context graph extraction/cache strategy boundary. |
| `src/services/docs-registry.ts` | implementation-source | active | Docs read-map active-spec inference. |

## Changes

| Area | Summary |
|---|---|
| Context graph/pack | Added `fresh-cache-only` code-index strategy and made default task-scoped context pack read fresh cached code-index shards without live fallback; explicit `--include-code` keeps live fallback. |
| Docs registry | Restricted token-overlap active-spec inference to `status: active`; reference specs now remain conditional unless explicitly marked active-spec or activeForTasks. |
| Tests/docs | Updated focused context graph/pack/CLI/docs registry tests and recorded Docker-built dist plus built current-repo smokes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Default pack must not regress to broad live code scans on stale or missing cache. | Closed | Covered by fresh-cache-only stale-shard fixture in `tests/unit/context-graph-builder.test.ts`. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Scoped final T-0548 cleanup item to bounded code-index routing and docs registry active-spec inference. |
| 2026-07-09 | Done | Implemented bounded cached code-index routing, tightened docs active-spec inference, refreshed Docker-built dist, and verified built context smokes. |
