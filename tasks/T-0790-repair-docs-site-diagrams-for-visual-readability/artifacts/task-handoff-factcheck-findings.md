# TASK.md and HANDOFF.md Fact-Check Findings

## Scope

The public Task Capsules page was checked against a fresh standard project produced by the current TypeScript source, a fresh `task create`, controlled vocabulary output, close dry-run validation, reviewed close execution, and the resulting TASK, HANDOFF, Task Board, and evidence projections.

## Initial result

The first complete-example revision was not yet release-quality. Current-source close dry-run found two concrete contract errors and one misleading lifecycle choice:

1. `Inputs / Constraints.Role` used `compatibility`, which is not an allowed `task.source.role` token. The appropriate allowed token is `constraint`.
2. The ready-to-close TASK example ended History with `In Progress`. Done-level validation requires the final History row to be `Done` before close captures the source.
3. The example changed command-owned Identity status to `In Progress`. The normal generated path starts at `Draft` and close performs the guarded transition to `Done`; the public example should demonstrate that path.

The initial fact-check close dry-run returned `TASK_VALIDATION_TASK_SOURCE_DOCUMENT_ROLE_INVALID_TOKEN` and `TASK_VALIDATION_TASK_HISTORY_NOT_DONE`. This record intentionally preserves that failed review result instead of treating the earlier content/build pass as semantic proof.

## Required correction

- Use `constraint` in the complete example.
- Keep pre-close TASK and HANDOFF identities at `Draft`.
- End TASK History with `Done` before close.
- Explain the exact visible close updates rather than saying only that status and proof change.
- Repeat the current-source close transaction and require `closed-valid`.
