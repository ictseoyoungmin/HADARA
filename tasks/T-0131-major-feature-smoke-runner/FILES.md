# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/feature-smoke.ts` | Added | Shared read-only feature-smoke report builder for the `core` and deferred `release-readiness` profiles. |
| `src/cli/smoke.ts` | Added | CLI handler for `hadara smoke run`. |
| `src/cli/main.ts` | Updated | Dispatches the new `smoke` command and lists it in help. |
| `src/schemas/feature-smoke.schema.json` | Added | Fixture schema for `hadara.featureSmoke.v1`. |
| `src/schemas/schema-index.json` | Updated | Registers the feature-smoke schema fixture. |
| `src/core/schema.ts` | Updated | Adds runtime schema loading for `hadara.featureSmoke.v1`. |
| `src/services/capability-registry.ts` | Updated | Exposes `hadara smoke run --profile core --json` as a read-only CLI capability. |
| `tests/unit/feature-smoke.test.ts` | Added | Covers core report shape, redaction boundary, deferred profile, schema validation, and CLI JSON output. |
| `tests/unit/schema-runtime.test.ts` | Updated | Adds runtime fixture validation for feature-smoke reports. |
| `tests/unit/schema-fixtures.test.ts` | Updated | Expects the new schema registry entry. |
| `tests/unit/tools-list.test.ts` | Updated | Verifies capability discovery includes the new smoke command. |
| `docs/RELEASE_READINESS.md` | Updated | Records implemented core runner behavior and deferred release-readiness profile. |
| `docs/TEST_STRATEGY.md` | Updated | Records the core smoke runner as implemented. |
| `docs/SCHEMAS.md` | Updated | Documents `hadara.featureSmoke.v1` and its runtime validation posture. |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Marks T-0131 as done. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Updated | Marks T-0131 as done. |
| `docs/TASK_BOARD.md` | Updated | Marks the capsule done. |
| `docs/PROJECT_STATE.md` | Updated | Adds the current feature-smoke capability and boundary. |
| `docs/AGENT_HANDOFF.md` | Updated | Records T-0131 completion and next recommended step. |
