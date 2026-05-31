# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `scripts/dev-docker-sync-build.sh` wraps temp-copy, `npm ci`, `npm run check`, optional dist refresh, and built CLI smoke. | Done | Helper script and end-to-end helper evidence. |
| AC-2 | `npm run dev:docker-check` and `npm run dev:docker-sync-build` are available. | Done | `package.json`; tests. |
| AC-3 | Script syntax and package wiring are covered by tests. | Done | `tests/unit/dev-docker-script.test.ts`. |
| AC-4 | SOP/Test Strategy document the helper. | Done | `docs/IMPLEMENTATION_SOP.md`; `docs/TEST_STRATEGY.md`. |
| AC-5 | Evidence, handoff, close audit, and commit are completed. | Done | Evidence and handoff are complete; close/audit and commit are the final completion actions. |
