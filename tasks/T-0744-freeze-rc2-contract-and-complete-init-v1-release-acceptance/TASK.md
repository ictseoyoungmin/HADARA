# T-0744 Freeze RC2 contract and complete Init v1 release acceptance

## Identity

| Field | Value |
|---|---|
| ID | T-0744 |
| Title | Freeze RC2 contract and complete Init v1 release acceptance |
| Status | Done |
| Created | 2026-08-01T19:10 |
| Updated | 2026-08-01T20:23 |

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
| 1 | Reconcile the archived Init v1 authority and implementation map against T-0699 through T-0706, then record the stage 6~8 verification boundary without reopening completed runtime work. | Done |
| 2 | Keep `docs/DEVELOPMENT_SLICES.md` limited to slice order/status, move release/package smoke ownership to release/dev documentation, and refresh active RC2 metadata. | Done |
| 3 | Add the RC2 contract-freeze record and repository docs-registry regression coverage for schema/parse/render and retired state-document exclusion. | Done |
| 4 | Run source/built/installed Init v1 acceptance, release gate/dry-run, package and clean-checkout smokes, then close the capsule with proof-last evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `DEVELOPMENT_SLICES.md` contains slice order/status only; release/package smoke contracts, remote observations, and ephemeral artifact identifiers are owned by `docs/RELEASE_READINESS.md` or a repo-local developer-surface doc. | Met | Ownership and stale-observation audit passed; `ev:T-0744:a06194bb2d0f42459f9383b6`, `ev:T-0744:2bcf7595723148c88a04f24e`. | `docs/DEVELOPMENT_SLICES.md`; `docs/RELEASE_READINESS.md` |
| AC-2 | Active roadmap, release notes, package metadata, and release-readiness docs identify `0.5.0-rc.2` as the current source target, retain RC1 only as historical context, and contain no stale active RC1 artifact/run claim. | Met | Active RC2 metadata and ownership audit passed; `ev:T-0744:a06194bb2d0f42459f9383b6`. | `docs/ROADMAP.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md`; `package.json` |
| AC-3 | Init v1 stages 6 Document Routing and 7 Legacy Compatibility Isolation are verified against the implementation map, current docs routing, and compatibility-boundary tests without reintroducing retired global state documents. | Met | Focused Init v1/docs/legacy tests and repository registry projection audit passed; `ev:T-0744:e48bb4bc80294487bf81a8a2`, `ev:T-0744:1e67969cd7af4e3b81d83542`, `ev:T-0744:2bcf7595723148c88a04f24e`. | Archived Init v1 map; docs registry; legacy-boundary tests |
| AC-4 | Init v1 stage 8 Full Acceptance and Installed Dogfood passes source/built CLI, package/consumer, clean-checkout, docs registry/schema/render, and installed lifecycle acceptance. | Met | Full check, host package smoke, clean-checkout smoke, and installed RC2 lifecycle acceptance passed; `ev:T-0744:8d9b7b4bf9cb41ee88a22a35`, `ev:T-0744:9010215284804dc1b03951ae`, `ev:T-0744:3085f4bbea034fefb5dd7733`, `ev:T-0744:6b5c746baa4642ffbe6465ac`. | Validation and release-smoke evidence |
| AC-5 | A tracked RC2 contract-freeze record states that T-0743 is the final close/status runtime scope, no new schema/provider/public release mutation is included, and current release gate/dry-run pass. | Met | RC2 freeze record, release artifact, and strict release dry-run passed; `ev:T-0744:b7dd0f5f97ca433f8d589f42`, `ev:T-0744:2495811725cc41f884e1c6ef`. | `docs/RC2_CONTRACT_FREEZE.md`; release readiness reports |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Docs registry parse/schema/render | Yes | Passed | Repository registry parsed, schema/render projection matched, and retired paths were absent; final resolution audit also resolved the earlier shell-quoting failure. | `ev:T-0744:1e67969cd7af4e3b81d83542`, `ev:T-0744:2bcf7595723148c88a04f24e` |
| Release/readiness metadata audit | Yes | Passed | Active RC2 metadata, slice ownership, freeze scope, and stale RC1 observation boundary passed. | `ev:T-0744:a06194bb2d0f42459f9383b6` |
| Init v1 installed dogfood | Yes | Passed | Source/built checks, isolated package/consumer and clean-checkout acceptance, and installed tarball lifecycle/routing passed. | `ev:T-0744:8d9b7b4bf9cb41ee88a22a35`, `ev:T-0744:9010215284804dc1b03951ae`, `ev:T-0744:3085f4bbea034fefb5dd7733`, `ev:T-0744:6b5c746baa4642ffbe6465ac` |
| Release dry-run and RC2 gate | Yes | Passed | Strict release gate and read-only release dry-run passed with no publish or registry mutation. | `ev:T-0744:b7dd0f5f97ca433f8d589f42`, `ev:T-0744:2495811725cc41f884e1c6ef` |
| Docs registry and Init v1 routing focused tests | Yes | Passed | exit 0 in 9379ms | ev:T-0744:e48bb4bc80294487bf81a8a2 |
| Docs registry parse schema render and retired path audit | Yes | Passed | exit 0 in 37ms | ev:T-0744:1e67969cd7af4e3b81d83542 |
| RC2 active metadata and ownership audit | Yes | Passed | exit 0 in 45ms | ev:T-0744:a06194bb2d0f42459f9383b6 |
| Full npm check and built RC2 version | Yes | Passed | exit 0 in 36305ms | ev:T-0744:8d9b7b4bf9cb41ee88a22a35 |
| Host package consumer smoke | Yes | Passed | exit 0 in 3266ms | ev:T-0744:9010215284804dc1b03951ae |
| Host clean-checkout smoke | Yes | Passed | exit 0 in 55762ms | ev:T-0744:3085f4bbea034fefb5dd7733 |
| Strict release gate and RC2 release dry-run | Yes | Passed | exit 0 in 920ms | ev:T-0744:2495811725cc41f884e1c6ef |
| Installed RC2 tarball lifecycle acceptance | Yes | Passed | exit 0 in 2254ms | ev:T-0744:6b5c746baa4642ffbe6465ac |
| Final RC2 projection and smoke resolution audit | Yes | Passed | exit 0 in 40ms | ev:T-0744:2bcf7595723148c88a04f24e |
| Installed RC2 tarball lifecycle acceptance resolution | Yes | Passed | exit 0 in 1959ms | ev:T-0744:5d44eb8835334739a69a96ff |

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
| Release/docs ownership | Implemented | Development slices retain ordering/status; release/package smoke contracts and observations are owned by release-readiness/developer-surface documentation. |
| Init v1 acceptance | Implemented | Stages 6~8 are reconciled to T-0698 and T-0699~T-0706, then installed-dogfooded and evidenced without reopening runtime scope. |
| RC2 freeze | Implemented | Contract freeze and readiness are recorded after all acceptance gates passed; no publish mutation is part of this capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Moving historical release observations may create broken links or lose provenance. | Closed | Historical provenance is retained in `docs/VALIDATION_HISTORY.md` and task-local public artifacts; long-lived contract prose is owned by release-readiness docs. |
| RF-2 | Risk | Init v1 stage gaps may overlap with retired compatibility work. | Closed | Stage 6~8 boundaries were verified without restoring removed global state documents or reopening runtime scope. |
RC2 readiness gates passed. No publish, GitHub Release, Docker publish, npm registry, or provider mutation was performed.
## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | Draft | Split from the RC2 follow-up set: release/docs ownership, Init v1 stages 6~8, and contract freeze. |
| 2026-08-01 | In Progress | Authored the verifiable RC2 acceptance contract and began reconciling the archived Init v1 map with current release ownership. |
| 2026-08-01 | Done | Completed docs ownership, RC2 metadata refresh, Init v1 stages 6~8 acceptance, package/clean-checkout/installed lifecycle validation, release artifact, strict gate, and read-only release dry-run. Earlier failed checks are retained and resolved by later evidence. |
