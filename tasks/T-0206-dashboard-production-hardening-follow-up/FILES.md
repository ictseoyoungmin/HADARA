# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-cache.ts` | Modified | Add project fingerprint/reference helpers and cache key builder. | Done |
| `src/cli/dashboard.ts` | Modified | Use project-scoped cache keys for served aggregate routes. | Done |
| `src/services/dashboard-bootstrap.ts` | Modified | Add redacted project metadata and project-scoped disabled cache metadata. | Done |
| `src/services/dashboard-task-detail.ts` | Modified | Add redacted project metadata and project-scoped disabled cache metadata. | Done |
| `src/services/dashboard-timeline.ts` | Modified | Add redacted project metadata and project-scoped disabled cache metadata. | Done |
| `src/schemas/dashboard-bootstrap.schema.json` | Modified | Register redacted project source fields. | Done |
| `src/schemas/dashboard-task-detail.schema.json` | Modified | Register redacted project source fields. | Done |
| `src/schemas/dashboard-timeline.schema.json` | Modified | Register redacted project source fields. | Done |
| `docs/design/dashboard/index.html` | Modified | Fix sidebar view switching and long badge/source-chip layout. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Modified | Document project-scoped cache keys, redacted source metadata, and polling debug helper boundary. | Done |
| `docs/DASHBOARD_PRODUCTION_READINESS_REVIEW.md` | Modified | Record cache/source hardening as production-readiness follow-up. | Done |
| `docs/ROADMAP.md` | Modified | Carry forward T-0206 follow-up boundary and v1 source compatibility note. | Done |
| `tests/unit/dashboard-cache.test.ts` | Modified | Cover project fingerprint/cache key isolation. | Done |
| `tests/unit/dashboard-static.test.ts` | Modified | Cover nav switching markup/debug contract and project-scoped cache keys. | Done |
| `tests/unit/dashboard-bootstrap.test.ts` | Modified | Cover redacted project metadata and scoped cache key. | Done |
| `tests/unit/dashboard-task-detail.test.ts` | Modified | Cover redacted project metadata and scoped cache key. | Done |
| `tests/unit/dashboard-timeline.test.ts` | Modified | Cover redacted project metadata. | Done |
