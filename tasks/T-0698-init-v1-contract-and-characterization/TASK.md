# T-0698 Init v1 Contract and Characterization

## Identity

| Field | Value |
|---|---|
| ID | T-0698 |
| Title | Init v1 Contract and Characterization |
| Status | Done |
| Created | 2026-07-24T20:11 |
| Updated | 2026-07-24T20:30 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Freeze the repository-local Init v1 implementation contract and characterize the current implementation against it. | Produce an evidence-backed implementation map that later capsules can execute without reinterpreting the two source specifications. |

## Scope

| Boundary | Items |
|---|---|
| In | Add the two Init v1 source specifications; inventory current init/profile/scaffold/adoption/upgrade, Task Board, close projection, document registry/routing, schema, CLI, and package behavior; map every acceptance area to an ordered implementation capsule; record baseline characterization evidence. |
| Out | Production Init v1 behavior changes; schema/planner implementation; filesystem apply changes; Task Board migration; document-routing migration; legacy field mapping; publish or release mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read the frozen design and acceptance contracts plus current architecture, security, roadmap, schema, workflow, and validation constraints. | Done |
| 2 | Trace current init and adjacent lifecycle/routing implementations and tests; capture observable legacy behavior and safety guarantees. | Done |
| 3 | Write a requirement-to-code and requirement-to-capsule implementation map with no more than 100 total capsules. | Done |
| 4 | Run focused characterization/static checks, record evidence, and update shared state/handoff documents. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Both Init v1 source specifications are tracked unchanged as the implementation authority. | Met | Source hashes captured by coverage audit. | `HADARA-INIT-SPEC-V1`; `HADARA-INIT-V1-ACCEPTANCE` |
| AC-2 | Every acceptance area A-S, E2E, REG, and NF is mapped to current code/tests and an ordered implementation capsule. | Met | `ev:T-0698:e50ddbf7c32d4b9dbf549607` | `HADARA-INIT-V1-ACCEPTANCE` |
| AC-3 | Current legacy profile/scaffold/report behavior and preserved safety guarantees are characterized with reproducible checks. | Met | `ev:T-0698:224dd481d6f441f5b5b8527e`; `ev:T-0698:c0674d3596854c7c9aa8bcce` | INIT-M1 |
| AC-4 | The implementation sequence uses appropriately sized capsules and remains below the user's 100-capsule maximum. | Met | Eight-capsule program in `INIT_V1_IMPLEMENTATION_MAP.md`. | User instruction; INIT-M0-M7 |
| AC-5 | Validation evidence is recorded and the capsule is close-ready. | Met | `ev:T-0698:69fd006597b242c3af3a06d1` | `docs/TASK_WORKFLOW_COMMANDS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current init focused tests | Yes | Passed | ev:T-0698:c0674d3596854c7c9aa8bcce |
| Built CLI characterization smokes | Yes | Passed | ev:T-0698:224dd481d6f441f5b5b8527e |
| Requirement and capsule coverage audit | Yes | Passed | ev:T-0698:e50ddbf7c32d4b9dbf549607 |
| Full repository Docker check | Yes | Passed | ev:T-0698:69fd006597b242c3af3a06d1 |
| Dist refresh | No | Not Applicable | No compiled source changed in this contract/characterization capsule. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | decision | active | Frozen product/design authority, including INIT-M0-M7. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | constraint | active | Frozen P0/P1/P2, E2E, regression, and release-gate contract. |
| `docs/ARCHITECTURE.md` | reference | active | Local-first/project-store and runtime boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | Root containment, non-destructive behavior, and data boundaries. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker-first check, dist refresh, and installed-package expectations. |
| `docs/SCHEMAS.md` | reference | active | Fixture registry and runtime validation posture. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Evidence and proof-last close contract. |

## Changes

| Area | Summary |
|---|---|
| Contract | Added the complete Init v1 design and frozen acceptance sources unchanged. |
| Characterization | Recorded current profile-based scaffold, immediate JSON writes, unknown-option write regression, adjacent lifecycle/routing boundaries, and reusable safety guarantees. |
| Program | Added `INIT_V1_IMPLEMENTATION_MAP.md` assigning every acceptance area to eight total ordered capsules. |
| Shared state | Updated project state, roadmap, decisions, development slices, and handoff for the active Init v1 program. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Current 0.5.x init and adjacent docs registry/Task Board contracts differ materially from Init v1; later capsules must preserve compatibility only where the frozen spec allows it. | Mitigated | `INIT_V1_IMPLEMENTATION_MAP.md` |
| RF-2 | Follow-up | Full legacy field mapping is explicitly owned by a separate, not-yet-frozen migration spec; this program implements only the legacy isolation and migration boundary required by the current acceptance contract. | Deferred | OPEN-LEGACY-01 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-24 | Draft | Initial task scaffold. |
| 2026-07-24 | Done | Adopted the Init v1 contracts, characterized the legacy baseline, mapped eight capsules, and passed focused/static/full validation. |
