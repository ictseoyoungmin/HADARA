# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/cli/actor.ts` | Add | Shared parser for optional actor CLI flags. | Done |
| `src/cli/task.ts` | Update | Pass actor context into task lifecycle report builders. | Done |
| `src/cli/handoff.ts` | Update | Pass actor context into handoff suggestion reports. | Done |
| `src/cli/dev.ts` | Update | Pass actor context into dev docker-check reports. | Done |
| `src/task/task-finish.ts` | Update | Accept optional actor context while preserving defaults. | Done |
| `src/task/task-ready.ts` | Update | Accept optional actor context and pass it to close preflight. | Done |
| `src/task/task-close.ts` | Update | Accept optional actor context for close and audit reports. | Done |
| `src/task/task-complete-flow.ts` | Update | Accept optional actor context and pass it to composed lifecycle reports. | Done |
| `src/handoff/handoff-suggestion.ts` | Update | Accept optional actor context while staying read-only. | Done |
| `tests/unit/*` | Update | Add focused CLI/report actor plumbing regressions. | Done |
