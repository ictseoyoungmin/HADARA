# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, T-0382 capsule, Session Start spec, audit, source, schema, and tests. | Done | Reviewed AGENTS/current-state docs, spec 03, audit 09, `src/context/session-start.ts`, `src/cli/session.ts`, schema, and tests. |
| 2 | Add structured Session Start guidance and no-task degraded-ok behavior. | Done | `src/context/session-start.ts` |
| 3 | Update focused tests/schema for the new UX contract. | Done | `tests/unit/session-start.test.ts`, `tests/unit/context-graph-cli.test.ts`, `src/schemas/session-start.schema.json` |
| 4 | Run focused validation and built CLI smoke. | Done | `ev:T-0382:93c876280718445e833270ba` |
| 5 | Attach evidence and prepare lifecycle close. | Done | `ev:T-0382:93c876280718445e833270ba` |
