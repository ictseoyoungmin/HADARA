# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Extend the existing Playwright/axe visual gate instead of creating a second projection-only runner. | Accepted | A single gate keeps Phase 5.6 and Phase 5.7 dashboard states in one deterministic read-only fixture path. | `dashboard/visual-check.mjs` updated. |
| D-2 | Commit redacted projection fixtures for core, timeline, debt, and projection status states. | Accepted | The visual gate must exercise projection-first routes without reading live project paths or local cache files. | `dashboard/visual-fixtures/*.json`; static redaction test. |
| D-3 | Treat Docker/build failures as explicit validation gaps rather than weakening the visual/a11y acceptance language. | Accepted | The environment blocks host dependencies and Docker access, but the task should still preserve the intended validation contract for the next runnable environment. | TESTS/RISKS and AGENT_HANDOFF updated. |
