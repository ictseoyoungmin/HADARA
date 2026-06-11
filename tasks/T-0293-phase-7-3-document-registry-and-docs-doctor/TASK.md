# T-0293 Phase 7.3 Document Registry and Docs Doctor

## Metadata

| Field | Value |
|---|---|
| ID | T-0293 |
| Title | Phase 7.3 Document Registry and Docs Doctor |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Implement Phase 7.3 document registry and docs doctor. | Add seeded `.hadara/docs-registry.json`, `docs list/doctor/explain`, schemas, docs projection, and focused tests. |

## Scope

| In Scope | Reason |
|---|---|
| Registry model and profile seed | Phase 7.3 requires document classification by profile. |
| Init seed/upgrade integration | Fresh init must create the registry and upgrades may add it. |
| Docs CLI read surfaces | `docs list`, `docs doctor`, and `docs explain` are Phase 7.3 command outputs. |
| Schemas/tests | New JSON contracts must be registered and validated. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad doc rewrites/archive moves | Deferred to Phase 7.5. |
| Managed patch execution | Deferred to Phase 7.4. |
| Runtime deprecation/removal of docs | Registry classifies only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-11 | Implementation in progress. | Scope prepared from Phase 7.3 spec. | `TASK.md`, `PLAN.md` |
| 2026-06-11 | Done. | Document registry, docs doctor/list/explain, schemas, tests, and smokes completed. | T-0293 evidence records |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
