# T-0257 Handoff Patch Suggestion

## Metadata

| Field | Value |
|---|---|
| ID | T-0257 |
| Title | Handoff Patch Suggestion |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only handoff suggestion reporting. | `hadara handoff suggest --task <id> --json` should propose coordinator-reviewed `docs/AGENT_HANDOFF.md` fragments with target before-hash and no writes. |

## Scope

| In Scope | Reason |
|---|---|
| Handoff suggestion service and CLI route. | Provides the Phase 6 shared-doc suggestion surface without expanding write boundaries. |
| JSON schema and schema registry entry. | Gives external agents a stable report shape. |
| Focused tests and protocol docs. | Proves read-only behavior, execute rejection, and documented semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic Agent Handoff writes. | Suggestions remain coordinator-reviewed; the command must not mutate shared docs. |
| Broad multi-agent runtime behavior. | T-0257 is a report surface only, not scheduling, delegation, or coordination. |
| Task completion orchestration changes. | `task complete` behavior remains unchanged. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T05:12:00.000Z | Draft | Initial task scaffold created for Phase 6 handoff suggestion work. | Task Capsule exists. |
| 2026-06-05T05:19:30.000Z | In Progress | Implemented read-only handoff suggestion command and began validation. | Docker validation and built CLI smokes. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |

