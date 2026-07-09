# T-0554 Improve context status and pack interactive UX

## Identity

| Field | Value |
|---|---|
| ID | T-0554 |
| Title | Improve context status and pack interactive UX |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Improve interactive context/status UX after the T-0548 cleanup sequence. | Fix the remaining rough edges observed from built CLI: awkward next-task title suggestions, stale active-task projection, and slow task-scoped context pack caused by broad live fallback. |

## Scope

| Boundary | Items |
|---|---|
| In | Task selection recommendation wording; state projection active-task extraction; default task-scoped context pack cache fallback behavior; focused tests and built CLI smokes. |
| Out | Full context graph redesign, persistent daemon/cache service, changing explicit `--live` or `--include-code` heavy diagnostic semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and inspect current built CLI behavior. | Done |
| 2 | Fix task-selection and state-projection wording/extraction semantics. | Done |
| 3 | Reduce default task-scoped context-pack live fallback when cache has bounded stale shards. | Done |
| 4 | Validate with focused tests, Docker-built dist, and built CLI smokes. | Done |
| 5 | Update evidence/state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task status --json` no longer proposes a generic instruction sentence as the literal `task create` title when no next capsule is selected. | Done | ev:T-0554:251cd4d8d68949b5a81f4a59 | Built CLI observation |
| AC-2 | Context/state projection treats `None selected after T-XXXX` and similar handoff/project-state text as no active task instead of extracting the historical task id. | Done | ev:T-0554:10594b2ff93742b9b590f537 | Built CLI observation |
| AC-3 | Default `context pack --task` remains bounded when graph-core/code-index are usable and only small state/doc/task shards are stale; explicit heavy paths remain available. | Done | ev:T-0554:251cd4d8d68949b5a81f4a59 | Built CLI observation |
| AC-4 | Focused tests and built CLI smokes prove the UX improvements. | Done | ev:T-0554:10594b2ff93742b9b590f537, ev:T-0554:93ee6190489f47aa9e67f32e, ev:T-0554:251cd4d8d68949b5a81f4a59 | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task selection/state/context tests | Yes | Passed | ev:T-0554:10594b2ff93742b9b590f537 |
| Docker sync-build full validation | Yes | Passed | ev:T-0554:93ee6190489f47aa9e67f32e |
| Built CLI status/context smokes | Yes | Passed | ev:T-0554:251cd4d8d68949b5a81f4a59 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | reference | active | Current handoff has no selected task and a generic next-step instruction. |
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | Original context-pack freshness findings. |
| `src/task/task-selection.ts` | implementation-source | active | Select-work recommendation source. |
| `src/context/document-extractors.ts` / `src/context/state-projection.ts` | implementation-source | active | Active-task extraction/projection. |
| `src/context/context-graph-builder.ts` / `src/context/context-pack.ts` | implementation-source | active | Context pack cache/live fallback behavior. |

## Changes

| Area | Summary |
|---|---|
| Task selection | Filtered generic handoff/selection prose and replaced broad capsule scans with targeted capsule lookups so select-work stays fast and recommends the concrete open Task Board row. |
| State projection | Tightened active-task hint parsing so `None selected after T-XXXX` and historical prose do not become an active task. |
| Context pack/cache | Added bounded stale graph-core overlays for live state docs, extended Git fingerprint timeout for mounted workspaces, and filtered task-scoped context-pack state issues to the selected task. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `context pack --task` hot path is correct and compact but still around 10s on this WSL-mounted repo because Git fingerprint verification is expensive. | Open | `.hadara/local/feedback/T-0554-context-pack-hot-path-latency.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Implemented task-selection, state-projection, and context-pack/cache UX hardening. |
