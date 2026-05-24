# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/active-run-state.ts` | Update | Add safe projection fallback and missing task warning. |
| `src/cli/status-json.ts` | Update | Use safe active run projection for status JSON. |
| `src/services/operational-debt.ts` | Update | Tighten premature acceptance and valid evidence checks. |
| `src/services/project-read-model.ts` | Update | Match section headings by line. |
| `tests/unit/active-run-state.test.ts` | Update | Cover malformed manifest, missing task, and robust handoff setup. |
| `tests/unit/status-json.test.ts` | Update | Cover degraded status when active run local state is malformed. |
| `tests/unit/operational-debt.test.ts` | Update | Cover expanded premature acceptance cases and invalid evidence lines. |
| `tests/contract/cli-mcp-service-parity.test.ts` | Update | Cover line-based shared section extraction. |
| `docs/PROJECT_STATE.md` | Update | Record robustness fix. |
| `docs/TASK_BOARD.md` | Update | Record T-0070 completion. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh compact handoff and validation baseline. |
| `tasks/T-0070-operations-state-robustness-fix/*` | Add | Task Capsule docs and evidence. |
