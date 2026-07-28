# T-0717 Remove Task Finalize Compatibility Surface

## Identity

| Field | Value |
|---|---|
| ID | T-0717 |
| Title | Remove Task Finalize Compatibility Surface |
| Status | Done |
| Created | 2026-07-28T14:45 |
| Updated | 2026-07-28T14:53 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove `task finalize` from the public HADARA command surface. | Keep the internal finalize engine for `task close`, but remove CLI routing/help/registry/current docs that still expose `task finalize` as a callable surface. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove `task finalize` from CLI routing, command registry, lifecycle help, current workflow docs, generated init workflow docs, and public-surface regression tests. |
| Out | Removing the internal finalize engine or `hadara.task.finalize.v1` internal schema used inside `task close --detail full`; historical closed-capsule records and archived release/history docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Remove the public/compatibility surface from CLI/help/registry/current docs. | Done |
| 2 | Update generated workflow docs and public-surface regressions. | Done |
| 3 | Run broader validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task finalize` no longer routes from the public CLI, is absent from the command registry/help surface, and current docs point agents to `task close` only. | Met | `ev:T-0717:744c806073b2440d9618d375` | `src/cli/task.ts`, `src/services/capability-registry.ts`, `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-2 | Targeted public-surface regressions, full `npm test`, `npm run build`, and `npm run typecheck:tools` are recorded. | Met | `ev:T-0717:744c806073b2440d9618d375` | `tests/unit/cli-help-routing.test.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/task-workflow-docs.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test -- tests/unit/cli-help-routing.test.ts tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/command-surface-drift.test.ts tests/unit/task-workflow-docs.test.ts tests/harness/harness-validate.test.ts tests/unit/task-finalize.test.ts` | Yes | Passed | Public-surface cleanup regressions passed. | `ev:T-0717:744c806073b2440d9618d375` |
| `npm test` | Yes | Passed | Full repository Vitest suite passed: 141 files passed, 1 skipped file, 1107 tests passed, 8 skipped tests. | `ev:T-0717:744c806073b2440d9618d375` |
| `npm run build` | Yes | Passed | Project TypeScript build passed. | `ev:T-0717:744c806073b2440d9618d375` |
| `npm run typecheck:tools` | Yes | Passed | Tools TypeScript compile passed. | `ev:T-0717:744c806073b2440d9618d375` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | reference | active | Public lifecycle routing requirement. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Canonical task workflow semantics. |
| `docs/CLI_JSON_CONTRACT.md` | reference | active | Public JSON contract and removed-surface guidance. |

## Changes

| Area | Summary |
|---|---|
| `src/cli/task.ts` | Removed public `task finalize` subcommand routing and help dispatch. |
| `src/services/capability-registry.ts`, `src/services/lifecycle-guide.ts`, `src/cli/help.ts` | Removed `task.finalize` from public command inventory/help/lifecycle guidance while preserving `task close` as the only public close surface. |
| `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/CLI_JSON_CONTRACT.md`, `docs/COMMAND_SURFACE.md`, `README.md`, `docs/ROADMAP.md`, `AGENTS.md`, `src/init/templates.ts` | Rewrote current/public guidance to treat `task finalize` as removed from public routing. |
| `tests/unit/*`, `tests/harness/harness-validate.test.ts` | Updated public-surface expectations and scaffold residue fixture command strings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical release/history documents and closed historical capsules still mention `task finalize` because they record past behavior. If product policy requires purging historical wording too, treat that as a separate documentation/history cleanup capsule instead of mutating closed-proof task capsules ad hoc. | Open | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `docs/DEVELOPMENT_SLICES.md` |

## Close Summary

Removed `task finalize` from current public routing and contract docs while preserving the internal finalize engine under `task close --detail full` diagnostics.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Removed the public finalize surface, updated current docs/templates, and validated the close-only routing baseline. |
