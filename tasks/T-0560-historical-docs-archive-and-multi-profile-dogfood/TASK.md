# T-0560 Historical docs archive and multi-profile dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0560 |
| Title | Historical docs archive and multi-profile dogfood |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Separate completed/stale planning material from current specs and validate HADARA's primary workflow across all scaffold profiles. | Preserve historical source text under `docs/archive/`, reduce active-looking docs noise, and produce a basic/standard/governed dogfood matrix. |

## Scope

| Boundary | Items |
|---|---|
| In | Archive old versioned/unregistered specs and root historical logs; update registry/current links; archive index and regression checks; basic/standard/governed temp-project dogfood; full validation. |
| Out | Deleting historical source content, changing active 0.4.1 scope or 0.5 RFC semantics, new public commands, release/provider/runtime mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inventory current vs historical docs and define the archive boundary/map. | Done |
| 2 | Move completed/stale material, update registry/links, and add archive regressions. | Done |
| 3 | Run basic/standard/governed disposable lifecycle dogfood. | Done |
| 4 | Run docs doctor, focused/full validation, record evidence, and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docs/specs/` retains only current active/future spec lines while older material is preserved under `docs/archive/specs/`. | Met | ev:T-0560:fe28198bab0640608e906b9e | archive inventory/test |
| AC-2 | `docs doctor` reports zero unregistered active-looking documents and zero currentness issues. | Met | ev:T-0560:87f2998b851445bbaf91fe99 | docs doctor |
| AC-3 | Basic, standard, and governed temp projects each exercise init/status/create/validation/finalize and reach `closed-valid`. | Met | ev:T-0560:421bacf7fa7f4a3185d4ad9c | multi-profile dogfood matrix |
| AC-4 | Registry paths, current historical indexes, focused tests, and full Docker validation remain consistent. | Met | ev:T-0560:fe28198bab0640608e906b9e, ev:T-0560:a9119e06127c423e93a5b5c0 | tests/full validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Archive boundary/docs doctor | Yes | Passed | ev:T-0560:87f2998b851445bbaf91fe99 |
| Multi-profile dogfood matrix | Yes | Passed | ev:T-0560:421bacf7fa7f4a3185d4ad9c |
| Archive regressions | Yes | Passed | ev:T-0560:fe28198bab0640608e906b9e |
| Full Docker sync-build | Yes | Passed | ev:T-0560:a9119e06127c423e93a5b5c0 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request 2026-07-10 | constraint | active | Move stale/unneeded docs to a separate folder and test toy projects after each P stage. |
| .hadara/docs-registry.json | implementation-source | active | Registered path, status, and read-tier authority. |
| docs/PROJECT_STATE.md | implementation-source | active | Current historical index ownership. |
| docs/AGENT_HANDOFF.md | implementation-source | active | Continuity historical index ownership. |
| docs/PRIMARY_WORKFLOW_BUDGET.md | reference | active | Reuse the measured lifecycle without adding a command. |

## Changes

| Area | Summary |
|---|---|
| committed archive | Moved tracked 0.3.x, 0.4.0, completed agent-UX/proof specs, and REFACTOR_LOG under `docs/archive/` with Git history preserved. |
| local archive | Moved previously ignored/untracked planning and evaluation material out of active spec discovery while keeping it ignored and workspace-local. |
| routing | Reclassified all registered archive paths as historical/never-default, updated command/doc links, and added a path map. |
| docs doctor | Suppressed redundant archive-candidate warnings for documents already under `docs/archive/` or `docs/history/`. |
| dogfood | Basic, standard, and governed temp projects each completed the six-invocation path and healthy docs doctor. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Historical Task Capsules may retain pre-archive path text. | Closed | `docs/archive/README.md` preserves the compatibility map; active registry/docs links were updated. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | Done | Historical archive, zero-noise docs routing, multi-profile dogfood, and full validation completed. |
