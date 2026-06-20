# Findings

## Agent-Usage Finding

| Finding | Impact | Proposed Improvement | Status |
|---|---|---|---|
| `session start --json` correctly told the agent to run `task next --json`, but `task next --json` then promoted the handoff sentence "Run `task next --json` or select the next release/readiness capsule" into a `TBD` recommendation with `createCommand: hadara task create ...`. | An agent can create a nonsense capsule whose title is an instruction to run the same command again. | Treat command-selection meta-guidance as non-actionable handoff text and fall back to Development Slices or Task Board rows. | Implemented in T-0391. |
| After meta-guidance was ignored, Task Board fallback selected old `Partial` T-0006 before the active Draft T-0391 row. | An agent can be routed to legacy partial work instead of the current active capsule when no concrete handoff/development slice is available. | Prefer primary open statuses such as Draft/In Progress/Blocked before legacy Partial rows; keep Partial rows visible in backlog. | Implemented in T-0391. |

## Future Improvements

| Improvement | Reason | Suggested Boundary |
|---|---|---|
| Add structured `handoff.nextAction.kind` metadata in a future handoff suggestion/report surface. | Plain Markdown prose forces `task next` to infer whether text is concrete work or meta-guidance. | Future capsule; preserve current Markdown compatibility. |
| Add a low-severity `TASK_NEXT_HANDOFF_META_IGNORED` diagnostic when meta-guidance is skipped. | Agents might benefit from seeing why handoff was not used as the primary recommendation. | Future additive JSON issue if users want more transparency. |
| Consider a `task next --source` debug view. | It would help agents compare handoff, Development Slices, and Task Board candidate selection without reading raw docs. | Future read-only diagnostics only. |
