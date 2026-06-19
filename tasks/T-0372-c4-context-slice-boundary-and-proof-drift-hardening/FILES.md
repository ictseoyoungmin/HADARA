# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-slice.ts` | modify | Enforce byte budget and deny `.hadara/local` raw reads. | Done |
| `tests/unit/context-slice.test.ts` | modify | Cover byte-budget hard failure and local boundary rejection. | Done |
| `src/harness/validate.ts` | modify | Treat `In Progress` acceptance rows as incomplete at Done level. | Done |
| `src/services/protocol-consistency.ts` | modify | Report Done-task acceptance rows with `In Progress` as drift. | Done |
| `tests/harness/harness-validate.test.ts` | modify | Regression for `In Progress` acceptance rows. | Done |
| `tests/unit/protocol-consistency.test.ts` | modify | Regression for protocol doctor acceptance drift. | Done |
| `tasks/T-0370-c4-symbol-and-context-candidate-slicing/ACCEPTANCE.md` | modify | Repair reported AC-6 drift. | Done |
| `docs/COMMAND_SURFACE.md` | modify | Document context slice byte/local boundary. | Done |
| `docs/SCHEMAS.md` | modify | Document `CONTEXT_SLICE_TOO_LARGE` as hard payload-budget failure. | Done |
| T-0372 task docs | modify | Record scope, validation, evidence, risks, and handoff. | Done |
