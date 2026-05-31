# T-0164 Protocol Surface Docs Alignment

## Metadata

| Field | Value |
|---|---|
| ID | T-0164 |
| Title | Protocol Surface Docs Alignment |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Align protocol/task surface docs and help text. | Make CLI help, schema notes, README, and JSON contract docs match implemented Phase 2 surfaces. |

## Scope

| In Scope | Reason |
|---|---|
| Update stale CLI help for protocol doctor and task upgrade-scaffold. | Help must show default doctor, all scope, and upgrade-scaffold command. |
| Align schema registry/docs notes. | Consistency schema covers task/docs/profile/all and task upgrade-scaffold is now registered. |
| Record validation and handoff. | Final Phase 2 hardening capsule should leave clean resume context. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Add new runtime behavior. | T-0164 is docs/help alignment only. |
| Change schema strictness. | Fixture-level additive posture remains. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T05:15:59.911Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T05:15:59.911Z | Done | Protocol surface docs/help alignment completed and validated. | Full Docker check and built CLI help smoke passed. |
