# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/cli/dashboard.ts` | Modified | Route legacy `/api/debt` to `createProjectedDashboardDebtReport()` instead of the broad operational-debt scan. | Done |
| `tests/unit/dashboard-static.test.ts` | Modified | Assert the legacy dashboard debt route returns the fast dashboard debt projection schema. | Done |
| `docs/TASK_BOARD.md` | Modified | Track T-0421 hotfix capsule. | Done |
| `docs/PROJECT_STATE.md` | Modified | Record the T-0421 release-validation hotfix before retrying T-0418. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Tell the next operator to refresh `/root/hadara-publish` to include T-0421 and rerun T-0418. | Done |
| `tasks/T-0421-clean-checkout-publish-smoke-failure-hardening/*` | Added | Hotfix capsule docs and evidence. | Done |
