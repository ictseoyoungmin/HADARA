# T-0784 Harden release identity retained artifact publication and projection consistency

## Identity

| Field | Value |
|---|---|
| ID | T-0784 |
| Title | Harden release identity retained artifact publication and projection consistency |
| Status | Done |
| Created | 2026-08-12T20:20 |
| Updated | 2026-08-12T11:38Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make release compatibility hash-based and make operator publication consume only retained exact bytes, while aligning evidence residual projection and command-owned timestamps. | No npm, GitHub, Docker, or public consumer mutation. Any RC6 artifact generated before this capsule is invalidated and must be regenerated later. |

## Scope

| Boundary | Items |
|---|---|
| In | release current-state lineage/schema; manual-publish-rc.sh; prepare-publish-env.sh; evidence residual projection; task timestamp generation; focused regression tests; RC6 hardening spec. |
| Out | RC6 artifact regeneration, npm/GitHub publication, public recycle, stable promotion, and edits to closed T-0783 close-source docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Freeze the RC6 release identity, retained-input, projection, timestamp, and capsule-budget contract. | Done |
| 2 | Implement runtime/schema/helper changes with focused regression coverage. | Done |
| 3 | Run Docker validation, record evidence, and close with a publication-ready handoff. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `release current-state` uses matching `releaseInputHash` as stable compatibility identity; differing HEAD/operator commits do not block a matching publication, while hash mismatch or missing hash fails closed. | Met | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 | release identity |
| AC-2 | Operator publication lineage records artifact source commit, release input hash, and operator commit; schema and typed report validation preserve legacy readability without granting legacy stable compatibility. | Met | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 | publication schema |
| AC-3 | `manual-publish-rc.sh` and `prepare-publish-env.sh` support retained-input mode that validates and publishes the exact supplied tarball/checksum/manifest without invoking artifact regeneration. | Met | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 | release scripts |
| AC-4 | Evidence residual projection uses the same resolution semantics as close readiness, including documented residual-risk mitigation. | Met | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 | evidence projection |
| AC-5 | Task/HANDOFF command-owned timestamps use one explicit timezone format across host and Docker execution. | Met | ev:T-0784:e4f7cf3b2988407da6429ac9 | timestamp contract |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused release identity/current-state tests | Yes | Passed | Hash-based current-state projection and publication lineage regression suite passed. | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 |
| Retained-input helper script tests | Yes | Passed | Shell syntax and retained-input branch/lineage contract tests passed. | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 |
| Evidence projection residual tests | Yes | Passed | Projection and close semantics agree for documented mitigated failures. | ev:T-0784:3b1ba27d4ba349b6b83a6fe6 |
| Timestamp generation/validation tests | Yes | Passed | UTC `Z` timestamp generation and validation tests passed. | ev:T-0784:e4f7cf3b2988407da6429ac9 |
| Docker build and focused/full tests | Yes | Passed | Docker build, tools typecheck, and 131-file/1063-test suite passed. | ev:T-0784:e4f7cf3b2988407da6429ac9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` | design | active | Existing RC6 lifecycle/evidence/currentness contract. |
| `docs/specs/0.5.0-rc6/01_RELEASE_IDENTITY_AND_RETAINED_ARTIFACT_PUBLICATION_HARDENING.md` | design | active | This capsule's normative release identity and script contract. |
| `tools/dev-surface/release-current-state.ts` | implementation-source | active | Current source-commit binding to replace. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Current artifact-regenerating operator helper. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Operator environment handoff. |
| `src/evidence/evidence.ts` and `src/evidence/semantics.ts` | implementation-source | active | Projection/close resolution alignment. |

## Changes

| Area | Summary |
|---|---|
| Release identity | Replace HEAD equality with release-input hash compatibility and typed publication lineage. |
| Publication scripts | Add retained-input mode and pass exact artifact locator through preparation. |
| Evidence projection | Share residual resolution semantics with close readiness. |
| Timestamp contract | Use explicit UTC command-owned timestamps and update validation/tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC6 artifact/readiness must be regenerated after this source change before publication. | Deferred | RC6 capsule budget in active spec. |
| RF-2 | Risk | Retained artifact actual bytes remain operator-local until the publication capsule. | Open | Require checksum/manifest/journal validation before mutation. |

## Close Summary

Implemented and validated the release identity, retained-input publication, projection consistency, and UTC timestamp hardening. No npm, GitHub, Docker image, or public consumer mutation was performed. The prior unpublished RC6 artifact remains invalidated and must be regenerated in T-0785.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Scope fixed to hash-based release identity, retained-input publication, projection consistency, explicit UTC timestamps, and no external mutation. |
| 2026-08-12 | Validated | Runtime/schema/scripts/docs changes implemented; Docker build, tools typecheck, and full test suite passed. |
| 2026-08-12 | Done | Capsule prose and evidence are complete; proof-last close is ready. |
