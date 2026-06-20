# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0397 |
| TaskStatus | Done |
| Last Updated | 2026-06-20 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added guarded `task finalize --execute --plan-hash` orchestration with missing/stale hash refusal. | `ev:T-0397:59085932aced47be89c4532d`, `ev:T-0397:454daf3e664843cba5db3b1a` |
| Full Docker sync-build passed and refreshed `dist`. | `ev:T-0397:fd38f35a791e4b179285cc9d` |
| Built CLI dry-run and execute-guard smokes passed. | `ev:T-0397:924236021b714ecaa783c7ec`, `ev:T-0397:454daf3e664843cba5db3b1a` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/start T-0398 Lifecycle Scenario Docs and Init Alignment. | The lifecycle convenience command set now exists; generated docs/session guidance should teach the canonical and convenience flows clearly. | `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task finalize --execute` can only be safe if close-source docs are finalized before the reviewed plan. | Post-close source edits can still stale close evidence. | Finalize capsule/shared docs first; if edits are needed after close, rerun ready/close/audit. |
| Guarded execute is convenience, not canonical proof replacement. | Operators may overuse it when explicit phase review is clearer. | The report exposes underlying commands, write boundaries, and execution report hashes. |
