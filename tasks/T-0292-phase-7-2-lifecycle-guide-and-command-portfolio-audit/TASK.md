# T-0292 Phase 7.2 Lifecycle Guide and Command Portfolio Audit

## Metadata

| Field | Value |
|---|---|
| ID | T-0292 |
| Title | Phase 7.2 Lifecycle Guide and Command Portfolio Audit |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Implement Phase 7.2 lifecycle guide and command portfolio audit. | Add registry-backed lifecycle guide JSON/text, lifecycle/portfolio docs, schemas, and tests without changing existing command semantics. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara help lifecycle --json` report | Phase 7.2 AC-7.2-3 requires `hadara.lifecycle.guide.v1`. |
| Lifecycle guide docs and help text | Agents need primary lifecycle guidance without full command inventory. |
| Command portfolio audit docs | Phase 7.2 must record why overlapping commands exist. |
| Schema registrations and focused tests | Phase 7.2 adds structured reports and drift checks. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Removing or warning on deprecated commands | Phase 7.2 documents decisions only; runtime removals need later accepted work. |
| Changing task lifecycle command semantics | This phase projects existing semantics from the registry. |
| Document registry/session start packets | Deferred to Phase 7.3+ per spec. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-11 | Implementation in progress. | Capsule scope and acceptance criteria prepared for Phase 7.2. | `TASK.md`, `PLAN.md`, `ACCEPTANCE.md` |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
