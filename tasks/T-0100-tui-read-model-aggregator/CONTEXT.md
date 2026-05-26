# Context

T-0099 established that the TUI should start as a read-only local terminal work console over existing read models. This capsule implements only the aggregation layer required by later renderer and interactive shell slices.

Relevant references:

- `docs/design/TUI_DESIGN_NOTES.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` section "Terminal TUI Read Model Aggregation"
- `src/services/operations-status-service.ts`
- `src/services/task-read-model.ts`
- `src/services/evidence-list.ts`
- `src/services/active-run-state.ts`
- `src/services/operational-debt.ts`
- `src/services/tools-list.ts`
- `src/services/write-preflight.ts`

The aggregator must use direct TypeScript service calls, not CLI subprocesses. It must not write cache/state files.
