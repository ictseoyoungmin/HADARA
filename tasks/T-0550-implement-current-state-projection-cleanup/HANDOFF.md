# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Current-state projection cleanup | `releaseState` now reports `current` for completed stable release readiness even when historical/future blocked text exists, and historical/deferred missing evidence no longer becomes current state warnings. Evidence: `ev:T-0550:fa1bc6efeca64c8bbd36589d`, `ev:T-0550:d587386a0b944079bbdd8e4b`, `ev:T-0550:d8a8ff99f4424237a302763e`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement known-problem and handoff extraction cleanup. | Requested order is 1 -> 3 -> 4 -> 2 -> 5; after T-0549 and T-0550, the next item is T-0548 CP-6: handoff prose is over-extracted into stale known-problem nodes. | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md`, `src/context/document-extractors.ts`, `docs/AGENT_HANDOFF.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Task-scoped context pack still uses the live graph path and remains slow on mounted workspaces. | T-0550 fixed projection correctness, not CP-2 performance or CP-3 cache freshness. | Continue with the requested follow-up capsules for known-problem cleanup, cache freshness, and routing/code-index cleanup. |
| `knownProblems` remains over-broad after T-0550. | The built context-pack smoke still listed many stale handoff-derived known-problem nodes. | Handle in the next capsule by tightening extraction to explicit current-known-problem rows/sections. |
