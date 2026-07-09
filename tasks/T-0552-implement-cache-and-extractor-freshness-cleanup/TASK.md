# T-0552 Implement cache and extractor freshness cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0552 |
| Title | Implement cache and extractor freshness cleanup |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make cache remediation freshness explicit and verifiable. | Address T-0548 CP-3 by proving `context cache warm --execute` refreshes stale manifest/shards and by exposing post-write freshness in the warm response so agents do not need to infer success from a second command. |

## Scope

| Boundary | Items |
|---|---|
| In | Context cache warm report contract, source-manifest/shard post-write freshness reporting, focused cache tests, built cache warm/status/context-pack smokes. |
| Out | Code-index graph routing restoration, docs registry routing cleanup, automatic writes from read-only context pack/graph commands, broad context performance redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add post-write freshness reporting to cache warm execute. | Done |
| 3 | Validate focused cache behavior and current repo smokes. | Done |
| 4 | Update shared state and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `context cache warm --execute --json` exposes additive post-write freshness fields showing manifest freshness, stale extractor keys, and shard freshness after the write. | Met | ev:T-0552:f32bf15e94a04cc8bf897923, ev:T-0552:6c73cf25a3a34fce98a23bf8 | `src/context/context-cache-store.ts` |
| AC-2 | Focused tests prove stale/missing cache remediation reports both before-state diagnostics and after-state fresh confirmation. | Met | ev:T-0552:f32bf15e94a04cc8bf897923 | `tests/unit/context-cache-store.test.ts` |
| AC-3 | Built current-repo smokes prove cache warm execute followed by cache status/context pack has no stale extractor keys. | Met | ev:T-0552:6c73cf25a3a34fce98a23bf8 | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused context cache tests | Yes | Passed | ev:T-0552:f32bf15e94a04cc8bf897923 |
| Docker sync-build and TypeScript build | Yes | Passed | ev:T-0552:ec0b91ff9cf741068157ca91 |
| Built cache warm/status/context-pack smoke | Yes | Passed | ev:T-0552:6c73cf25a3a34fce98a23bf8 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | Source finding CP-3. |
| `src/context/context-cache-store.ts` | implementation-source | active | Cache status/warm report implementation. |
| `tests/unit/context-cache-store.test.ts` | reference | active | Existing cache freshness regression suite. |

## Changes

| Area | Summary |
|---|---|
| Cache warm report | `context cache warm --execute --json` now includes additive `after` and `summary.postWrite*` fields when it performs writes, including post-write manifest status, shard summary, stale extractor keys, and operator summary. |
| Source manifest freshness | Git stdout recovery handles this environment's `spawnSync git EPERM` with usable stdout, preserving git worktree fast-path freshness instead of falling back to broad scans and `fingerprint-unavailable`. |
| Schema/tests | Updated `hadara.context.cacheWarm.v1` schema and focused cache tests for post-write freshness confirmation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Code-index graph node restoration and docs registry routing cleanup remain separate requested capsules. | Open | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Scoped to T-0548 CP-3 cache/extractor freshness remediation reporting and verification. |
| 2026-07-09 | Done | Added post-write cache freshness reporting, recovered git stdout from EPERM-like spawn failures, and verified current repo cache status/context pack use fresh cache with zero stale extractor keys. |
