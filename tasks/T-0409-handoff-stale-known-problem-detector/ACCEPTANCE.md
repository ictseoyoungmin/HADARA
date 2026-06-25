# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `handoff stale-problems --json` reports read-only stale known-problem candidates with reason, matched sources, and suggested action. | Met | `src/handoff/handoff-stale-problems.ts`, `src/cli/handoff.ts` |
| AC-2 | Schema, command registry, and docs contract entries are updated. | Met | `src/schemas/handoff-stale-problems.schema.json`, `src/schemas/schema-index.json`, `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/SCHEMAS.md` |
| AC-3 | Tests or explicit constraints are recorded. | Met | `ev:T-0409:50fc016e8af6435ba6fa7838`, `ev:T-0409:733b5dd43ab7400ab1e77e87` |
| AC-4 | Evidence is attached and handoff/state docs are updated. | Met | `tasks/T-0409-handoff-stale-known-problem-detector/EVIDENCE.md`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md` |
