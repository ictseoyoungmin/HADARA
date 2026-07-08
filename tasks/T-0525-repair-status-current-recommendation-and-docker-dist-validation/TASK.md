# T-0525 repair status current recommendation and docker dist validation

## Identity

| Field | Value |
|---|---|
| ID | T-0525 |
| Title | repair status current recommendation and docker dist validation |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore Docker/dist discipline and make top-level status recommend current work. | T-0524 closed with host-built dist validation only; `status --summary-json` also surfaced stale handoff release guidance instead of the current Task Board capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Prefer current Task Board work for `status` recommendations, document the rule, run Docker sync-build to refresh workspace `dist`, and record evidence. |
| Out | Rewriting `task status`, changing lifecycle finalize behavior, or broad command portfolio removals. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define status recommendation and Docker validation correction contract. | Done |
| 2 | Implement current-work recommendation precedence and tests. | Done |
| 3 | Run Docker sync-build/dist refresh and built CLI smokes. | Done |
| 4 | Record evidence, update shared state, and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara status --summary-json` / `status --json` prefer current Task Board work (`In Progress`, then `Draft`) over stale handoff recommendations, while old `Partial` rows do not override handoff next-step guidance. | Met | `ev:T-0525:b8caed6d249e4120bea191ca` | User report after T-0524 |
| AC-2 | Operations status contract documents the current-work recommendation rule. | Met | `ev:T-0525:b8caed6d249e4120bea191ca` | `docs/OPERATIONS_STATUS_CONTRACT.md` |
| AC-3 | Workspace `dist` is refreshed from Docker build output before final built-CLI smoke evidence is claimed. | Met | `ev:T-0525:b8caed6d249e4120bea191ca` | `docs/HADARA_WORKFLOW.md` |
| AC-4 | Validation evidence is recorded, including Docker/dist validation result or honest blocker. | Met | `ev:T-0525:b8caed6d249e4120bea191ca` | T-0525 evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status Vitest | Yes | Passed | `ev:T-0525:b8caed6d249e4120bea191ca` |
| Docker sync-build / dist refresh | Yes | Passed | `ev:T-0525:b8caed6d249e4120bea191ca` |
| Built CLI status smoke | Yes | Passed | `ev:T-0525:b8caed6d249e4120bea191ca` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| AGENTS.md | constraint | active | HADARA-dev CLI changes must prefer Docker workflow and refresh workspace `dist` from Docker build output before built-CLI smokes. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Defines `npm run dev:docker-sync-build` as the development CLI sync/build path. |
| User feedback | reference | active | Asked whether AGENTS/Docker/dist were being followed and whether status adapts to lifecycle/current work. |
| `docs/OPERATIONS_STATUS_CONTRACT.md` | reference | active | Public status JSON contract. |

## Changes

| Area | Summary |
|---|---|
| Status service | Prefer current Task Board work before handoff fallback for `tasks.nextRecommended`. |
| Tests | Add regression coverage for stale handoff recommendation suppression. |
| Docs | Document recommendation precedence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Top-level `status` is still a project-status surface, not the full task lifecycle cockpit; use `task status --task <id>` for phase-specific close guidance. | Open | Future UX docs if needed |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Implemented current-work recommendation precedence; Docker validation pending. |
| 2026-07-08 | Done | Docker sync-build refreshed dist and built status smoke proved current T-0525 recommendation. |
| 2026-07-08 | Done | Final Docker sync-build after Partial-row fallback fix passed 155 files / 1045 tests. |
