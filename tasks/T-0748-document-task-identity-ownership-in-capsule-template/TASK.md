# T-0748 Document Task Identity Ownership in Capsule Template

## Identity

| Field | Value |
|---|---|
| ID | T-0748 |
| Title | Document Task Identity Ownership in Capsule Template |
| Status | Done |
| Created | 2026-08-08T14:16 |
| Updated | 2026-08-08T14:23 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make generated task capsules explicitly identify lifecycle-owned identity fields. | Keep the guidance local to generated `TASK.md` and `HANDOFF.md` while preserving command-owned updates and existing capsule layout. |

## Scope

| Boundary | Items |
|---|---|
| In | Default and named task capsule templates, focused generation regression tests, and task evidence. |
| Out | Existing capsule migration, lifecycle behavior changes, and shared workflow contract redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define generated Identity ownership wording and expected surfaces. | Done |
| 2 | Add the wording to default and named capsule templates. | Done |
| 3 | Add focused generation regression coverage and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default and named generated `TASK.md` plus generated `HANDOFF.md` identify `ID`, `Title`, `Status`, `Created`, and `Updated` as command-owned. | Done | ev:T-0748:f66b9794d3484e5ca82e0ed8 | `src/task/task-capsule.ts`; `src/task/task-templates.ts` |
| AC-2 | Focused task-capsule tests prove the guidance is present without changing lifecycle behavior or existing generated file boundaries. | Done | ev:T-0748:f66b9794d3484e5ca82e0ed8; ev:T-0748:7594a1dc8f36401297b77677 | `tests/unit/task-capsule.test.ts`; `tests/unit/task-create.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task capsule template tests | Yes | Passed | exit 0 in 23252ms | ev:T-0748:f66b9794d3484e5ca82e0ed8 |
| Full npm run check | Yes | Passed | Build, tools typecheck, public test suite, and HADARA-dev test suite passed. | ev:T-0748:7594a1dc8f36401297b77677 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/task/task-capsule.ts` | implementation-source | active | Default generated capsule file content. |
| `src/task/task-templates.ts` | implementation-source | active | Named template-generated `TASK.md` content. |
| `tests/unit/task-capsule.test.ts` | implementation-source | active | Default capsule generation contract. |

## Changes

| Area | Summary |
|---|---|
| Capsule templates | Add explicit command-owned Identity guidance to generated task documents. |
| Tests | Pin the guidance in default and named template generation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Existing capsules are not rewritten; new guidance applies to newly generated capsules. | Accepted | This task |

## Close Summary

Generated capsule documents will make Identity ownership visible at the point of authoring while leaving lifecycle mutation semantics unchanged.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold and contract defined. |
| 2026-08-08 | Done | Generated Identity ownership guidance and regression coverage completed; full check passed. |
