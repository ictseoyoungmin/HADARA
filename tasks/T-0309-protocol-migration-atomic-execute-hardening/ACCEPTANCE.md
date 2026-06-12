# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `protocol migrate --execute` validates all planned file hashes before writing any file. | Done | `src/services/protocol-migration.ts`; focused tests. |
| AC-2 | If any protocol migration preflight conflict exists, no planned migration file is written. | Done | Focused regression covers no stale before-hash writes and all-file conflict behavior. |
| AC-3 | Protocol migration prepares temp files before commit and rolls back already-renamed files when a later commit fails. | Done | `tests/unit/protocol-migration.test.ts`; `ev:T-0309:59a8a94ad9e64595b2e71f50` |
| AC-4 | `docs mark --execute` writes `.hadara/docs-registry.json` through temp+rename and reports write failures without corrupting the registry. | Done | `tests/unit/docs-mark.test.ts`; `ev:T-0309:59a8a94ad9e64595b2e71f50` |
| AC-5 | rc.2 hardening plan and development slices insert T-0309 and shift release readiness/recycle numbering to T-0310/T-0311. | Done | rc.2 spec and `docs/DEVELOPMENT_SLICES.md`. |
| AC-6 | Focused tests, build/dist sync, built smokes, and whitespace check pass with evidence attached. | Done | `ev:T-0309:59a8a94ad9e64595b2e71f50` |
