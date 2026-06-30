# T-0434 T-04A8 Source Document Hash and Drift Link

## Identity

| Field | Value |
|---|---|
| ID | T-0434 |
| Title | T-04A8 Source Document Hash and Drift Link |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md | implementation-source | approved | implementing | sha256:6267cb01ed5f0fb9c08c7bfac78fdb2972e9dd91c7e57b5b20b8aebbf3572c4b | Defines Source Documents hash shape and diagnostics. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | approved | implementing | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Defines T-04A8 scope in the 0.4 sequence. |

## Goal

| Goal | Notes |
|---|---|
| Make TASK.md Source Documents rows prove concrete project-local files by sha256 and report missing or changed files through harness validation. | Reuse the existing TASK.md table validator instead of adding a new command surface. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Extend harness Source Documents validation to compare concrete hashes and require concrete hashes at done level. | Done | ev:T-0434:ca9cc42e94a44af4b02e893f |
| 2 | Add regression tests for changed, missing, and done-level TBD source hashes. | Done | ev:T-0434:ca9cc42e94a44af4b02e893f |
| 3 | Refresh Docker-built dist and verify built CLI draft validation. | Done | ev:T-0434:ca9cc42e94a44af4b02e893f |
| 4 | Prepare shared state docs for close. | Done | ev:T-0434:ca9cc42e94a44af4b02e893f |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Draft validation reports `TASK_SOURCE_DOCUMENT_CHANGED` when a Source Documents row records a concrete hash but the file content changes. | Yes | Met | ev:T-0434:ca9cc42e94a44af4b02e893f | Required | tests/harness/harness-validate.test.ts |
| AC-2 | Draft validation reports `TASK_SOURCE_DOCUMENT_CHANGED` when a Source Documents row records a concrete hash but the file is missing or outside the project boundary. | Yes | Met | ev:T-0434:ca9cc42e94a44af4b02e893f | Required | tests/harness/harness-validate.test.ts |
| AC-3 | Done-level validation reports `TASK_SOURCE_DOCUMENT_MISSING_HASH` when a concrete source path still has `TBD` Source Hash. | Yes | Met | ev:T-0434:ca9cc42e94a44af4b02e893f | Required | tests/harness/harness-validate.test.ts |
| AC-4 | Existing task lifecycle readiness/close/finalize tests still pass with the stronger source document gate. | Yes | Met | ev:T-0434:ca9cc42e94a44af4b02e893f | Required | tests/unit/task-ready.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker `/tmp/hadara` | Yes | Passed | ev:T-0434:ca9cc42e94a44af4b02e893f |
| Focused tests | `npm run test:focused -- tests/harness/harness-validate.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/task-lifecycle.test.ts` in Docker `/tmp/hadara` | Yes | Passed | ev:T-0434:ca9cc42e94a44af4b02e893f |
| Built CLI smoke | `harness validate --task T-0434 --level draft --json` using workspace `dist` | Yes | Passed | ev:T-0434:ca9cc42e94a44af4b02e893f |
| Harness done validation | `harness validate --task T-0434 --level done --json` | Yes | Passed | ev:T-0434:7f6520aa43a249daa4099bea |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0434:7f6520aa43a249daa4099bea |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/harness/validate.ts | L1-L7, L152-L254 | Added sha256 file hashing, project-boundary checks, concrete Source Documents hash comparison, missing-file reporting, and done-level concrete hash enforcement. | T-04A8 requires recorded source hashes to detect changed or missing design sources. | ev:T-0434:ca9cc42e94a44af4b02e893f |
| tests/harness/harness-validate.test.ts | L1-L9, L150-L190, L831-L840 | Added changed/missing/TBD hash regressions and gave done-level fixtures real source files with concrete hashes. | Prove the stronger Source Documents validation without broad fixture rewrites. | ev:T-0434:ca9cc42e94a44af4b02e893f |
| tasks/T-0434-t-04a8-source-document-hash-and-drift-link/TASK.md | whole-file | Authored capsule with concrete Source Documents hashes. | Dogfood T-04A8 behavior. | This file. |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This capsule reports source drift through harness validation only; T-04A14/T-04A15 will integrate source drift into session start/context pack read-map guidance. | Deferred | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
