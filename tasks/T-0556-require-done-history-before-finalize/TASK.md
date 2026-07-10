# T-0556 Require Done history before finalize

## Identity

| Field | Value |
|---|---|
| ID | T-0556 |
| Title | Require Done history before finalize |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prevent closed capsules from missing the final manual History row. | Add close-grade validation and pre-close authoring guidance so agents see the required `History` Done row before finalize blocks. |

## Scope

| Boundary | Items |
|---|---|
| In | Done-level validation for v2 `## History`; authoring guidance for missing final `Done` history row; generated/current workflow guidance; focused tests. |
| Out | Rewriting already-closed historical capsules such as T-0554; moving History out of close-source; changing close proof hash semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and inspect current validator/guidance behavior. | Done |
| 2 | Add v2 History Done-row close-grade validation and pre-close authoring guidance. | Done |
| 3 | Update workflow/template guidance and focused tests. | Done |
| 4 | Validate, record evidence, update state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Done-level validation blocks a v2 `TASK.md` whose Identity status is `Done` but whose `## History` latest row is not `Done`. | Done | `ev:T-0556:f260d2562365467ea77ef880` | `src/harness/validate.ts` |
| AC-2 | `task status` / `task finalize --json` authoring guidance exposes the missing History Done row before execute, so the user does not first learn it from a blocker. | Done | `ev:T-0556:a2060c65544e4af98834e0b5` | `src/task/authoring-guidance.ts` |
| AC-3 | Workflow docs and generated init templates tell agents to add the final `History` Done row before finalize execute. | Done | `ev:T-0556:f260d2562365467ea77ef880` | `docs/TASK_WORKFLOW_COMMANDS.md`, `src/init/templates.ts` |
| AC-4 | Focused tests and Docker-built dist validation pass. | Done | `ev:T-0556:f260d2562365467ea77ef880`, `ev:T-0556:c42a93b05147431d9942345e`, `ev:T-0556:73b956d053c3452f96d3fe7d` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused harness/finalize/workbench/docs/init tests | Yes | Passed | `ev:T-0556:f260d2562365467ea77ef880` |
| TypeScript build | Yes | Passed | `ev:T-0556:c42a93b05147431d9942345e` |
| Docker mounted build and dist version smoke | Yes | Passed | `ev:T-0556:73b956d053c3452f96d3fe7d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0554 History omission | reference | active | T-0554 closed-valid but `TASK.md ## History` lacks a Done row; do not rewrite it in this capsule. |
| `src/harness/validate.ts` | implementation-source | active | Done-level Task Capsule validation. |
| `src/task/authoring-guidance.ts` | implementation-source | active | Pre-close authoring guidance surfaced by status/finalize. |
| `docs/TASK_WORKFLOW_COMMANDS.md` / `src/init/templates.ts` | implementation-source | active | Current and generated workflow guidance. |

## Changes

| Area | Summary |
|---|---|
| `src/harness/validate.ts` | Added v2 `## History` Done-row done-level validation with current History-first behavior and legacy Status History fallback. |
| `src/task/authoring-guidance.ts` | Added pre-close History authoring guidance so status/finalize reports surface the final Done-row requirement before close execution. |
| `docs/TASK_WORKFLOW_COMMANDS.md`, `src/init/templates.ts` | Documented that agents must append the final manual `History` Done row before finalize execute because TASK.md is close-source. |
| `tests/harness/harness-validate.test.ts`, `tests/unit/task-finalize.test.ts` | Added focused regression coverage for v2 History blockers and finalize authoring guidance; corrected the legacy-only Status History fixture. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical closed capsules may still lack a v2 History Done row. Repair them only through intentional close-source edits and refreshed finalize proof. | Open | T-0554 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Scoped Done-history validation and pre-close guidance improvement. |
| 2026-07-10 | Done | Implemented Done-history validation, pre-close guidance, docs/templates, focused tests, and Docker-built dist smoke evidence. |
