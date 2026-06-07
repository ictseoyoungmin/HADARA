# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Generate a separate `docs/TASK_WORKFLOW_COMMANDS.md` for every init profile. | Accepted | Lifecycle semantics are core protocol guidance, not optional planning/governance material. | `src/cli/init.ts`; built init smoke. |
| D-2 | Keep generated lifecycle guidance generic and explicit rather than copying HADARA-dev's long Phase 6 metadata sections. | Accepted | Fresh projects need the current loop and write boundaries without inheriting HADARA-dev roadmap/history. | `tests/unit/init.test.ts` no-Hermes/MCP/default integration checks. |
