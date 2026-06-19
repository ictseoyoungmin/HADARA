# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Explicit line-range slicing returns original text with sourceHash/startLine/endLine. | Met | `tests/unit/context-slice.test.ts`, `ev:T-0369:905e29de909447c792f65df0` |
| AC-2 | Tail and keyword-window slicing work with configured budgets and merged overlapping windows. | Met | `tests/unit/context-slice.test.ts`, `ev:T-0369:905e29de909447c792f65df0` |
| AC-3 | Managed-section slicing returns exact marker-bounded text. | Met | `tests/unit/context-slice.test.ts`, `ev:T-0369:905e29de909447c792f65df0` |
| AC-4 | Unsafe paths, binary files, invalid ranges, and over-budget slices return structured issues without mutation. | Met | `tests/unit/context-slice.test.ts`, `tests/unit/context-graph-cli.test.ts`, `ev:T-0369:905e29de909447c792f65df0` |
| AC-5 | `hadara context slice ... --json` is registered, read-only, and schema-valid. | Met | `src/services/capability-registry.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts`, `ev:T-0369:fc46ecd5d91943e986e1af23` |
| AC-6 | Validation evidence and shared docs are updated. | Met | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md`, `docs/COMMAND_SURFACE.md`, `docs/SCHEMAS.md` |
