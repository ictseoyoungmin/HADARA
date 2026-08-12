# T-0782 Enforce close currentness and release state projection

## Identity

| Field | Value |
|---|---|
| ID | T-0782 |
| Title | Enforce close currentness and release state projection |
| Status | Done |
| Created | 2026-08-12T18:49 |
| Updated | 2026-08-12T19:03 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Enforce phase-correct HANDOFF close guidance and replace repeated release current-state prose with one guarded typed-evidence projection. | Preserve worker-owned narrative while making stale close instructions and contradictory release facts structurally detectable. |

## Scope

| Boundary | Items |
|---|---|
| In | Done-level Pre-Close/Post-Close validation; controlled same-task close phrase checks; separate-capsule/Create Task consistency; focused regressions; typed release publication/GitHub/lifecycle observation reader; dry-run-first before-hash guarded current block; registered report schema; RELEASE_READINESS projection. |
| Out | Arbitrary-language intent inference; npm/GitHub/Docker mutation; package version bump; RC6 artifact generation/publication; rewriting closed historical capsule prose. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define enforceable HANDOFF table rules and typed release projection precedence from Contracts C-D. | Done |
| 2 | Implement validators, release current-state report/guarded write, schemas, and current block. | Done |
| 3 | Validate phase/currentness and projection conflict cases; record evidence and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Done-level close blocks non-terminal Pre-Close dispositions, Create Task=yes, or explicit same-task close instructions. | Met | ev:T-0782:f2d33304851946f289a4f4b6 | Contract C Pre-Close |
| AC-2 | Post-Close terminal/no passes; explicit separate/future capsule with no blocks; the same continuation with yes passes. | Met | ev:T-0782:f2d33304851946f289a4f4b6 | Contract C Post-Close |
| AC-3 | Done read models continue consuming Post-Close guidance only; worker-owned HANDOFF prose is validated but never silently rewritten. | Met | ev:T-0782:f2d33304851946f289a4f4b6 | handoff selection regression |
| AC-4 | Release current-state derives package/npm/GitHub/lifecycle facts only from package metadata and byte-bound typed evidence artifacts. | Met | ev:T-0782:e8a128228ced4d93b5e261fd; ev:T-0782:63b884e61ab34c93ac98d167 | Contract D typed sources |
| AC-5 | Projection execute is dry-run-first, before-hash guarded, zero-write on conflict, and replaces exactly one managed current block. | Met | ev:T-0782:e8a128228ced4d93b5e261fd | release projection regression |
| AC-6 | RELEASE_READINESS current block reflects RC5 public facts and does not claim legacy lifecycle evidence satisfies the new command-generated contract. | Met | ev:T-0782:63b884e61ab34c93ac98d167 | generated current block |
| AC-7 | Focused/full tests, source/tools typechecks, Docker build/dist refresh, evidence lint, and close pass. | Met | ev:T-0782:44f004ae520240628ad12d25; ev:T-0782:cc9b6e86ca744273b3e2bece | validation evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| HANDOFF close-currentness tests | Yes | Passed | exit 0 in 2366ms | ev:T-0782:f2d33304851946f289a4f4b6 |
| Release current-state projection tests | Yes | Passed | exit 0 in 1819ms | ev:T-0782:e8a128228ced4d93b5e261fd |
| Release current-state repository dogfood | Yes | Passed | exit 0 in 543ms | ev:T-0782:63b884e61ab34c93ac98d167 |
| Full default and HADARA-dev tests | Yes | Passed | exit 0 in 25858ms | ev:T-0782:d0d85b36a3a64eea8d5ce2b3 |
| Source/tools typechecks and Docker sync build | Yes | Passed | Source and tools typechecks passed; npm run dev:docker-sync-build passed, synchronized dist, and built CLI smoke reported distLooksStale=false. | ev:T-0782:71a7eb7c034744018d58d286 |
| Final Docker sync build | Yes | Passed | Final npm run dev:docker-sync-build passed after registered public-verification schema and compatible-version reducer; dist synchronized and built CLI reported | ev:T-0782:cc9b6e86ca744273b3e2bece |
| Final suite after typed verification registration | Yes | Passed | exit 0 in 23400ms | ev:T-0782:44f004ae520240628ad12d25 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` | design | active | Normative Contracts C-D and regression matrix. |
| `src/task/handoff-continuation.ts` | implementation-source | active | Controlled continuation semantics and Done routing. |
| T-0778 byte-bound publication/GitHub/lifecycle artifacts | background | active | Current public RC5 facts; legacy lifecycle report is not Contract A acceptance. |

## Changes

| Area | Summary |
|---|---|
| HANDOFF validation | Added canonical Pre-Close terminal/Create Task/same-task-close enforcement and Post-Close separate-capsule consistency without rewriting worker prose. |
| Release projection | Added a compatible-version typed evidence reducer and dry-run-first before-hash guarded managed current block. |
| Schemas | Registered release current-state and public GitHub verification report schemas; reused registered publication and terminal lifecycle schemas. |
| Tests/docs | Added controlled-table, typed-source, legacy-exclusion, and before-hash regressions; projected RC5 public facts into RELEASE_READINESS. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Exact RC6 regeneration and public terminal lifecycle acceptance remain a separate operator sequence. | Deferred | Create RC6 preparation capsule after this task. |
| RF-2 | Risk | Current source is not represented by published RC5 bytes. | Accepted | Projection keeps stable promotion pending and RC6 regeneration is mandatory. |

## Close Summary

Implemented structural close currentness and release-state authority. Canonical HANDOFF capsules now fail Done validation when Pre-Close is non-terminal, creates another task, or retains explicit same-capsule close instructions; Post-Close terminal/no and separate-capsule/yes consistency are enforced while legacy handoffs remain readable and worker prose is never auto-rewritten. The new `release current-state` surface resolves only byte-bound, schema-valid, version-compatible publication/GitHub/lifecycle artifacts and applies one managed RELEASE_READINESS block through a reviewed before hash. Actual T-0778 artifacts project RC5 npm/GitHub facts, exclude the legacy lifecycle report from Contract A acceptance, and keep stable promotion blocked pending RC6 regeneration. Focused tests, final full suites, typechecks, Docker build/dist refresh, and repository dogfood passed.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Contracts C-D mapped to controlled HANDOFF validation and guarded typed release projection. |
| 2026-08-12 | In Progress | Registered public GitHub verification schema and constrained observation selection to the published package version. |
| 2026-08-12 | Done | Managed RC5 current state is idempotent; final focused/full/Docker validation passed; capsule prepared for proof-last close. |
