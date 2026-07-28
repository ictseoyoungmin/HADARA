# T-0724 Expose Close Marker Counts

## Identity

| Field | Value |
|---|---|
| ID | T-0724 |
| Title | Expose Close Marker Counts |
| Status | Done |
| Created | 2026-07-28T18:46 |
| Updated | 2026-07-28T18:52 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Expose and bound close operation marker persistence counts. | Align `task close` reports with the rc2 performance contract: progress events must not cause durable marker writes, and clean close marker writes must stay within the spec budget. |

## Scope

| Boundary | Items |
|---|---|
| In | Close transaction marker persistence counting, semantic marker write reduction, rc2 write-summary alias fields, schema/tests. |
| Out | Full recovery journal redesign, installed-package dogfood, broad fault matrix, release promotion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add marker persistence counts and stop persisting ordinary progress events. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Clean close reports marker content writes <= 4, cleanup <= 1, and progress persistence writes = 0. | Met | ev:T-0724:069817aa186b4d59b239de54 | rc2 spec AC-14, AC-15 |
| AC-2 | Transaction write summary distinguishes mutation steps, file writes, evidence appends, close proof append, and idempotent no-op. | Met | ev:T-0724:069817aa186b4d59b239de54 | rc2 spec AC-16 |
| AC-3 | Existing close transaction schema validation passes with the new fields. | Met | ev:T-0724:5d5838d3688145e2a939c47f | `src/schemas/task-close-v3.schema.json` |
| AC-4 | Validation evidence is recorded. | Met | ev:T-0724:acbbf0742ce045ceb14a4c5a | HADARA protocol |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task close tests | Yes | Passed | npm test -- --run tests/unit/task-close.test.ts passed: 28 tests | ev:T-0724:069817aa186b4d59b239de54 |
| Schema and workflow docs tests | Yes | Passed | npm test -- --run tests/unit/schema-fixtures.test.ts tests/unit/task-workflow-docs.test.ts passed: 2 files / 5 tests | ev:T-0724:5d5838d3688145e2a939c47f |
| TypeScript build | Yes | Passed | npm run build passed | ev:T-0724:69403f0bf50844fca53a3259 |
| Full check | Yes | Passed | npm run check passed: public 136 files/1067 tests, HADARA-dev 16 files/134 tests | ev:T-0724:acbbf0742ce045ceb14a4c5a |
| Diff hygiene | Yes | Passed | git diff --check passed | ev:T-0724:c440c56db5c94549b18b3972 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Marker persistence and write summary contract. |
| src/task/close/execute.ts | implementation-source | active | Transaction orchestration and operation marker persistence. |
| src/schemas/task-close-v3.schema.json | implementation-source | active | Public transaction report schema. |
| tests/unit/task-close.test.ts | implementation-source | active | Existing transaction behavior coverage. |

## Changes

| Area | Summary |
|---|---|
| Close transaction report | Added `transaction.markerPersistence` with content write, cleanup, progress, fsync, and unchanged-skip counters. |
| Write summary | Added rc2 names for mutation steps, file writes, and evidence appends while preserving existing compatibility fields. |
| Operation persistence | Ordinary progress events now update the in-memory journal only; marker writes happen at initial intent, mutating semantic outcomes, blocked-after-mutation recovery, and final recovery persistence. |
| Schema/tests | Tightened v3 schema for new non-negative integer counts and added focused assertions for clean, blocked, and duplicate close paths. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Blocked preflight still creates and cleans an initial operation marker in the execute path; a later capsule should decide whether to make blocked preflight marker writes zero. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |
| RF-2 | Follow-up | Reported file fsync and directory fsync counts are currently zero placeholders because the existing atomic write helper does not expose fsync instrumentation. | Open | src/task/close/execute.ts |

## Close Summary

T-0724 exposed close operation marker persistence counts and rc2 write-summary aliases in the public v3 transaction report. Clean close now reports progress persistence writes as zero and keeps marker content writes within the rc2 budget. Focused close tests, schema/workflow docs tests, TypeScript build, and full check passed.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped marker persistence counters and write summary aliases. |
| 2026-07-28 | Done | Implemented marker count reporting and completed validation. |
