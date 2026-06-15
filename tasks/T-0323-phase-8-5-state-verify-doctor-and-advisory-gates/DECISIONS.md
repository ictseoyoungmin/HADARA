# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Reuse `hadara.stateProjection.v1` for `state verify` instead of adding a new verify schema. | Accepted | The command is a direct read of the projection; a second schema would duplicate the report contract without new semantics. | `src/cli/state.ts`, `tests/unit/state-projection.test.ts` |
| D-2 | Keep state consistency advisory in `ci gate --mode strict`. | Accepted | Phase 8.5 explicitly avoids strict historical blocking during rollout; proof/protocol/evidence blockers remain authoritative. | `src/services/ci-gate.ts`, `docs/COMMAND_SURFACE.md` |
| D-3 | Make ops status state consistency optional at the service level and enabled by CLI status. | Accepted | Common CLI status gets visibility while dashboard/TUI internal read models avoid accidentally inheriting a heavier projection pass. | `src/services/operations-status-service.ts`, `src/cli/status.ts` |
