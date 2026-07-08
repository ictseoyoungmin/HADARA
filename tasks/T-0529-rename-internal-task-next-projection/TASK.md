# T-0529 rename internal task next projection

## Identity

| Field | Value |
|---|---|
| ID | T-0529 |
| Title | rename internal task next projection |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Rename the internal next-work projection so it no longer looks like the removed public `task next` command. | Keep `task status --json` behavior and public `task.next` removal intact while moving code, schema, and JSON source naming to `task-selection`. |

## Scope

| Boundary | Items |
|---|---|
| In | Rename internal module/schema/types/tests from `task-next` / `hadara.task.next.v1` to `task-selection` / `hadara.task.selection.v1`; update `task status --json` selection source naming; update current schema/contract docs. |
| Out | Reintroducing public `task next`, rewriting historical task records/specs, or changing selection policy semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract around internal naming only. | Done |
| 2 | Rename module/schema/types/tests and `task status` source key from task-next to task-selection. | Done |
| 3 | Validate build, focused tests, Docker sync-build, and close readiness. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current source/tests/docs no longer expose internal `task-next`, `TaskNext`, `hadara.task.next.v1`, or `sources.taskNext` names. | Done | `ev:T-0529:c6c93453bfc04f939193a923` | T-0528 RF-1. |
| AC-2 | Public `task.next` remains absent from command registry/routing while `task status --json` still returns selection recommendations. | Done | `ev:T-0529:c6c93453bfc04f939193a923` | T-0528 command-surface boundary. |
| AC-3 | Validation evidence is recorded and Docker-built `dist` is refreshed. | Done | `ev:T-0529:941cfef9cd80400f94ef3e08` | AGENTS.md. |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | `ev:T-0529:c6c93453bfc04f939193a923` |
| Focused Vitest | Yes | Passed | `ev:T-0529:c6c93453bfc04f939193a923` |
| Built CLI smoke | Yes | Passed | `ev:T-0529:c6c93453bfc04f939193a923` |
| Docker sync build | Yes | Passed | `ev:T-0529:941cfef9cd80400f94ef3e08` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | implementation-source | active | Rename the internal name after T-0528 removal. |
| `tasks/T-0528-remove-retired-command-compatibility-surfaces/TASK.md` | reference | active | RF-1 records the confusing internal `task-next` name. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | JSON contract must describe the current selection source name. |

## Changes

| Area | Summary |
|---|---|
| Source | Renamed internal task selection module/schema/test names while preserving selection behavior. |
| Docs | Updated current schema and JSON contract docs to use `taskSelection`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical docs still mention `task next` and `hadara.task.next.v1` as past released behavior; do not rewrite history unless a separate archival cleanup is requested. | Open | `docs/PROJECT_STATE.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Started internal task-selection rename. |
| 2026-07-08 | Done | Renamed internal projection, recorded focused and Docker validation evidence, and refreshed dist. |
