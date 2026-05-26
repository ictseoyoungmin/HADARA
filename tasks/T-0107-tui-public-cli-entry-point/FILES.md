# Files

| Path | Action | Reason |
|---|---|---|
| `src/cli/tui.ts` | Add | Focused public TUI CLI handler over the internal terminal shell. |
| `src/cli/main.ts` | Update | Route `hadara tui` and list command usage in help. |
| `src/services/capability-registry.ts` | Update | Report `hadara tui` as a read-only CLI surface. |
| `tests/unit/tui-cli.test.ts` | Add | Cover public TUI command snapshot, JSON smoke, interactive startup/quit, and non-TTY refusal. |
| `tests/unit/tools-list.test.ts` | Update | Assert capability discovery includes the read-only TUI command. |
| `tasks/T-0107-tui-public-cli-entry-point/*` | Update | Record scope, plan, acceptance, evidence, and handoff. |
