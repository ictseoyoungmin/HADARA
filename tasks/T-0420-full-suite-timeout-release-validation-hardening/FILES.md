# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-bootstrap.ts` | Modified | Default bootstrap report now uses `core` first-paint tier unless `tier=full` is explicit. | Done |
| `tests/unit/dashboard-bootstrap.test.ts` | Modified | Update expectations for core default cache key and pending debt summary. | Done |
| `vitest.config.ts` | Modified | Add explicit 30s test/hook timeout with environment overrides. | Done |
| `tasks/T-0420-full-suite-timeout-release-validation-hardening/*` | Added/updated | Capsule docs and evidence. | Done |
| `docs/TASK_BOARD.md` | Updated | Register T-0420 release-validation hardening. | Done |
| `docs/PROJECT_STATE.md` | Updated | Record T-0420 release-validation hardening and T-0418 retry boundary. | Done |
| `docs/AGENT_HANDOFF.md` | Updated | Route next operator action to refresh publish clone to T-0420 before T-0418 retry. | Done |
