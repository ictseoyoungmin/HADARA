# T-0786 Harden publish destination and evidence fail-closed contracts

## Identity

| Field | Value |
|---|---|
| ID | T-0786 |
| Title | Harden publish destination and evidence fail-closed contracts |
| Status | Done |
| Created | 2026-08-12T12:58Z |
| Updated | 2026-08-12T13:12Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make the release operator destination, re-invocation, evidence disposition, and package inventory contracts fail closed and executable under test. | No RC6 artifact regeneration, npm/GitHub mutation, public recycle, or stable promotion. |

## Scope

| Boundary | Items |
|---|---|
| In | Custom registry propagation through prepare/dry-run/execute; structured negative-evidence resolution; execute reinvoke guidance; fake npm/gh execute integration; canonical package distribution inventory. |
| Out | RC6 artifact regeneration, npm/GitHub/public mutation, public consumer recycle, stable promotion, and edits to closed T-0785 close-source docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Freeze the reviewer findings into the RC6 release/operator/evidence contract. | Done |
| 2 | Implement destination propagation, structured dispositions, reinvoke fixes, and canonical package inventory. | Done |
| 3 | Validate fake npm/gh execute paths, Docker tests, evidence, and proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Custom registry is preserved from prepare through helper dry-run, execute reinvocation, npm calls, and operator publication report. | Met | `ev:T-0786:d75da49f122c46679655bff5` | release scripts |
| AC-2 | Negative evidence resolves only through exact evidence markers, legacy compatibility, or a structured Risks row with exact evidence link and allowed state; negated prose never resolves. | Met | `ev:T-0786:fcdf111cc196421ab7f70ccc` | evidence semantics |
| AC-3 | The first dry-run publish reinvocation includes `--execute` and preserves registry, retained artifact, report, note, tag, and draft arguments. | Met | `ev:T-0786:d75da49f122c46679655bff5` | manual publish helper |
| AC-4 | Fake npm/gh execute integration verifies real execute and GitHub draft branches and proves retained mode never invokes artifact regeneration. | Met | `ev:T-0786:d75da49f122c46679655bff5` | integration regression |
| AC-5 | Package distribution required files, allowed roots, and staging copy derive from one canonical package inventory. | Met | `ev:T-0786:e26907d96b0f4b51aa1d2085` | release input/artifact builder |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused registry, evidence, reinvoke, and inventory tests | Yes | Passed | Destination propagation, structured disposition, execute guidance, and canonical inventory. | `ev:T-0786:e26907d96b0f4b51aa1d2085`, `ev:T-0786:fcdf111cc196421ab7f70ccc` |
| Fake npm/gh execute integration | Yes | Passed | Execute and GitHub draft paths with retained bytes and regeneration guard. | `ev:T-0786:d75da49f122c46679655bff5` |
| Docker build, tools typecheck, and full tests | Yes | Passed | Built CLI and repository regression suite: 131 files, 1066 tests. | `ev:T-0786:e26907d96b0f4b51aa1d2085` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/01_RELEASE_IDENTITY_AND_RETAINED_ARTIFACT_PUBLICATION_HARDENING.md` | design | active | RC6 capsule order and retained publication contract. |
| Reviewer findings attached to this task | reference | active | Registry propagation, evidence fail-closed, integration, and inventory findings. |
| `scripts/release/prepare-publish-env.sh` and `scripts/release/manual-publish-rc.sh` | implementation-source | active | Operator destination and re-invocation boundary. |
| `src/evidence/semantics.ts` and `src/evidence/task-docs.ts` | implementation-source | active | Shared evidence resolution boundary. |

## Changes

| Area | Summary |
|---|---|
| Operator destination | Registry is explicit and preserved across all helper paths. |
| Evidence semantics | Structured Risks rows are authoritative; negated prose cannot resolve failures. |
| Package inventory | Artifact builder derives required/allowed/staged package paths from one manifest. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC6 exact artifact/readiness must be regenerated after T-0786. | Deferred | Next RC6 regeneration capsule |
| RF-2 | Risk | No external registry, GitHub, package, or public-consumer mutation is allowed in T-0786. | Closed | Capsule scope |

## Close Summary

T-0786 hardened the release operator destination and re-invocation contract, made negative evidence resolution structured and fail-closed, added fake npm/gh execute coverage for retained publication paths, and centralized the package distribution inventory. Docker build, tools typecheck, focused checks, and the full suite passed. No external publication or public-consumer mutation was performed; RC6 regeneration remains the next capsule.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Reclassified as the pre-regeneration hardening capsule for reviewer findings. |
| 2026-08-12 | Ready to close | Implementation, validation, evidence, and close-time documentation completed. |
| 2026-08-12 | Done | Close readiness passed; proof-last transaction remains command-owned. |
