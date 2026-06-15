# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | TaskStatus allowed/reserved tokens are documented. | Done | `docs/TASK_WORKFLOW_COMMANDS.md` documents allowed tokens and reserved non-TaskStatus strings. |
| AC-2 | CloseState is documented as audit-derived and separate from persistent TaskStatus. | Done | `docs/TASK_WORKFLOW_COMMANDS.md` and `docs/IMPLEMENTATION_SOP.md` separate TaskStatus from CloseState and list canonical close-state tokens. |
| AC-3 | DocStatus, EvidenceOutcome, and document ownership/write-boundary guidance are documented. | Done | Workflow/SOP docs document DocStatus, EvidenceOutcome, and command/operator ownership boundaries. |
| AC-4 | Generated workflow guidance includes the status/close-state separation. | Done | `src/cli/init.ts` updates generated SOP and task workflow docs; `tests/unit/init.test.ts` asserts generated content. |
| AC-5 | Tests or explicit constraints are recorded. | Done | Focused Docker init test, docs commands, harness validation, and full-suite timeout constraint recorded in `TESTS.md`. |
| AC-6 | Evidence is attached. | Done | `command:T-0319:status-token-policy-validation`; failed full Docker timeout retained as `command:T-0319:docker-sync-build-full-timeout` and resolved for this scope by `command:T-0319:policy-timeout-resolution`. |
| AC-7 | Handoff is updated. | Done | Task and shared handoff route next work to Phase 8.2. |
