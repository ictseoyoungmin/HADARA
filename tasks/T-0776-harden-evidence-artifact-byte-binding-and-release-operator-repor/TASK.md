# T-0776 Harden Evidence Artifact Byte Binding and Release Operator Report Execution.

## Identity

| Field | Value |
|---|---|
| ID | T-0776 |
| Title | Harden Evidence Artifact Byte Binding and Release Operator Report Execution. |
| Status | Done |
| Created | 2026-08-11T21:09 |
| Updated | 2026-08-11T21:26 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden public evidence artifact binding to record and verify exact bytes, and make the release helper attach its operator report through a tested project-root-relative path with truthful stable/latest mutation state. | RC5 regeneration and all npm/GitHub/Docker mutations remain out of scope until this capsule closes. |

## Scope

| Boundary | Items |
|---|---|
| In | Evidence artifact SHA-256/byte length metadata, fingerprint inclusion, lint integrity errors, idempotency conflict checks, release-helper path correction, observed dist-tag report fields, and network-free integration regressions. |
| Out | RC5 artifact generation, npm/GitHub publication, stable promotion, public consumer recycle, Docker image mutation, and unrelated HANDOFF runtime enforcement. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define byte-binding, idempotency, and operator-report invariants. | Done |
| 2 | Implement byte metadata/integrity validation and release-helper corrections. | Done |
| 3 | Validate integration/full checks, record evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Newly attached public artifacts persist `sha256` and `byteLength`, and those fields participate in the evidence fingerprint. | Met | `ev:T-0776:c9b487a2a114422a8742ab8d` | Evidence writer and focused integration tests |
| AC-2 | Evidence lint fails closed on missing, hash-mismatched, or byte-length-mismatched bound artifacts while preserving legacy refs without byte metadata. | Met | `ev:T-0776:c9b487a2a114422a8742ab8d` | Evidence lint regression |
| AC-3 | Same-key artifact retries compare incoming bytes and fail closed on a different report instead of silently returning the old record. | Met | `ev:T-0776:c9b487a2a114422a8742ab8d` | Idempotency conflict regression |
| AC-4 | Release helper uses a project-root-relative task capsule path, and its report records observed npm dist-tags with truthful `stableLatestMutationPerformed`. | Met | `ev:T-0776:c9b487a2a114422a8742ab8d` | Release helper contract tests and schema fixture |
| AC-5 | Network-free integration tests execute report creation/attach through the corrected path; no external release mutation occurs. | Met | `ev:T-0776:c9b487a2a114422a8742ab8d` | Sanitized bound validation report |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Artifact hash/length and fingerprint tests | Yes | Passed | New evidence records bind exact copied bytes; focused suite passed 60 tests. | `ev:T-0776:c9b487a2a114422a8742ab8d` |
| Artifact integrity and idempotency tests | Yes | Passed | Mutation/missing artifact lint errors and same-key mismatch fail closed. | `ev:T-0776:c9b487a2a114422a8742ab8d` |
| Release helper report/path integration tests | Yes | Passed | Correct task-relative attach path and stable/latest truth are covered without publish. | `ev:T-0776:c9b487a2a114422a8742ab8d` |
| Full repository check/build | Yes | Passed | Host full suite passed; Docker rerun passed 1,054 public and 139 HADARA-dev tests. | `ev:T-0776:7b83c1a7532144fa851e3e03` resolves `ev:T-0776:09fe2cc5728a4238993e7e6d` |
| Evidence lint and task close | Yes | Passed | Evidence lint has zero errors/warnings; proof-last close is the remaining command boundary. | `ev:T-0776:c9b487a2a114422a8742ab8d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0775 structural contract | constraint | active | Existing artifact binding contract lacks byte identity and has a helper path defect. |
| src/evidence/evidence.ts | implementation-source | active | Canonical artifact copy, fingerprint, and idempotency authority. |
| src/services/evidence-lint.ts | implementation-source | active | Artifact existence/integrity readiness authority. |
| scripts/release/manual-publish-rc.sh | implementation-source | active | Operator publication report producer and evidence attach caller. |
| docs/RELEASE_READINESS.md | reference | active | RC4 invalidation and RC5 boundary. |

## Changes

| Area | Summary |
|---|---|
| Evidence writer | Add byte metadata to new public artifact refs, fingerprints, and same-key conflict checks. |
| Evidence lint | Enforce exact-byte integrity for new refs with error severity. |
| Release helper | Correct task-relative path and report observed dist-tag state. |
| Tests/docs | Add executable regressions and preserve the no-RC5/no-external-mutation boundary. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Any source change invalidates the published RC4 artifact and requires a later RC5 regeneration capsule. | Open | docs/RELEASE_READINESS.md |
| RF-2 | Follow-up | Historical artifact refs without hash metadata remain compatibility records; only newly bound refs claim byte identity. | Open | src/services/evidence-lint.ts |

## Close Summary

This capsule hardens evidence artifact byte identity and release-helper execution boundaries. It performs no external publication. RC5 must be regenerated only after this source change is closed.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Scope fixed from reviewer findings: project-root path, stable/latest report truth, byte hashes/lengths, integrity lint, and idempotency conflict handling. |
| 2026-08-11 | Done | Implementation, documentation, focused/full/Docker validation, exact artifact binding, and resolved transient retry are complete; ready for proof-last close. |
