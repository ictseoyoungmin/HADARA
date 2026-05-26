# Files

| Path | Action | Reason |
|---|---|---|
| `src/cli/tui.ts` | Add | Focused public TUI CLI handler over the internal terminal shell. |
| `src/cli/main.ts` | Update | Route `hadara tui` and list command usage in help. |
| `src/services/capability-registry.ts` | Update | Report `hadara tui` as a read-only CLI surface. |
| `src/tui/state.ts` | Update | Clear refresh/detail-refresh request flags for complete and failed completion signals. |
| `src/tui/terminal.ts` | Update | Allow the CLI wrapper to clean process listeners when an interactive session stops. |
| `tests/unit/tui-cli.test.ts` | Add | Cover public TUI command snapshot, JSON smoke, interactive startup/quit, and non-TTY refusal. |
| `tests/unit/tui-state.test.ts` | Update | Cover refresh/detail-refresh complete and failed completion signals. |
| `tests/unit/tools-list.test.ts` | Update | Assert capability discovery includes the read-only TUI command. |
| `tasks/T-0107-tui-public-cli-entry-point/*` | Update | Record scope, plan, acceptance, evidence, and handoff. |
