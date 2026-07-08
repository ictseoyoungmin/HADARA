# T-0524 speed up status json default

## Identity

| Field | Value |
|---|---|
| ID | T-0524 |
| Title | speed up status json default |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make top-level project status fast by default. | `hadara status --json` should no longer run broad debt, known-problem, Task Capsule, or state-consistency scans unless the operator asks for them. |

## Scope

| Boundary | Items |
|---|---|
| In | Add fast/full/summary/state-only status modes, preserve full operations status on explicit request, update command metadata/docs/tests. |
| Out | Rewriting dashboard internals, changing `task status`, or removing the state projection service. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define fast default and explicit heavy/compact variants. | Done |
| 2 | Implement CLI/service options and command registry metadata. | Done |
| 3 | Update tests and public contract docs. | Done |
| 4 | Validate built CLI timing/shape and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara status --json` skips state consistency, debt, known-problem, and broad capsule scans by default while retaining the existing `hadara.ops.status.v1` envelope. | Met | `ev:T-0524:27c4be39ca554616b854a12e` | User report on `status --json` latency after `state.verify` removal |
| AC-2 | `hadara status --detail full --json` preserves the previous rich operations-status payload, including state-consistency advisory and known problems. | Met | `ev:T-0524:27c4be39ca554616b854a12e` | `docs/OPERATIONS_STATUS_CONTRACT.md` |
| AC-3 | `hadara status --summary-json` and `hadara status --state-only --json` expose compact automation and state-advisory contracts. | Met | `ev:T-0524:27c4be39ca554616b854a12e` | `docs/CLI_JSON_CONTRACT.md` |
| AC-4 | Tests, build, and built CLI smokes prove the changed contracts. | Met | `ev:T-0524:27c4be39ca554616b854a12e` | T-0524 validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Vitest | Yes | Passed | `ev:T-0524:27c4be39ca554616b854a12e` |
| TypeScript build | Yes | Passed | `ev:T-0524:27c4be39ca554616b854a12e` |
| Built CLI status smoke | Yes | Passed | `ev:T-0524:27c4be39ca554616b854a12e` |
| Full host Vitest suite | No | Blocked | `ev:T-0524:4baa7e47eb454beaa70dfe06` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User feedback | reference | active | `status --json` remained too slow after `state.verify` public removal; asked to apply fast-default, state-only, summary, and reduced-scan options. |
| `docs/OPERATIONS_STATUS_CONTRACT.md` | reference | active | Operations status schema and dashboard semantics. |
| `docs/CLI_JSON_CONTRACT.md` | reference | active | Public JSON command semantics and replacement paths. |

## Changes

| Area | Summary |
|---|---|
| CLI | `status` now supports fast default, `--detail full`, `--summary-json`, `--state-only`, and bounded `--state-issue-limit`. |
| Services | Operations status service can count from Task Board, skip known problems/debt/state, and emit summary/state-only reports. |
| Docs/tests | Status JSON tests and public contracts document the fast/full split. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Default status still pays Node/import startup cost; further speed work should target CLI startup/import graph or a cache-backed read model. | Open | Future performance capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Implemented fast/full/summary/state-only status contract and began validation. |
| 2026-07-08 | In Progress | Focused tests, build, and built CLI status smokes passed; host full-suite run blocked by spawn EPERM. |
| 2026-07-08 | Done | Shared docs and handoff updated for finalize. |
