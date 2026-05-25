# Context

Relevant documents, files, assumptions, and constraints.

- `docs/AGENT_HANDOFF.md`: lists P1/P2 follow-ups after T-0093.
- `docs/SCHEMAS.md`: schemas are fixtures with limited active-run runtime validation; no broad release gate is active.
- `src/evidence/private-manifest.ts`: writes private raw bytes and manifest records to the ignored portable store.
- `src/services/active-run-state.ts`: `safeCreateActiveRunProjection()` currently degrades all thrown errors as `ACTIVE_RUN_MANIFEST_INVALID`.
- `src/services/operational-debt.ts`: owns `hadara.releaseGate.v1` report creation.
- `src/core/schema.ts`: loads registered schema fixtures and provides the lightweight validator.
