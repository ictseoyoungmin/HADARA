# T-0548 context pack freshness diagnostic

## Identity

| Field | Value |
|---|---|
| ID | T-0548 |
| Title | context pack freshness diagnostic |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Diagnose current context pack freshness and routing quality after the 0.4.2 stable release line. | This capsule records observed `context pack`, `session start`, `context graph`, and task-status behavior; implementation fixes are intentionally split into follow-up capsules. |

## Scope

| Boundary | Items |
|---|---|
| In | Run current built CLI context/session/status diagnostics, identify stale cache/read-map/state/known-problem signals, and write a prioritized diagnostic report. |
| Out | Code fixes, docs-registry mutation, cache warming, release-state model changes, and broad historical evidence migration. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Run task selection and create a scoped diagnostic capsule. | Done |
| 2 | Run `context pack`, `session start`, `context graph`, and selected-task status diagnostics. | Done |
| 3 | Write a structured diagnostic report with prioritized follow-ups. | Done |
| 4 | Record evidence, update shared handoff/state, and close the diagnostic capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Task-scoped and no-task context pack behavior is documented with latency, degradation, and routing findings. | Done | `ev:T-0548:d32094ea16a5424891611b6d`, `ev:T-0548:bf4ef3ba3d184736bc9aea71` | `CONTEXT_PACK_DIAGNOSTIC.md` |
| AC-2 | Context graph/cache/read-map/state projection freshness signals are documented and prioritized. | Done | `ev:T-0548:53f7e42d877e43e29fd8a236` | `CONTEXT_PACK_DIAGNOSTIC.md` |
| AC-3 | Follow-up work is split into actionable capsules rather than a broad one-shot refactor. | Done | `ev:T-0548:fd8fa39a8d8f4a9bb6c46936` | `CONTEXT_PACK_DIAGNOSTIC.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `hadara context pack --json` with no active task; observed slow failure and broad degraded scan before `CONTEXT_PACK_TASK_NOT_FOUND`. | No | Passed | `ev:T-0548:d32094ea16a5424891611b6d` |
| `hadara context pack --task T-0548 --json`; observed successful but degraded task-scoped pack with stale extractor shards and budget truncation. | Yes | Passed | `ev:T-0548:bf4ef3ba3d184736bc9aea71` |
| `hadara context graph --json`; observed degraded full graph with zero code-index nodes and historical missing-evidence warnings. | Yes | Passed | `ev:T-0548:53f7e42d877e43e29fd8a236` |
| `hadara session start --task T-0548 --json`; observed bounded fast path with expected degraded no-live warning and read-map counts. | Yes | Passed | `ev:T-0548:fd8fa39a8d8f4a9bb6c46936` |
| `hadara task status --task T-0548 --json`; observed fast selected-task cockpit for the diagnostic capsule. | Yes | Passed | `ev:T-0548:fd8fa39a8d8f4a9bb6c46936` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `node dist/cli/main.js context pack --json` | reference | active | Reproduced slow no-task failure path. |
| `node dist/cli/main.js context pack --task T-0548 --json` | reference | active | Reproduced task-scoped degraded context pack. |
| `node dist/cli/main.js context graph --json` | reference | active | Reproduced broad graph/cache/code-index state. |
| `node dist/cli/main.js session start --task T-0548 --json` | reference | active | Checked bounded no-live session path. |
| `docs/AGENT_HANDOFF.md` | reference | active | Current-state source whose historical/prose content is over-extracted by context graph known-problem extraction. |

## Changes

| Area | Summary |
|---|---|
| Diagnostic report | Added context pack freshness findings and follow-up plan in `CONTEXT_PACK_DIAGNOSTIC.md`. |
| Shared state | Updated current handoff/project state with the T-0548 findings and next recommended cleanup. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Make no-task `context pack` fail fast or return task-selection guidance before broad graph extraction. | Open | `CONTEXT_PACK_DIAGNOSTIC.md` |
| RF-2 | Follow-up | Rework context graph/cache freshness so stale extractor shards and missing source fingerprints have a repair path. | Open | `CONTEXT_PACK_DIAGNOSTIC.md` |
| RF-3 | Follow-up | Split current known-problem extraction from historical handoff prose and fix stale release-state projection. | Open | `CONTEXT_PACK_DIAGNOSTIC.md` |
| RF-4 | Follow-up | Restore or explicitly scope code-index integration for context graph/pack. | Open | `CONTEXT_PACK_DIAGNOSTIC.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | Done | Diagnostic report, evidence, shared-state updates, and close proof completed. |
