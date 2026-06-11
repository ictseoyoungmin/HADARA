# T-0290 Stage Phase 7 surface refactor specs

## Metadata

| Field | Value |
|---|---|
| ID | T-0290 |
| Title | Stage Phase 7 surface refactor specs |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Stage Phase 7 surface-refactor planning for 0.3.0 without runtime behavior changes. | Copy the Phase 7 specs into the canonical docs tree and reconcile current release/state docs so Phase 7.1 can start from consistent context. |

## Scope

| In Scope | Reason |
|---|---|
| Add `docs/specs/0.3.0/` Phase 7 spec files and implementation guides. | Required by Phase 7.0 staging. |
| Reconcile README/release notes/current-state docs with rc3 publish evidence and Phase 7 planning. | Phase 7.0 requires repository state to be internally consistent before registry work starts. |
| Update Task Capsule docs and evidence for the docs-only staging scope. | HADARA protocol requires scoped evidence and handoff. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime command registry/help implementation. | Phase 7.1. |
| Lifecycle guide or portfolio audit implementation. | Phase 7.2. |
| Document registry, managed sections, docs cleanup, or release hardening behavior. | Phase 7.3 through Phase 7.6. |
| Publish, GitHub Release, Docker image, PyPI, installer, or release mutation. | Phase 7.6/operator-gated release work only. |
| Mark, move, archive, or delete historical docs. | Phase 7.5+ planning only; Phase 7.0 preserves history. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | task create |
| 2026-06-11 | In Progress | Staging Phase 7.0 docs and release-state reconciliation. | T-0290 work session |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
