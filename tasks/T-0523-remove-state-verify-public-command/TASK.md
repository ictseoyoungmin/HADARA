# T-0523 remove state verify public command

## Identity

| Field | Value |
|---|---|
| ID | T-0523 |
| Title | remove state verify public command |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the public `state.verify` command surface after verifying replacement diagnostics. | Keep the internal `state-projection` service/schema because `status`, `protocol doctor`, and context routing still consume it. |

## Scope

| Boundary | Items |
|---|---|
| In | Compare replacement coverage, remove `state.verify` from public CLI routing/registry/docs/tests, and update current replacement guidance to `status` or `protocol doctor`. |
| Out | Historical specs/release notes remain records of the former `state verify` surface. Internal `hadara.stateProjection.v1` schema and service remain supported for consumers. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and replacement coverage decision. | Done |
| 2 | Remove public command routing, registry entry, current docs, and CLI guidance. | Done |
| 3 | Validate focused command/state/status/protocol behavior and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `status --json` and `protocol doctor --scope all --json` expose state consistency advisory fields with issue codes, paths, and fix hints before `state.verify` is removed. | Done | `ev:T-0523:1ff663c8467b4e31b71002cc` | `tests/unit/state-projection.test.ts`; `src/services/operations-status-service.ts`; `src/services/protocol-consistency.ts` |
| AC-2 | `state.verify` is absent from the current command registry and public CLI routing. | Done | `ev:T-0523:1ff663c8467b4e31b71002cc` | `src/services/capability-registry.ts`; `src/cli/main.ts` |
| AC-3 | Current docs/init/session/handoff replacement guidance no longer recommends `hadara state verify`. | Done | `ev:T-0523:1ff663c8467b4e31b71002cc` | `README.md`; `docs/COMMAND_SURFACE.md`; `src/context/session-start.ts`; `src/cli/handoff.ts` |
| AC-4 | Focused validation passes after the command removal. | Done | `ev:T-0523:1ff663c8467b4e31b71002cc` | `tests/unit/command-registry.test.ts`; `tests/unit/state-projection.test.ts`; `tests/unit/status-json.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Vitest: registry, state projection, status, protocol, session, removed stubs, handoff, lifecycle guide | Yes | Passed | `ev:T-0523:1ff663c8467b4e31b71002cc` |
| TypeScript build | Yes | Passed | `ev:T-0523:1ff663c8467b4e31b71002cc` |
| Built CLI smokes: registry absence, removed route, status/protocol advisory replacement | Yes | Passed | `ev:T-0523:1ff663c8467b4e31b71002cc` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Confirm whether `state.verify` is still needed; absorb into replacements if needed, then remove. |
| T-0522 command reduction | reference | active | Established current command-portfolio reduction pattern and replacement guidance cleanup. |
| State projection replacement coverage | reference | active | `status --json` and `protocol doctor --scope all --json` already expose `stateConsistency` advisory data. |

## Changes

| Area | Summary |
|---|---|
| Command surface | Removed public `state.verify` routing and command registry entry; internal state projection service/schema stays. |
| Replacement guidance | Routed users to `status --json`, `protocol doctor --scope all --json`, `task status --detail full`, and `task finalize`. |
| Tests | Converted `state verify` CLI coverage into status/protocol advisory coverage and removal assertions. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `status --json` is a valid replacement but was slow and very verbose on the mounted workspace. | Open | `.hadara/local/feedback/T-0523-status-state-consistency-latency.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Replacement coverage confirmed; public `state.verify` surface removed while preserving internal projection service/schema. |
| 2026-07-08 | Done | Focused validation, build, and built CLI replacement/removal smokes passed. |
