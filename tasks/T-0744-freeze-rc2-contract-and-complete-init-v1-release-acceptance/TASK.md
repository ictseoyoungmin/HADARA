# T-0744 Freeze RC2 contract and complete Init v1 release acceptance

## Identity

| Field | Value |
|---|---|
| ID | T-0744 |
| Title | Freeze RC2 contract and complete Init v1 release acceptance |
| Status | Draft |
| Created | 2026-08-01T19:10 |
| Updated | 2026-08-01T19:10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Freeze the RC2 contract and close the missed Init v1/release acceptance work. | Long-lived release/package smoke contracts live under release-readiness ownership; Init v1 stages 6~8 have explicit implementation and installed-dogfood evidence; RC2 readiness is declared only after all gates pass. |

## Scope

| Boundary | Items |
|---|---|
| In | Move package/clean-checkout smoke contracts and release observations out of development-slice ordering prose into owned release/dev docs. |
| In | Remove stale RC1 artifact/run references and refresh roadmap, release notes, package metadata, and release-readiness records for RC2. |
| In | Complete and evidence Init v1 stages 6 Document Routing, 7 Legacy Compatibility Isolation, and 8 Full Acceptance and Installed Dogfood. |
| In | Validate docs registry JSON/schema/render projections and confirm retired state-document paths are absent from active projections. |
| In | Record an explicit RC2 contract freeze and installed package acceptance gate. |
| Out | Status/close runtime refactors owned by T-0743. |
| Out | New close features, new schemas, provider publication, and unrelated roadmap expansion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reconcile the archived Init v1 authority and implementation map against T-0699 through T-0706, then record the stage 6~8 verification boundary without reopening completed runtime work. | In Progress |
| 2 | Keep `docs/DEVELOPMENT_SLICES.md` limited to slice order/status, move release/package smoke ownership to release/dev documentation, and refresh active RC2 metadata. | Pending |
| 3 | Add the RC2 contract-freeze record and repository docs-registry regression coverage for schema/parse/render and retired state-document exclusion. | Pending |
| 4 | Run source/built/installed Init v1 acceptance, release gate/dry-run, package and clean-checkout smokes, then close the capsule with proof-last evidence. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `DEVELOPMENT_SLICES.md` contains slice order/status only; release/package smoke contracts, remote observations, and ephemeral artifact identifiers are owned by `docs/RELEASE_READINESS.md` or a repo-local developer-surface doc. | Pending | Not yet recorded | `docs/DEVELOPMENT_SLICES.md`; `docs/RELEASE_READINESS.md` |
| AC-2 | Active roadmap, release notes, package metadata, and release-readiness docs identify `0.5.0-rc.2` as the current source target, retain RC1 only as historical context, and contain no stale active RC1 artifact/run claim. | Pending | Not yet recorded | `docs/ROADMAP.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md`; `package.json` |
| AC-3 | Init v1 stages 6 Document Routing and 7 Legacy Compatibility Isolation are verified against the implementation map, current docs routing, and compatibility-boundary tests without reintroducing retired global state documents. | Pending | Not yet recorded | Archived Init v1 map; docs registry; legacy-boundary tests |
| AC-4 | Init v1 stage 8 Full Acceptance and Installed Dogfood passes source/built CLI, package/consumer, clean-checkout, docs registry/schema/render, and installed lifecycle acceptance. | Pending | Not yet recorded | Validation and release-smoke evidence |
| AC-5 | A tracked RC2 contract-freeze record states that T-0743 is the final close/status runtime scope, no new schema/provider/public release mutation is included, and current release gate/dry-run pass. | Pending | Not yet recorded | `docs/RC2_CONTRACT_FREEZE.md`; release readiness reports |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Docs registry parse/schema/render | Yes | Planned | Parse the repository registry, validate its registered report/schema, compare the rendered projection, and assert retired paths are absent. | Pending |
| Release/readiness metadata audit | Yes | Planned | Audit active RC2 version/claims, slice ownership, contract-freeze scope, and stale RC1 observations. | Pending |
| Init v1 installed dogfood | Yes | Planned | Run source/built CLI checks plus isolated package/consumer and clean-checkout acceptance for Init v1 lifecycle/routing. | Pending |
| Release dry-run and RC2 gate | Yes | Planned | Run strict release gate and read-only release dry-run against the current checkout; no publish or registry mutation. | Pending |
| Docs registry and Init v1 routing focused tests | Yes | Passed | exit 0 in 9379ms | ev:T-0744:e48bb4bc80294487bf81a8a2 |
| Docs registry parse schema render and retired path audit | Yes | Passed | exit 0 in 37ms | ev:T-0744:1e67969cd7af4e3b81d83542 |
| RC2 active metadata and ownership audit | Yes | Passed | exit 0 in 45ms | ev:T-0744:a06194bb2d0f42459f9383b6 |
| Full npm check and built RC2 version | Yes | Passed | exit 0 in 36305ms | ev:T-0744:8d9b7b4bf9cb41ee88a22a35 |
| Host package consumer smoke | Yes | Passed | exit 0 in 3266ms | ev:T-0744:9010215284804dc1b03951ae |
| Host clean-checkout smoke | Yes | Failed | exit 6 in 69093ms | ev:T-0744:96b587018dc147bea5265668 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/DEVELOPMENT_SLICES.md` | constraint | active | Slice order/status only; no release observation log. |
| `docs/RELEASE_READINESS.md` | reference | active | Release/package smoke and RC2 readiness ownership. |
| `docs/ROADMAP.md` and `docs/RELEASE_NOTES.md` | reference | active | Current release scope and historical notes. |
| Init v1 implementation map and archived freeze specs | implementation-source | active | Reconcile the missing stages without treating archive as default session reading. |
| `docs/DOC_REGISTRY.md` and `.hadara/docs-registry.json` | reference | active | Parse/render and retired-path projection checks. |

## Changes

| Area | Summary |
|---|---|
| Release/docs ownership | Pending | Development slices retain ordering/status; release/package smoke contracts and observations are owned by release-readiness/developer-surface documentation. |
| Init v1 acceptance | Pending | Stages 6~8 are reconciled to T-0698 and T-0699~T-0706, then installed-dogfooded and evidenced without reopening runtime scope. |
| RC2 freeze | Pending | Contract freeze and readiness are recorded only after all acceptance gates pass; no publish mutation is part of this capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Moving historical release observations may create broken links or lose provenance. | Open | Preserve evidence/task artifacts; move only long-lived contract prose. |
| RF-2 | Risk | Init v1 stage gaps may overlap with retired compatibility work. | Open | Keep stage boundaries explicit and do not restore removed global state documents. |
Not started. RC2 readiness must not be declared until docs ownership, Init v1 stages 6~8, installed acceptance, and release dry-run all pass.
## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | Draft | Split from the RC2 follow-up set: release/docs ownership, Init v1 stages 6~8, and contract freeze. |
| 2026-08-01 | In Progress | Authored the verifiable RC2 acceptance contract and began reconciling the archived Init v1 map with current release ownership. |
