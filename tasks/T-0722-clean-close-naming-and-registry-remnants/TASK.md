# T-0722 Clean Close Naming And Registry Remnants

## Identity

| Field | Value |
|---|---|
| ID | T-0722 |
| Title | Clean Close Naming And Registry Remnants |
| Status | Done |
| Created | 2026-07-28T18:03 |
| Updated | 2026-07-28T18:03 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove user-facing mechanical rename remnants from task close output/tests and unregister deleted docs from the current docs registry. | Keep this to the P3 naming/registry cleanup requested by the reviewer. |

## Scope

| Boundary | Items |
|---|---|
| In | Task close summary text cleanup, v2 wording in tests, current `docs/DOC_REGISTRY.md` and `.hadara/docs-registry.json` deleted-document registration cleanup. |
| Out | P1/P2 runtime close journal, measurement harness, schema strictness, and continuation backfill issues from the reviewer note. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract around P3 naming and registry cleanup. | Done |
| 2 | Replace mechanical close/bookkeeping wording and v2 test names. | Done |
| 3 | Remove deleted docs from current registry projections. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | User-facing close text no longer says `bookkeeping bookkeeping`, `bookkeepinges`, or similarly mechanical rename artifacts. | Met | ev:T-0722:43d940bc5950440e92fda70c | Reviewer P3-11. |
| AC-2 | Tests that assert v3 behavior no longer describe it as public v2 transaction behavior. | Met | ev:T-0722:43d940bc5950440e92fda70c | Reviewer P3-11. |
| AC-3 | Deleted docs are removed from current docs registry projections, including `docs/DOC_REGISTRY.md` and `.hadara/docs-registry.json`. | Met | ev:T-0722:28e234e8d60348f6bc2db362 | User instruction. |
| AC-4 | Focused validation evidence is recorded. | Met | ev:T-0722:43d940bc5950440e92fda70c | HADARA protocol. |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Source typecheck | Yes | Passed | `npm run typecheck:src` passed. | ev:T-0722:c158488af1194ecb93592c73 |
| Focused tests | Yes | Passed | 5 files / 112 tests passed. | ev:T-0722:43d940bc5950440e92fda70c |
| Source build | Yes | Passed | `npm run build` passed. | ev:T-0722:8d24157ba452439c96dcc86a |
| Full unit tests | Yes | Passed | 136 files / 1067 tests passed; 1 file / 8 tests skipped. | ev:T-0722:12fd2681a8ce46b5bad99a40 |
| Docs doctor | Yes | Passed | `registeredDocuments=75`, `missingRegisteredDocuments=0`, `currentnessIssues=0`. | ev:T-0722:28e234e8d60348f6bc2db362 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| /home/ymin/.codex/attachments/3b8e06b2-60b1-4482-b72a-3cb05fcecb90/pasted-text.txt | reference | active | Reviewer note requesting P3 naming cleanup and DOC_REGISTRY removal. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | active | Current task close and docs-registry ownership rules. |

## Changes

| Area | Summary |
|---|---|
| Close wording | Replaced duplicated/mechanical close bookkeeping phrases and the `bookkeepinges` retry message. |
| Tests | Renamed v3 task close transaction tests that still said v2. |
| Docs registry | Removed deleted `docs/LIFECYCLE_QUICKSTART.md` and `docs/TEST_STRATEGY.md` registrations and fixed current dead-link references. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | P1/P2 reviewer findings in the attachment remain out of this P3 cleanup capsule unless separately requested. | Open | Reviewer note. |

## Close Summary


P3 naming and registry cleanup is complete. Mechanical close/bookkeeping wording is removed from the current source/test surface, v3 tests no longer describe themselves as v2, deleted docs are no longer registered, and docs doctor reports no missing registered documents.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped reviewer P3 naming cleanup and deleted-doc registry removal. |
| 2026-07-28 | Done | Implemented naming/registry cleanup and recorded validation evidence. |
