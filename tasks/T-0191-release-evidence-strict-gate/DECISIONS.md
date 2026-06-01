# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Release gate checks should call strict release proof helpers per expected category/mode. | Accepted | Avoids duplicated summary heuristics and aligns release readiness with Phase 4 evidence semantics. | `src/services/operational-debt.ts` |
| D-2 | Release gate remains read-only. | Accepted | This capsule must not execute smoke/package/publish/GitHub Release work. | No execution surfaces changed. |
