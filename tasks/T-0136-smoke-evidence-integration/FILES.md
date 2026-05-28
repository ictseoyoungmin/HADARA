# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/smoke-evidence.ts` | Add | Shared reduced public smoke evidence artifact writer and evidence index updater. |
| `src/services/package-smoke.ts` | Update | Attach reduced public package-smoke summaries when explicitly requested. |
| `src/services/clean-checkout-smoke.ts` | Update | Attach reduced public clean-checkout smoke summaries when explicitly requested. |
| `src/cli/smoke.ts` | Update | Parse clean-checkout evidence flags. |
| `src/cli/main.ts` | Update | Document clean-checkout evidence flags in help. |
| `src/schemas/clean-checkout-smoke.schema.json` | Update | Allow reduced public clean-checkout evidence artifact metadata. |
| `tests/unit/package-smoke-dry-run.test.ts` | Update | Cover local package-smoke evidence attachment and raw log omission. |
| `tests/unit/clean-checkout-smoke.test.ts` | Update | Cover clean-checkout evidence attachment and raw log omission. |
| `tasks/T-0136-smoke-evidence-integration/*` | Update | Record capsule scope, decisions, evidence, and handoff. |
| `docs/PROJECT_STATE.md` | Update | Record implemented smoke evidence integration. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0136 complete after validation. |
| `docs/TASK_BOARD.md` | Update | Move T-0136 to Done after validation. |
| `docs/AGENT_HANDOFF.md` | Update | Hand off the next release artifact builder slice. |
