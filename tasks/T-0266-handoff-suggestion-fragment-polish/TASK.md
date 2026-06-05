# T-0266 Handoff Suggestion Fragment Polish

## Metadata

| Field | Value |
|---|---|
| ID | T-0266 |
| Title | Handoff Suggestion Fragment Polish |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Make handoff suggestion fragments directly reviewable by a coordinator. | Preserve read-only behavior, before-hash metadata, and execute refusal. |

## Scope

| In Scope | Reason |
|---|---|
| Add exact target hash, section title, and suggested replacement text to handoff suggestion fragments. | Reviewer requested coordinator-usable fragments rather than generic prose. |
| Focused handoff/schema tests, Docker sync-build, and built CLI smoke. | Confirms additive contract compatibility and public CLI behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No hidden shared-doc writes | Template boundary. |
| No scheduler behavior | Template boundary. |
| No multi-agent runtime claims | Template boundary. |
| No automatic handoff mutation. | Coordinator must still manually review and apply shared-doc updates. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-05T08:58:00.000Z | In Progress | Started Phase 6.1 handoff suggestion fragment polish. | T-0266 capsule created from operator-workflow template. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
