# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | `dev docker-check --sync-dist` requires a matching `--before-hash` when workspace dist has a pre-sync hash. | Accepted | This makes output sync fail closed when another actor changes workspace output between review and execution. | `src/dev/docker-check.ts`, `tests/unit/dev-docker-check.test.ts` |
| D-2 | `--allow-missing-before-hash` only allows sync when the pre-sync dist hash is unavailable. | Accepted | Missing state should be explicit, and the escape hatch should not bypass freshness review for an existing output artifact. | `src/dev/docker-check.ts`, `tests/unit/dev-docker-check.test.ts` |
| D-3 | `projectMutation:false` remains a compatibility alias while `outputMutation` reports actual dist sync execution. | Accepted | Preserves T-0261 vocabulary and prevents source mutation from being conflated with generated output mutation. | `src/dev/docker-check.ts`, `docs/CLI_JSON_CONTRACT.md` |
