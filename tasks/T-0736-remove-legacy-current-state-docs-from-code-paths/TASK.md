# T-0736 Remove legacy current-state docs from code paths

## Identity

| Field | Value |
|---|---|
| ID | T-0736 |
| Title | Remove legacy current-state docs from code paths |
| Status | Done |
| Created | 2026-07-29T18:42 |
| Updated | 2026-07-29T19:29 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove legacy current-state docs from primary code paths. | `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` should no longer be generated, required, or used as ordinary workflow inputs by init/status/close guidance. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/` and tests that make global Project State, global Agent Handoff, or `.hadara/state/current.json` part of primary init/session/task workflow behavior. |
| Out | Historical docs, archived fixtures, task-local `tasks/T-*/HANDOFF.md`, legacy compatibility readers kept only for migration/fallback, and full Init v1 redesign work that will resume later. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Remove primary workflow references and generation. | Done |
| 3 | Update focused tests. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | New init scaffolds no longer generate `.hadara/state/current.json`, `docs/PROJECT_STATE.md`, or `docs/AGENT_HANDOFF.md` as primary artifacts. | Done | ev:T-0736:823297c68d374937823b6716 | Init v1 freeze |
| AC-2 | Required-reading and workflow guidance route continuation through `task status`, `docs/TASK_BOARD.md`, and task capsules, not global state/handoff docs. | Done | ev:T-0736:823297c68d374937823b6716 | User direction |
| AC-3 | Task close/status guidance does not ask agents to update global Project State or Agent Handoff as ordinary bookkeeping. | Done | ev:T-0736:823297c68d374937823b6716 | rc2 close transaction spec |
| AC-4 | Focused and expanded validation passes and evidence is recorded. | Done | ev:T-0736:823297c68d374937823b6716 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused tests | Yes | Passed | cleanup-focused suite passed: 14 files / 212 tests. | ev:T-0736:9a5856cad04c45019d0e0d7a |
| TypeScript build | Yes | Passed | `npx tsc --noEmit` passed. | ev:T-0736:9a5856cad04c45019d0e0d7a |
| Focused legacy current-state cleanup suite | Yes | Passed | npx tsc --noEmit passed; npx vitest run cleanup-focused suite passed: 14 files / 212 tests. | ev:T-0736:9a5856cad04c45019d0e0d7a |
| Expanded new-contract status and MCP suite | Yes | Passed | npx tsc --noEmit passed; expanded vitest suite passed: 20 files / 295 tests, 2 skipped. | ev:T-0736:d592e48ace844c9e87fd4da7 |
| Post-documentation new-contract suite | Yes | Passed | After documentation updates, npx tsc --noEmit passed; expanded vitest suite passed: 20 files / 295 tests, 2 skipped. | ev:T-0736:823297c68d374937823b6716 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | requirement | active | Remove code/test handling and wording for global current-state docs first; docs were moved under `docs/history`. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | constraint | active | Close write set only includes explicit close-owned required projections. |
| `docs/archive/retired-2026-07-26/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | constraint | active | New Init v1 does not create current.json, Project State, or Agent Handoff. |

## Changes

| Area | Summary |
|---|---|
| Init scaffold/profile/doctor/upgrade | Removed generation and required-doc treatment for `.hadara/state/current.json`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`; standard/governed now route through Task Board, workflow, and context anchor. |
| Task selection/session/status/close | Removed primary reads and close writes for global Project State, global Agent Handoff, and current-state checkpoint; session start now falls back to Task Board/task context. |
| Context/Hermes/TUI/read models | Updated exported agent context, graph/cache defaults, TUI cache/read models, and project read compatibility payloads toward Task Board and task-local handoff. |
| Registry/schema/tests | Removed registry seeds and schema expectations for global current-state docs; updated focused unit tests for the new contract. |
| Documentation | Updated `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, `docs/HADARA_WORKFLOW.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/MCP_BRIDGE_CONTRACT.md`, and `docs/CLI_JSON_CONTRACT.md` to document Task Board/task-local handoff as the continuation contract. |
| Repository state | Removed `.hadara/state/current.json`; root `docs/PROJECT_STATE.md` and `docs/AGENT_HANDOFF.md` remain deleted after the user's move to `docs/history/`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full removal of legacy compatibility parser/schema surfaces may need a separate migration cleanup if downstream consumers still rely on them. | Open | n/a |
| RF-2 | Follow-up | Update remaining status/MCP tests that still assert old global handoff/current-state payloads, then run the full suite. | Closed | ev:T-0736:d592e48ace844c9e87fd4da7 |

## Close Summary

Primary cleanup implemented and documented. Focused and expanded new-contract validation passed.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Scoped removal of global current-state docs from primary code paths. |
| 2026-07-29 | In Progress | Removed primary init/session/status/close/context references and recorded focused validation evidence. |
| 2026-07-29 | Done | Updated status/MCP tests to the new Task Board/task-local handoff contract and recorded expanded validation evidence. |
