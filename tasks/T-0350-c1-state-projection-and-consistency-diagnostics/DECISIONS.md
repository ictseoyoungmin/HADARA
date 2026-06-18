# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep the existing Phase 8 `hadara.stateProjection.v1` CLI report unchanged in T-0350. | Accepted | The C1 context graph schema embeds a compact state projection, but existing `state verify` consumers already use a richer report shape. | Existing `tests/unit/state-projection.test.ts` |
| D-2 | Build the compact C1 projection from extractor results instead of introducing a new authoritative state file. | Accepted | C1 and Work Item F both require read-only projection from canonical artifacts, not another source of truth. | `tests/unit/context-state-projection.test.ts`; `ev:T-0350:b540a670f64b48babe233d22`. |
