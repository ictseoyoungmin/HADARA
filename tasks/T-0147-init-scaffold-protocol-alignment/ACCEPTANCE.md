# Acceptance Criteria

- [x] `hadara init` no longer creates `HERMES.md` or `.hermes.md` for any profile.
- [x] `hadara init` creates a `.gitignore` that protects HADARA local state and common generated outputs without overwriting existing ignore files.
- [x] Generated `AGENTS.md` contains general HADARA required reading/rules without HADARA-dev-specific MCP/Hermes docs.
- [x] Generated docs use stable sections and tables for SOP, project state, handoff, task board, development slices, security model, and test strategy.
- [x] Generated `IMPLEMENTATION_SOP.md` includes an init profile matrix and guidance for adding project-specific docs to required reading.
- [x] Root `docs/IMPLEMENTATION_SOP.md` uses the same generalized Required Reading, Init Profile Matrix, and scaffold structure standard that `hadara init` emits.
- [x] Focused init tests pass.
- [x] Docker `npm run check` passes.
- [x] Done-level harness validation for T-0147 passes.
- [x] Evidence is attached.
- [x] Handoff is updated.
