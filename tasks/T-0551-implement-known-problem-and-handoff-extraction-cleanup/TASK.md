# T-0551 Implement known-problem and handoff extraction cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0551 |
| Title | Implement known-problem and handoff extraction cleanup |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reduce stale known-problem nodes from handoff extraction. | Address T-0548 CP-6 by making known-problem extraction prefer explicitly current rows and by separating HADARA-dev's current handoff problems from historical carried-forward notes. |

## Scope

| Boundary | Items |
|---|---|
| In | `extractAgentHandoff` known-problem parsing, `docs/AGENT_HANDOFF.md` current/historical known-problem split, focused tests, built context-pack smoke. |
| Out | Cache freshness, code-index restoration, docs registry lifecycle cleanup, full handoff history rewrite. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add explicit-current known-problem parsing semantics. | Done |
| 3 | Split current and historical handoff problem tables. | Done |
| 4 | Validate and record evidence. | Done |
| 5 | Update shared state and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Known-problem extraction only emits rows marked current/open/active when the `Current Known Problems` table has a `State` column. | Met | ev:T-0551:8b2c9ddd3af9492aaa8e400b | `src/context/document-extractors.ts` |
| AC-2 | HADARA-dev `docs/AGENT_HANDOFF.md` separates compact active problems from historical/deferred problem notes so context pack no longer carries the large historical table as current known-problem nodes. | Met | ev:T-0551:daa5ba4a617844c5872de48e | `docs/AGENT_HANDOFF.md` |
| AC-3 | Validation evidence is recorded and includes a built context-pack smoke showing reduced known-problem count. | Met | ev:T-0551:3089ff9c45d5430f871777d6, ev:T-0551:daa5ba4a617844c5872de48e | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused handoff extraction tests | Yes | Passed | ev:T-0551:8b2c9ddd3af9492aaa8e400b |
| Docker sync-build and TypeScript build | Yes | Passed | ev:T-0551:3089ff9c45d5430f871777d6 |
| Built context pack known-problem smoke | Yes | Passed | ev:T-0551:daa5ba4a617844c5872de48e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | Source finding CP-6. |
| `src/context/document-extractors.ts` | implementation-source | active | Known-problem parser and handoff extraction. |
| `docs/AGENT_HANDOFF.md` | implementation-source | active | Current handoff state and known-problem table source. |

## Changes

| Area | Summary |
|---|---|
| Context extraction | `extractAgentHandoff` now treats a `Current Known Problems` table with a `State` column as explicitly current-only and emits only `Active`, `Current`, `Open`, or `Watch` rows. |
| Handoff state | `docs/AGENT_HANDOFF.md` now has a compact current known-problems table and preserves older carried-forward rows under `Historical Known Problems`. |
| Tests | Added focused regression coverage for state-aware handoff known-problem extraction. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Cache/extractor freshness, code-index routing, and docs registry lifecycle cleanup remain separate requested capsules. | Open | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Scoped to T-0548 CP-6 known-problem/handoff extraction cleanup. |
| 2026-07-09 | Done | Implemented state-aware current known-problem extraction, split handoff current/historical problem tables, and verified built context-pack output is limited to 4 active known-problem rows. |
