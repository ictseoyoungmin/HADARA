# T-0759 Prepare RC3 Release Readiness

## Identity

| Field | Value |
|---|---|
| ID | T-0759 |
| Title | Prepare RC3 Release Readiness |
| Status | Done |
| Created | 2026-08-09T20:29 |
| Updated | 2026-08-09T20:51 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare and validate the `0.5.0-rc.3` release input through exact-artifact provenance and all pre-operator readiness gates. | Publish, GitHub mutation, and installed consumer recycle remain outside this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | RC3 version/readiness metadata, release note, clean-source artifact, checksum/manifest, exact tarball package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and operator handoff. |
| Out | npm publish, GitHub Release create/edit/upload, public registry recycle, and post-publish consumer validation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define RC3 pre-operator release readiness and artifact retention contract. | Done |
| 2 | Generate exact artifact and run package/clean-checkout readiness gates. | Done |
| 3 | Run strict/dry-run checks and prepare operator handoff. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata, readiness docs, and capsule release note target `0.5.0-rc.3` without mutating immutable RC2 records. | Met | ev:T-0759:092928efda32439cb45e64d8; ev:T-0759:086f25b9c72549ce95ed7cad | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-2 | A clean source produces a release tarball, checksum, and manifest with reduced public artifact evidence and no committed binary. | Met | ev:T-0759:f9047cd174ba4e3ea5f41cb4; ev:T-0759:aa633b0974f14e9e99e058e2 | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-3 | Package smoke installs and validates the exact release tarball; package smoke and artifact SHA-256 values are equal. | Met | ev:T-0759:717267fa342b48d59a8f78f8; ev:T-0759:aa633b0974f14e9e99e058e2 | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-4 | Clean-checkout smoke and full repository validation pass. | Met | ev:T-0759:c3e4832a18bd466ab9153343; ev:T-0759:092928efda32439cb45e64d8 | Validation table |
| AC-5 | Strict release gate, release dry-run, and publish dry-run pass without external mutation. | Met | ev:T-0759:086f25b9c72549ce95ed7cad; ev:T-0759:67c2e7f7e76d4249a08feb10 | Validation table |
| AC-6 | GitHub release note and operator-only publish/recycle handoff are present. | Met | `ev:T-0759:520bb34a361245e487771ec8`; `GITHUB_RELEASE_NOTE.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | `GITHUB_RELEASE_NOTE.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Full npm check | Yes | Passed | exit 0 in 63975ms | ev:T-0759:092928efda32439cb45e64d8 |
| Exact artifact and package smoke | Yes | Passed | Clean source artifact and exact tarball package smoke passed with SHA-256 provenance equality; no publish/release mutation executed. | ev:T-0759:aa633b0974f14e9e99e058e2 |
| Clean-checkout smoke | Yes | Passed | exit 0 in 77187ms | ev:T-0759:c3e4832a18bd466ab9153343 |
| Strict release gate | Yes | Passed | exit 0 in 1206ms | ev:T-0759:086f25b9c72549ce95ed7cad |
| Release dry-run and publish dry-run | Yes | Passed | exit 0 in 3006ms | ev:T-0759:67c2e7f7e76d4249a08feb10 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | RC3 release input, provenance, retention, and no-mutation boundary. |
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | RC2 remains immutable; current source is RC3. |
| `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | implementation-source | active | Current RC3 readiness contract. |

## Changes

| Area | Summary |
|---|---|
| Readiness contract | Defined exact artifact, provenance, disposable consumer, strict gate, and operator boundary. |
| Release source | Added RC3 readiness metadata line, capsule release note, and operator-only publish/recycle instructions. |
| Consumer fixture | Migrated host-only dogfooding fixture from retired `harness validate` to `validation run` and current task-status v2. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publish exact retained artifact, verify public npm next, attach GitHub assets, and recycle installed consumer. | Open | T-0760 operator capsule |

## Close Summary

All pre-operator release readiness gates passed. The exact artifact remains disposable in this workspace and must be retained by the operator until secondary uploads complete.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined RC3 pre-operator release readiness and exact-artifact provenance boundary. |
| 2026-08-09 | Ready for close | Full check, exact artifact/package provenance, clean-checkout, strict gate, and dry-runs passed. |
| 2026-08-09 | Done | Close-source documents prepared for reviewed proof-last execution; publish and recycle remain operator work. |
