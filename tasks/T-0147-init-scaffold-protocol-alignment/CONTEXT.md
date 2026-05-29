# Context

Relevant documents and files:

- `AGENTS.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `src/cli/init.ts`
- `tests/unit/init.test.ts`

User direction:

- Do not create Hermes-related files or guidance from default init; Hermes-agent compatibility is deferred and not validated enough for default scaffolds.
- Make generated `AGENTS.md` structurally similar to this repository's `AGENTS.md`, but remove HADARA-dev-specific references such as MCP/Hermes contract docs.
- Add `.gitignore`.
- Define an init option/profile matrix and keep security/release smoke tests special-case only.
- Provide a way, at least in guidance, for manually added project docs to be connected through `docs/IMPLEMENTATION_SOP.md`.
- Generated docs should have stable headings/tables/items so different agents do not invent incompatible structures under the same filenames.
