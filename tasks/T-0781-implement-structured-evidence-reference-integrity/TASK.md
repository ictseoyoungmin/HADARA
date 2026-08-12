# T-0781 Implement structured evidence reference integrity

## Identity

| Field | Value |
|---|---|
| ID | T-0781 |
| Title | Implement structured evidence reference integrity |
| Status | Done |
| Created | 2026-08-12T18:35 |
| Updated | 2026-08-12T18:49 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Replace regex-only readiness reference collection with one structured, resolution-aware evidence reference contract. | Close must fail zero-write for malformed, truncated, or missing structured references while preserving valid cross-task references and source locations. |

## Scope

| Boundary | Items |
|---|---|
| In | Shared evidence reference resolver; TASK Acceptance/Validation/Risks and HANDOFF Last Completed structured fields; same-task and cross-task resolution; done validation; protocol doctor reuse; additive close snapshot source/unresolved fields; focused regressions. |
| Out | Free-prose scanning; evidence artifact byte binding; HANDOFF phase enforcement and release projection owned by T-0782; npm/GitHub/Docker mutation; RC6 artifact generation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define structured source fields, durable ID syntax, and resolution results from frozen Contract B. | Done |
| 2 | Implement the shared resolver and integrate validation, protocol doctor, and close snapshot. | Done |
| 3 | Validate malformed/missing/cross-task/free-prose cases and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | One shared resolver scans only declared structured evidence fields and preserves every source location. | Met | ev:T-0781:0478a15b57a849fca0a63144 | Contract B structured sources |
| AC-2 | Full same-task and cross-task durable IDs resolve to canonical evidence records with source lines. | Met | ev:T-0781:0478a15b57a849fca0a63144 | resolver regression |
| AC-3 | Truncated, malformed, missing same-task, and missing cross-task references are blocking done/close errors. | Met | ev:T-0781:0478a15b57a849fca0a63144; ev:T-0781:830702bbd38f4a6a9a0c4fe7 | fail-close regression |
| AC-4 | Evidence-looking examples in arbitrary prose are excluded from readiness references. | Met | ev:T-0781:0478a15b57a849fca0a63144 | free-prose regression |
| AC-5 | New close snapshots contain only resolved readiness IDs, source metadata, and an empty unresolved list; historical snapshots remain readable. | Met | ev:T-0781:830702bbd38f4a6a9a0c4fe7 | close snapshot regression |
| AC-6 | Focused tests, source typecheck, Docker build/dist refresh, lint, and task evidence pass. | Met | ev:T-0781:b764beebc7364aaa9ae5bbfd; ev:T-0781:ac516baaab374e0c88a9d92c; ev:T-0781:8d8374bea1094b7484cb36a0 | validation evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Evidence reference resolver and task validation tests | Yes | Passed | exit 0 in 2722ms | ev:T-0781:0478a15b57a849fca0a63144 |
| Close snapshot compatibility tests | Yes | Passed | exit 0 in 7939ms | ev:T-0781:830702bbd38f4a6a9a0c4fe7 |
| Full default test suite | Yes | Passed | exit 0 in 20204ms | ev:T-0781:b764beebc7364aaa9ae5bbfd |
| Source typecheck | Yes | Passed | exit 0 in 4581ms | ev:T-0781:ac516baaab374e0c88a9d92c |
| Docker sync build | Yes | Passed | npm run dev:docker-sync-build passed after resolver integration; Docker TypeScript build completed, dist synchronized, and built CLI smoke reported distLooksSta | ev:T-0781:8d8374bea1094b7484cb36a0 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` | design | active | Normative Contract B and regression matrix. |
| `src/services/markdown-table.ts` | implementation-source | active | Structured section/table parsing primitives. |
| `src/evidence/evidence.ts` | implementation-source | active | Persisted evidence and close snapshot compatibility contract. |

## Changes

| Area | Summary |
|---|---|
| Resolver | Added one structured TASK/HANDOFF/compatibility-sidecar scanner with canonical v2 ID and source-line resolution. |
| Consumers | Task validation, evidence lint, protocol consistency, acceptance semantics, and close snapshots now share resolver results. |
| Close snapshot | Added resolved source locations and unresolved reference details while retaining historical snapshot readability. |
| Tests/docs | Added malformed/missing/cross-task/free-prose and zero-write close regressions; synchronized RC6 spec registry projection and archive guard. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | HANDOFF phase/currentness and release projection remain T-0782. | Deferred | T-0782 after this capsule. |
| RF-2 | Risk | Packaged runtime remains changed relative to RC5. | Accepted | RC6 regeneration remains mandatory. |

## Close Summary

Implemented a shared structured evidence reference resolver that scans only declared readiness table fields, resolves same-task and cross-task durable IDs against canonical v2 evidence lines, and preserves every source location. Done validation and evidence lint now block malformed, truncated, or missing references; protocol doctor reports the same resolver findings; close snapshots contain only resolved readiness IDs plus source metadata and require an empty unresolved list for new proofs. Free prose is excluded, historical snapshot compatibility remains additive, all 150 focused central tests and the full 1,058-test suite passed, and Docker rebuilt the current CLI.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Frozen Contract B mapped to shared structured resolver and close snapshot integration. |
| 2026-08-12 | In Progress | Full suite exposed stale RC6 spec projection guards from T-0779; regenerated DOC_REGISTRY and admitted the active rc6 version folder. |
| 2026-08-12 | Done | Focused, full-suite, typecheck, and Docker validations passed; capsule prepared for proof-last close. |
