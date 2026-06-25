# T-0414 Session Start Primary-Action Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0414 |
| Title | Session Start Primary-Action Hardening |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Make Session Start report the one safe first action as structured data. | Agents should not infer the first command from broader context guidance after startup. |

## Scope

| In Scope | Reason |
|---|---|
| Add `guidance.primaryAction`, `whyThisNow`, `avoidForNow`, and `nextCommandArgs`. | Gives agents a copyable first read-only command and explicit anti-actions. |
| Make task-scoped Session Start prefer `task lifecycle` as the first primary action. | Lifecycle is the 0.3.3+ default entry point before edits/finalize. |
| Update schema/docs/tests. | Keeps the additive contract stable and discoverable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Changing Session Start write boundaries. | Session Start remains read-only and must not warm cache, append evidence, or run validation. |
| Re-ranking context pack reads. | T-0415 covers context-pack actionability separately. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25 | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | Ready for finalize | Session Start primary action guidance, schema/docs/tests, focused validation, and built CLI smoke are complete. | ev:T-0414:598d8358ab004c6faf3164a6 |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
