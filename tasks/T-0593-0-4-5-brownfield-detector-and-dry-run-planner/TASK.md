# T-0593 0.4.5 brownfield detector and dry-run planner

## Identity

| Field | Value |
|---|---|
| ID | T-0593 |
| Title | 0.4.5 brownfield detector and dry-run planner |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add a zero-write brownfield `hadara init` detector and dry-run adoption planner. | Existing repositories must receive a machine-readable adoption report instead of immediate scaffold writes. |

## Scope

| Boundary | Items |
|---|---|
| In | Repository-state classification, bounded signal scanning, zero-write adoption report, plan/snapshot hashes, execute blockers, schema fixture, focused tests, and `/tmp` dist CLI smoke. |
| Out | Managed-section merge execution, docs registry v3 writer adoption, broad filesystem scanning, and automatic brownfield mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define brownfield init detector and dry-run report contract. | Done |
| 2 | Implement bounded signal classification, planned path dispositions, schema fixture, and guarded execute blockers. | Done |
| 3 | Validate focused tests, build/Docker build, and dist CLI greenfield/brownfield smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Bare `hadara init --json` in an existing project returns `hadara.init.adoption.v1` with `writes: []` and does not create scaffold files. | Done | `ev:T-0593:63222e71054c4e07897d4ce9` | `src/init/adoption.ts`; `tests/unit/init.test.ts` |
| AC-2 | Greenfield init still creates the selected profile scaffold and does not create `tasks/.gitkeep`. | Done | `ev:T-0593:63222e71054c4e07897d4ce9` | `tests/unit/init.test.ts` |
| AC-3 | Brownfield execute requires a reviewed plan hash and stops with structured blockers until the managed writer capsule implements mutation. | Done | `ev:T-0593:63222e71054c4e07897d4ce9` | `src/init/adoption.ts`; `tests/unit/init.test.ts` |
| AC-4 | The adoption report has a registered schema fixture and command registry/help surface coverage. | Done | `ev:T-0593:8c278e4620644a8a87d755fc` | `src/schemas/init-adoption.schema.json`; `docs/SCHEMAS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused init/schema tests | Yes | Passed | `ev:T-0593:8c278e4620644a8a87d755fc` |
| Build and Docker build | Yes | Passed | `ev:T-0593:655db60d9d76487290d4a1b5` |
| Dist init adoption smoke | Yes | Passed | `ev:T-0593:63222e71054c4e07897d4ce9` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Safe brownfield adoption contract: classify existing repos and prevent default writes. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Adjacent 0.4.5 registry/init cleanup scope; managed writer remains out of this capsule. |
| Reviewer feedback in user prompt | constraint | active | Brownfield bare init must produce zero writes and return `hadara.init.adoption.v1`. |

## Changes

| Area | Summary |
|---|---|
| Init planner | Added bounded signal detection, repository classification, project metadata inference, path dispositions, snapshot hash, plan hash, and guarded execute blockers. |
| Init CLI | Routed existing repositories to the zero-write adoption report and surfaced `--adopt --execute --plan-hash`. |
| Schema/docs/tests | Added `hadara.init.adoption.v1`, schema registry/docs entries, command registry guidance, and focused init/schema tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Managed-section merge/writer execution remains for the next adoption capsule. | Open | T-0594 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | Done | Implemented and validated zero-write brownfield init detector and dry-run planner. |
