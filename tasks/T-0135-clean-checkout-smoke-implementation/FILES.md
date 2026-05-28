# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/clean-checkout-smoke.ts` | Add | Build reduced clean-checkout smoke reports and run the disposable source sequence. |
| `src/cli/smoke.ts` | Update | Add `hadara smoke clean-checkout --execute --json`. |
| `src/cli/main.ts` | Update | Document the clean-checkout smoke command. |
| `src/schemas/clean-checkout-smoke.schema.json` | Add | Register reduced clean-checkout smoke report schema. |
| `src/schemas/schema-index.json` | Update | Register `hadara.cleanCheckoutSmoke.v1`. |
| `src/core/schema.ts` | Update | Make the new schema runtime-loadable. |
| `src/services/capability-registry.ts` | Update | Advertise the explicit clean-checkout smoke surface and boundaries. |
| `tests/unit/clean-checkout-smoke.test.ts` | Add | Cover source immutability, reduced reports, cleanup, and failure behavior. |
| `tests/unit/schema-runtime.test.ts` | Update | Cover clean-checkout smoke schema validation. |
| `tests/unit/schema-fixtures.test.ts` | Update | Include the new schema id. |
| `tasks/T-0135-clean-checkout-smoke-implementation/*` | Update | Record scope, evidence, and handoff. |
| `docs/PROJECT_STATE.md` | Update | Record implemented clean-checkout smoke capability. |
| `docs/TASK_BOARD.md` | Update | Mark T-0135 complete after validation. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Move T-0135 slice to Done after validation. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Update | Update release/package-smoke backlog state. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh current state, validations, and next step. |
