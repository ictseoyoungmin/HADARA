# T-0558 Current-state ownership and compact projection

## Identity

| Field | Value |
|---|---|
| ID | T-0558 |
| Title | Current-state ownership and compact projection |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make current state compact and unambiguous without losing historical detail. | `PROJECT_STATE.md` owns product/current-state facts; `AGENT_HANDOFF.md` owns continuity, next action, and live warnings; historical snapshots move under `docs/history/`. |

## Scope

| Boundary | Items |
|---|---|
| In | Compact current Project State and Agent Handoff; preserved historical snapshots; registry/routing ownership metadata; static regression checks; governed toy-project validation. |
| Out | New CLI commands or state stores, broad specs archival, command portfolio changes, provider/runtime work, release mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Preserve pre-P1 state/handoff snapshots under `docs/history/` and register them as historical. | Done |
| 2 | Rewrite current Project State and Agent Handoff to explicit non-overlapping ownership and bounded size. | Done |
| 3 | Add regression checks for compactness, required sections, and historical routing. | Done |
| 4 | Run focused/full validation and governed toy-project status/session/finalize dogfood. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current `PROJECT_STATE.md` and `AGENT_HANDOFF.md` stay within documented line budgets and expose required current sections. | Met | ev:T-0558:2189cb84302145689de0f8cc | tests/unit/current-state-docs.test.ts |
| AC-2 | Pre-P1 historical content is preserved under `docs/history/` and excluded from default read routing through registry metadata. | Met | ev:T-0558:8ac7eeb68db34f7a824f944b | docs registry/read-map smoke |
| AC-3 | Project State and Handoff declare non-overlapping ownership and route readers to Task Board, Development Slices, and history sources. | Met | ev:T-0558:2189cb84302145689de0f8cc | document review/test |
| AC-4 | Full validation and governed toy-project lifecycle dogfood pass with durable evidence. | Met | ev:T-0558:a0106f42bca342ca8341a17c, ev:T-0558:c5b24e7f72c143dd89e22d7c | validation and dogfood commands |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current-state docs focused tests | Yes | Passed | ev:T-0558:2189cb84302145689de0f8cc |
| Docs doctor/read-map smoke | Yes | Passed | ev:T-0558:8ac7eeb68db34f7a824f944b |
| Full Docker sync-build | Yes | Passed | ev:T-0558:a0106f42bca342ca8341a17c |
| Governed toy-project lifecycle | Yes | Passed | ev:T-0558:c5b24e7f72c143dd89e22d7c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request 2026-07-10 | constraint | active | Complete P0-P3 in separate committed capsules and archive stale docs. |
| docs/PROJECT_STATE.md | implementation-source | active | Current product/release/task state source. |
| docs/AGENT_HANDOFF.md | implementation-source | active | Current continuity/next-action source. |
| .hadara/docs-registry.json | implementation-source | active | Read-tier and authority routing metadata. |
| docs/HADARA_WORKFLOW.md | reference | active | Current-state and historical reading rules. |

## Changes

| Area | Summary |
|---|---|
| current-state docs | Replaced accumulated narratives with bounded ownership-specific projections. |
| historical snapshots | Preserved pre-P1 Project State and Handoff under `docs/history/` and registered both as historical/never-default. |
| context routing | Clarified current-state ownership and historical read routing in the local context anchor. |
| tests | Added line-budget, section, ownership, and frozen-snapshot regressions. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Broader specs/archive cleanup remains P3 scope. | Deferred | P3 capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | Done | Compact state ownership, history routing, full validation, and governed toy dogfood completed. |
