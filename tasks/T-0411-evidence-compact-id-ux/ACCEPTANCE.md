# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara evidence summary --task <task-id> --json` returns compact records, latest evidence, latest close evidence, copy hints, and issues without writing files. | Met | `src/services/evidence-summary.ts`, `tests/unit/evidence-summary.test.ts` |
| AC-2 | CLI text mode stays compact while JSON keeps full evidence data. | Met | `src/cli/evidence.ts`, built CLI smoke in `ev:T-0411:0072b5ef53bb42378fe5c58b` |
| AC-3 | Schema, command registry, and docs are updated without changing existing `evidence list` semantics. | Met | `src/schemas/evidence-summary.schema.json`, `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/SCHEMAS.md` |
| AC-4 | Validation evidence is attached and handoff/state docs are updated. | Met | `ev:T-0411:0072b5ef53bb42378fe5c58b`, `ev:T-0411:6f895f21f1de4a4d829b3c17`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md` |
