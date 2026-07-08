# T-0534 Remove post-0.4.1 dead command code

## Identity

| Field | Value |
|---|---|
| ID | T-0534 |
| Title | Remove post-0.4.1 dead command code |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove post-0.4.1 dead command code that no current CLI route or runtime consumer can reach. | Keep internal lifecycle engines and intentional compatibility fallbacks that current commands still consume. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove unreachable `run`/`run scaffold`/`harness replay` helper modules, removed lifecycle/handoff read-model modules, their dedicated tests, and now-orphaned schemas/registry docs. Prune stale `write-preflight` branches for removed `run-state` writes. |
| Out | Do not remove internal `task finish`/`task ready`/`task close`/audit modules used by `task finalize` and `task status`. Do not remove package-recycle legacy fallback unless current installed-package compatibility is separately retired. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm runtime reachability and identify deletion-only modules/schemas/tests. | Done |
| 2 | Delete unreachable command-era modules and schema registrations. | Done |
| 3 | Prune stale write-preflight command branches and update tests/docs. | Done |
| 4 | Run focused validation, TypeScript build, and Docker sync-build/dist refresh. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Removed command-era modules and schemas are no longer present in `src`, current schema registry, or current schema docs. | Done | `ev:T-0534:789939b9673a4264bb11d66a` | runtime reachability review |
| AC-2 | `write-preflight` no longer reports deferred `run-state.*` write commands. | Done | `ev:T-0534:abd346f178d34b4bb882c5df` | `src/services/write-preflight.ts` |
| AC-3 | Focused tests and build pass after deletion. | Done | `ev:T-0534:abd346f178d34b4bb882c5df`, `ev:T-0534:d6b630ef20dd46ceb070296e` | validation |
| AC-4 | Docker sync-build refreshes `dist` from the updated source. | Done | `ev:T-0534:c2c5e5b36ec9464f9a6c9dc8`, `ev:T-0534:789939b9673a4264bb11d66a` | validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused dead-code cleanup tests | Yes | Passed | ev:T-0534:abd346f178d34b4bb882c5df |
| TypeScript build | Yes | Passed | ev:T-0534:d6b630ef20dd46ceb070296e |
| Docker sync-build | Yes | Passed | ev:T-0534:c2c5e5b36ec9464f9a6c9dc8 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Confirms low-level lifecycle public surfaces are removed while internal finalize engines remain. |
| `docs/PROJECT_STATE.md` | reference | active | T-0532 states which removed surfaces still had internal services left for current consumers/tests. |
| `src/cli/main.ts` | reference | active | Current routing source for public command reachability. |
| `src/core/schema.ts` | reference | active | Current schema registration source. |

## Changes

| Area | Summary |
|---|---|
| Dead code | Removed unreachable `run`, `run scaffold`, `harness replay`, handoff suggestion, lifecycle convenience, task complete flow, and close repair plan modules with their dedicated tests and schemas. |
| Schema registry | Removed orphaned schema imports, schema-index rows, schema fixture expectations, and current `docs/SCHEMAS.md` rows for the deleted report shapes. |
| Write preflight | Removed stale deferred `run-state.*` write preflight handling and schema enum values. |
| Dist sync | Changed Docker sync-build and dev docker-check dist sync scripts to replace workspace `dist` before copying Docker-built output so deleted compiled files cannot remain. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Revisit package-recycle legacy `task lifecycle` fallback only after deciding older installed package compatibility policy. | Open | `src/services/package-recycle.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Removed dead command-era code and validated focused tests/build/Docker sync-build. |
