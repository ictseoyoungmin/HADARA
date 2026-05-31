# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-finish.ts | Updated | Add write hashes, expected existence, malformed frame guards, no-op guards, temp-file/rename writes, conflict checks, and rollback-attempt behavior. | Done |
| src/task/task-next.ts | Updated | Shell-quote `createCommand` titles. | Done |
| tests/unit/task-finish.test.ts | Updated | Cover hash metadata, malformed Task Board refusal, and broken TASK.md frame refusal. | Done |
| tests/unit/task-next.test.ts | Updated | Cover quoted title createCommand output. | Done |
| docs/CLI_JSON_CONTRACT.md | Updated | Document task finish write safety metadata and execute behavior. | Done |
| docs/PROJECT_STATE.md | Updated | Record T-0184 completion and next state. | Done |
| docs/AGENT_HANDOFF.md | Updated | Carry forward T-0184 validation baseline. | Done |
| docs/DEVELOPMENT_SLICES.md | Updated | Add/mark T-0184 follow-up slice. | Done |
