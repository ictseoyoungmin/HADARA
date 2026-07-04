# T-0496 remove handoff update command

## Identity

| Field | Value |
|---|---|
| ID | T-0496 |
| Title | remove handoff update command |
| Status | Done |
| Created | 2026-07-05 |
| Updated | 2026-07-05 |

## Goal

| Goal | Notes |
|---|---|
| Remove the broken `handoff update` write command before `0.4.1-rc.0`. | Keep `handoff suggest` as the read-only aid; shared handoff edits remain reviewed documentation work before finalize. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove `handoff.update` from CLI routing, command registry, write-preflight, primary lifecycle/help, current docs, and tests. |
| Out | New managed-section patch writer for `docs/AGENT_HANDOFF.md`; broad historical spec rewrites. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Remove the executable command surface while preserving `handoff suggest`. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `handoff update` is no longer routed, registered, shown in primary lifecycle help, or recognized by write-preflight. | Met | `ev:T-0496:6254f6d51840411d97982927`, `ev:T-0496:2805daa8175e40c2beff3283` | Stable 0.4.0 dogfood feedback / FD-007 |
| AC-2 | `handoff suggest` remains available and read-only. | Met | `ev:T-0496:6254f6d51840411d97982927`, `ev:T-0496:2805daa8175e40c2beff3283` | `docs/CLI_JSON_CONTRACT.md` |
| AC-3 | Validation evidence is recorded. | Met | `ev:T-0496:6254f6d51840411d97982927`, `ev:T-0496:87aff8ebc8b84437a567dec5`, `ev:T-0496:2805daa8175e40c2beff3283` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused handoff/registry/help/write-preflight tests | Yes | Passed | `ev:T-0496:6254f6d51840411d97982927` |
| TypeScript build | Yes | Passed | `ev:T-0496:87aff8ebc8b84437a567dec5` |
| Built CLI smoke | Yes | Passed | `ev:T-0496:2805daa8175e40c2beff3283` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | reference | approved | FD-007 records stable 0.4.0 handoff friction. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | approved | Current lifecycle loop should stay status/finalize first. |
| `docs/COMMAND_SURFACE.md` | constraint | approved | Registry-backed command surface docs must align with code. |

## Changes

| Area | Summary |
|---|---|
| CLI routing | Removed `handoff update` handling; `handoff suggest` and `handoff stale-problems` remain. |
| Registry/help/lifecycle | Removed `handoff.update` from public registry and primary lifecycle path. |
| Write preflight | Removed `handoff.update` as a supported preflight target. |
| Tests/docs | Updated current tests and operational docs for the removed write surface. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | A future guarded handoff patch command can be designed separately if there is still demand. | Open | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-05 | Draft | Initial task scaffold. |
| 2026-07-05 | In Progress | Removing the broken handoff shared-doc write command. |
| 2026-07-05 | Done | Removed the command surface and recorded validation evidence. |
