# T-0532 remove legacy command redirect stubs

## Identity

| Field | Value |
|---|---|
| ID | T-0532 |
| Title | remove legacy command redirect stubs |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove legacy command redirect stubs from public routing. | Registry-absent retired commands should use the ordinary unknown/default-help path instead of preserving `hadara.commandRemoved.v1` as a public JSON contract. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove public routing for legacy redirect stubs, delete the retired removed-command schema/fixture, update current docs/tests that still advertise structured redirects, and keep current replacements discoverable through active commands. |
| Out | Internal lifecycle service modules used by `task finalize`/`task status`, historical specs and completed-task history, release behavior, and unrelated command portfolio candidates. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define retired-command routing and documentation contract. | Done |
| 2 | Remove redirect-only CLI handlers/schema while preserving internal services. | Done |
| 3 | Update tests and current docs to match fully removed surfaces. | Done |
| 4 | Validate, record evidence, refresh handoff/state, and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Retired public command ids are absent from the command registry and no longer have special redirect routing. | Done | `ev:T-0532:7c4d6212107b4a19b3d73071` | `src/services/capability-registry.ts`, `src/cli/main.ts` |
| AC-2 | `task finish/ready/close/audit-close/complete/lifecycle`, `write preflight`, `policy check-shell`, `package smoke`, `handoff suggest`, `harness replay`, `run`, `run scaffold`, and `run-state show/resume` fall through to ordinary unhandled/default-help behavior instead of `hadara.commandRemoved.v1`. | Done | `ev:T-0532:4ae792591df14134ac3fc56d`, `ev:T-0532:7c4d6212107b4a19b3d73071` | CLI routing tests |
| AC-3 | Current docs and schema fixtures no longer advertise `hadara.commandRemoved.v1` as a current JSON contract. | Done | `ev:T-0532:4ae792591df14134ac3fc56d` | `docs/CLI_JSON_CONTRACT.md`, `docs/HADARA_WORKFLOW.md`, `docs/SCHEMAS.md` |
| AC-4 | Focused tests, build, and Docker sync-build pass after the surface removal. | Done | `ev:T-0532:4ae792591df14134ac3fc56d`, `ev:T-0532:7fe349e74ca84badbc96c6f5`, `ev:T-0532:d1a6f5e679bc411f9b98d2f3` | Validation commands |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused legacy routing/schema/docs tests | Yes | Passed | `ev:T-0532:4ae792591df14134ac3fc56d` |
| `npm run build` | Yes | Passed | `ev:T-0532:7fe349e74ca84badbc96c6f5` |
| Docker sync-build | Yes | Passed | `ev:T-0532:d1a6f5e679bc411f9b98d2f3` |
| Built CLI legacy command smoke | Yes | Passed | `ev:T-0532:7c4d6212107b4a19b3d73071` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | reference | active | Requests command portfolio reduction and removal of lingering lifecycle/compatibility stubs. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Defines the current task workflow surface and replacement commands. |
| `src/cli/main.ts` | implementation-source | active | Top-level command routing. |
| `src/cli/task.ts` | implementation-source | active | Task workflow routing. |
| `src/services/capability-registry.ts` | implementation-source | active | Current command registry must remain the source of visible commands. |

## Changes

| Area | Summary |
|---|---|
| CLI routing | Removed redirect-only routing for task lifecycle stubs, `handoff suggest`, `write preflight`, `run`, `run-state`, `policy check-shell`, `harness replay`, and old `package smoke`; retained internal services consumed by current commands. |
| Schemas/docs/tests | Deleted `hadara.commandRemoved.v1` schema/fixture and updated current docs, init templates, help/lifecycle guidance, and tests to treat removed surfaces as fully unrouted. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Remaining command portfolio candidates that are still active commands require separate product decisions and usage evidence. | Open | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Removed legacy redirect stubs and verified routing/docs/schema/build/Docker validation. |
