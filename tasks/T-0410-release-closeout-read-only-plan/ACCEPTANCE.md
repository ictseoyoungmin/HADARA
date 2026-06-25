# Acceptance Criteria

T-0410 covers the 0.3.4 release closeout read-only planning surface.

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `release closeout --version <version> --task <task-id> --json` lists release docs, shared state docs, and selected capsule docs as current/stale/missing. | Met | `src/services/release-closeout.ts`, `tests/unit/release-closeout.test.ts` |
| AC-2 | Report provides suggested fragments without writing files or mutating release state. | Met | `src/services/release-closeout.ts`, `tests/unit/release-closeout.test.ts` |
| AC-3 | Schema, command registry, and docs contract entries are updated. | Met | `src/schemas/release-closeout.schema.json`, `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/SCHEMAS.md` |
| AC-4 | Validation evidence is attached and handoff/state docs are updated. | Met | `ev:T-0410:299ccfde6ed84a22bc1e6a2e`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md` |
