# Decisions

- Keep `src/cli/task-json.ts` as a compatibility facade so existing CLI imports and tests do not churn while the implementation moves to `src/services/task-read-model.ts`.
- Preserve the existing MCP task list payload shape, including the MCP-local empty `issues` array, while sourcing task summaries from the shared service.
- Keep transport-specific envelopes separate from the shared read-model builders.
