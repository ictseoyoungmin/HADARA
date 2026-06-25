# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-finalize.ts` | Updated | Use audit verdict for drift classification and route drift to close repair plan. | Done |
| `src/task/task-lifecycle.ts` | Updated | Use audit verdict for lifecycle closed-valid/repair-required classification and omit undefined command fields. | Done |
| `tests/unit/task-finalize.test.ts` | Updated | Add close-source drift finalize coverage. | Done |
| `tests/unit/task-lifecycle.test.ts` | Updated | Add close-source drift lifecycle coverage. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Document finalize drift guidance behavior. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Updated | Document close-repair-plan path after unavoidable post-close edits. | Done |
| `dist/` | Updated | Refreshed built CLI from Docker build output. | Done |
