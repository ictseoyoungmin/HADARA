# Files

| Path | Action | Reason |
|---|---|---|
| `.gitignore` | Update | Keep `docs/specs/` ignored so the release/install/package-smoke plan remains local-only and is not committed to GitHub. |
| `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` | Preserve locally | Local-only supporting plan for workspace agents; intentionally ignored and not committed. |
| `docs/TEST_STRATEGY.md` | Update | Add tracked command-surface design markers for release readiness. |
| `src/services/operational-debt.ts` | Update | Add read-only release-gate readiness check for package-smoke command-surface markers. |
| `tests/unit/operational-debt.test.ts` | Update | Cover the new release-gate readiness check and issue-code mapping. |
| `docs/PROJECT_STATE.md` | Update | Record the new command-surface planning state. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0126 complete when validation passes. |
| `docs/TASK_BOARD.md` | Update | Track T-0126 status. |
| `docs/AGENT_HANDOFF.md` | Update | Capture current completion state, validation, and next step. |
| `tasks/T-0126-package-smoke-command-surface-design/*` | Update | Replace scaffold capsule docs and record evidence. |
