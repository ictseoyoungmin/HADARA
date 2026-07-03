# T-0493 stable 0.4.0 release publication and README onboarding cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0493 |
| Title | stable 0.4.0 release publication and README onboarding cleanup |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Record public stable GitHub Release publication and clean up first-run docs. | Keep this capsule to release evidence, helper guidance, and README onboarding; defer docs command implementation to the next focused capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Record `v0.4.0` public release evidence, update release helper comments/output to show optional GitHub release handling, slim README release wording, and make install-to-first-capsule path prominent. |
| Out | Implementing `docs.complete-spec`, implementing `docs.mark-drift`, moving docs registry entries, broad docs directory reorganization, or changing runtime command behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Capture stable GitHub Release publication evidence. | Done |
| 2 | Update publish helper guidance for optional GitHub release creation/publication. | Done |
| 3 | Rewrite README top-level onboarding and release sections. | Done |
| 4 | Validate docs/script hygiene, record evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Public GitHub Release `v0.4.0` publication is recorded with verified metadata. | Met | `ev:T-0493:51ec29e0b0cb4c2aa2e5de85` | `gh release view v0.4.0` |
| AC-2 | Release helper guidance includes optional GitHub Release handling after npm publish. | Met | `ev:T-0493:3ce5a1fa0f7844bab1387bdf` | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |
| AC-3 | README prioritizes install, first project, and first capsule before release internals. | Met | `ev:T-0493:3ce5a1fa0f7844bab1387bdf` | `README.md` |
| AC-4 | Larger docs governance items are carried forward as explicit follow-ups. | Met | `ev:T-0493:3ce5a1fa0f7844bab1387bdf` | `Risks / Follow-ups` |
| AC-5 | Validation evidence is recorded. | Met | `ev:T-0493:5845abb5dc8f459394d4114b` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| GitHub Release publication evidence | Yes | Passed | `ev:T-0493:51ec29e0b0cb4c2aa2e5de85`, `ev:T-0493:3ce5a1fa0f7844bab1387bdf` |
| Shell syntax for release helpers | Yes | Passed | `ev:T-0493:3ce5a1fa0f7844bab1387bdf` |
| README/docs wording checks | Yes | Passed | `ev:T-0493:3ce5a1fa0f7844bab1387bdf` |
| Harness done validation | Yes | Passed | `ev:T-0493:5845abb5dc8f459394d4114b` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User-provided `gh release edit/view` output | implementation-source | implemented | Stable GitHub Release is public: `isDraft=false`, `isPrerelease=false`, tag `v0.4.0`. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | implemented | Operator-facing publish environment instructions. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | implemented | Approval-gated npm publish helper with optional GitHub draft creation. |
| `README.md` | implementation-source | implemented | Package-facing onboarding and release status. |
| `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md` | reference | implemented | Follow-up for completed spec routing lifecycle. |

## Changes

| Area | Summary |
|---|---|
| Release evidence | Recorded public GitHub Release `v0.4.0` publication evidence. |
| Helper docs | Added optional GitHub Release draft/publication guidance to release helper comments and output. |
| README | Moved install, first project, and first capsule paths ahead of release internals; added product docs for getting started and lifecycle quickstart. |
| Docs registry | Registered `docs/GETTING_STARTED.md` and `docs/LIFECYCLE_QUICKSTART.md` as linked workflow guides. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement `docs.complete-spec` as a real dry-run-first docs registry mutation command. | Open | `src/services/capability-registry.ts` |
| RF-2 | Follow-up | Implement `docs.mark-drift` as a real dry-run-first drift marker command. | Open | `src/services/capability-registry.ts` |
| RF-3 | Follow-up | Define Required Reading completed-spec lifecycle and move completed implementation specs from active routing to historical/reference discovery. | Open | `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md` |
| RF-4 | Follow-up | Split product docs from HADARA-dev internal docs so Getting Started and Lifecycle Quickstart are top-level product docs and internal contracts/audits sit under a lower-priority namespace. | Open | `docs/` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped public release evidence and onboarding cleanup; deferred docs governance command implementation to focused follow-ups. |
| 2026-07-03 | Done | Public release evidence, helper guidance, README onboarding, and product quickstart docs completed. |
