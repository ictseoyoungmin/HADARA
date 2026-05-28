# Files

| Path | Action | Reason |
|---|---|---|
| `docs/RELEASE_READINESS.md` | Add | Dedicated tracked source for release/install/package readiness details starting with installer surface/schema. |
| `src/schemas/install-plan.schema.json` | Add | Register the future `hadara.install.plan.v1` dry-run install planning report shape. |
| `src/schemas/schema-index.json` | Update | Add the install plan schema fixture entry. |
| `src/core/schema.ts` | Update | Register the install plan schema for runtime fixture validation. |
| `docs/SCHEMAS.md` | Update | Document the new install plan schema fixture. |
| `src/services/operational-debt.ts` | Update | Add a read-only release-gate readiness check for installer surface/schema markers. |
| `tests/unit/schema-fixtures.test.ts` | Update | Expect the new schema fixture in the index. |
| `tests/unit/schema-runtime.test.ts` | Update | Validate a representative install plan report. |
| `tests/unit/operational-debt.test.ts` | Update | Cover the new release-gate readiness check and issue-code mapping. |
| `docs/PROJECT_STATE.md` | Update | Record the installer surface/schema readiness state. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0128 complete when validation passes. |
| `docs/TASK_BOARD.md` | Update | Track T-0128 status. |
| `docs/AGENT_HANDOFF.md` | Update | Capture completion state, validation, and next step. |
| `tasks/T-0128-installer-script-surface-and-schema/*` | Update | Replace scaffold capsule docs and record evidence. |
