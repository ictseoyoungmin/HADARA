# T-0465 Finalize staged plan hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0465 |
| Title | Finalize staged plan hardening |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| `src/task/task-finalize.ts` | implementation-source | approved | implemented | sha256:7454149954abdae4cf020736e29a21a6d48d43f43d4d647433262d1d51da2ae3 | Adds staged plan status, deferred checks, partial execution risk, and next-action warning text. |
| `src/schemas/task-finalize.schema.json` | constraint | approved | implemented | sha256:75a7b3c1d42b4efaf69438ae2d891fdfb9d27ccb7f3646ca7adb4c745538573a | Accepts staged plan status and deferred-check metadata. |
| `tests/unit/task-finalize.test.ts` | reference | approved | implemented | sha256:f15bca24636e90d85c8a18a197598573fb7514ebf13f40d761bdc99dd0c5bba1 | Covers finish-required and close-required deferred-check plans. |
| `tests/unit/schema-fixtures.test.ts` | reference | approved | implemented | sha256:360b42680e46ae1ebba0ecb14c5f8027a568eb67cbb7a4909acd4f5f6ba6f766 | Confirms updated schema fixture registry still validates. |

## Goal

| Goal | Notes |
|---|---|
| Make finalize dry-run honest about staged execution. | A dry-run with required writes should disclose deferred checks and partial execution risk before `--execute` can apply any write. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define staged finalize plan semantics for required write steps. | Done | This TASK.md |
| 2 | Add `executable-with-deferred-checks`, `deferredChecks`, and `partialExecutionRisk` to finalize reports. | Done | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| 3 | Update schema and focused tests for finish-required and close-required staged plans. | Done | `ev:T-0465:5bab047c37bf4178a8c94cb9`, `ev:T-0465:a3639a0719a5477cb621b1d9` |
| 4 | Prove built CLI dry-run output exposes deferred checks before execute. | Done | `ev:T-0465:f4e0591df698476c8d583886` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | A finish-required finalize dry-run reports `planStatus: executable-with-deferred-checks`, `deferredChecks: [ready, close, audit-close]`, and `partialExecutionRisk: true`. | Yes | Met | `ev:T-0465:5bab047c37bf4178a8c94cb9`, `ev:T-0465:f4e0591df698476c8d583886` | Required | `src/task/task-finalize.ts`, `tests/unit/task-finalize.test.ts` |
| AC-2 | Required write next actions warn that finalize will re-evaluate deferred checks and may stop if blockers appear. | Yes | Met | `ev:T-0465:5bab047c37bf4178a8c94cb9`, `ev:T-0465:f4e0591df698476c8d583886` | Required | `src/task/task-finalize.ts` |
| AC-3 | A close-required ready-to-close dry-run reports audit-close as a deferred check. | Yes | Met | `ev:T-0465:5bab047c37bf4178a8c94cb9` | Required | `tests/unit/task-finalize.test.ts` |
| AC-4 | Finalize schema accepts the staged plan status and deferred-check metadata. | Yes | Met | `ev:T-0465:5bab047c37bf4178a8c94cb9` | Required | `src/schemas/task-finalize.schema.json`, `tests/unit/schema-fixtures.test.ts` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker validation | `npx vitest run tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts && npm run build` in `hadara-dev` with changed files overlaid | Yes | Passed | `ev:T-0465:5bab047c37bf4178a8c94cb9`, `ev:T-0465:a3639a0719a5477cb621b1d9` |
| Built CLI dry-run smoke | `node dist/cli/main.js task finalize --task T-0465 --json` | Yes | Passed | `ev:T-0465:f4e0591df698476c8d583886` |
| Initial focused Docker validation | Same focused validation before test expectation update | No | Failed | `ev:T-0465:007326f276cf4deb9d85114a`, `ev:T-0465:a3639a0719a5477cb621b1d9` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/task/task-finalize.ts` | L19-L41 | Added staged plan status, deferred checks, and partial execution risk fields. | Let dry-run distinguish simple executable plans from staged plans with post-write checks. | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| `src/task/task-finalize.ts` | L271-L331 | Populated deferred-check metadata on dry-run and execute reports. | Make partial execution risk visible before any write. | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| `src/task/task-finalize.ts` | L509-L531 | Added staged plan status derivation and info issue for deferred checks. | Explain why execute can stop after a planned write. | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| `src/task/task-finalize.ts` | L585-L596 | Added next-action wording for deferred checks after write actions. | Prevent agents from interpreting write-required dry-runs as fully predictive close plans. | `ev:T-0465:f4e0591df698476c8d583886` |
| `src/task/task-finalize.ts` | L608-L615 | Added deferred-check metadata to summary. | Keep compact consumers informed without deep step inspection. | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| `src/schemas/task-finalize.schema.json` | L13-L53 | Added staged status and deferred-check schema properties. | Preserve schema compatibility for new finalize report fields. | `ev:T-0465:5bab047c37bf4178a8c94cb9` |
| `tests/unit/task-finalize.test.ts` | L41-L132 | Added coverage for finish-required and close-required staged dry-runs. | Prove dry-run now predicts post-write checks. | `ev:T-0465:5bab047c37bf4178a8c94cb9`, `ev:T-0465:a3639a0719a5477cb621b1d9` |
| `dist/` | N/A | Refreshed built CLI from Docker build output. | Prove current workspace CLI emits staged plan fields. | `ev:T-0465:f4e0591df698476c8d583886` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `message` and `summary` in next-action objects still duplicate text in many reports. | Open | Future schema/read-model cleanup. |
| RF-2 | Follow-up | This capsule makes staged finalize plans honest; it does not optimize mounted-workspace close/audit latency. | Open | T-0463/T-0464 latency diagnostics and progress output. |
