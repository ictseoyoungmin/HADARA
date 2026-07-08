# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Removed public routing for `task next`, `task show`, `task upgrade-scaffold`, `evidence collect`, `init register-doc`, `docs archive`, `handoff stale-problems`, and `ops status`. | `ev:T-0528:c1a644032e3e419c9d1d5ea8` |
| Deleted dead dedicated services/schemas/tests for `docs archive`, `handoff stale-problems`, and `task upgrade-scaffold`; updated focused command-surface docs/tests. | `ev:T-0528:c1a644032e3e419c9d1d5ea8` |
| Refreshed Docker-built `dist` after full validation passed. | `ev:T-0528:71dea0c06e9047c3be8f1a2e` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue command portfolio reduction with the deferred aliases or rename internal next-work projection if the `task-next` internal name remains confusing. | T-0528 intentionally kept `write preflight`, `policy check-shell`, old `package smoke`, lifecycle migration stubs, and the internal next-work projection out of scope. | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md`, `docs/COMMAND_SURFACE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Unknown retired commands now fall through to default help/exit 1 instead of structured redirect stubs. | External automation still calling the fully removed names will not receive `replacementCommand`. | Use canonical replacements documented in `docs/CLI_JSON_CONTRACT.md`; keep retained stubs only for migration surfaces deliberately left in scope. |
| `task status --json` still consumes an internal next-work projection whose source file is named `task-next.ts`. | The internal name can look like the deleted public command. | Treat as implementation detail or rename in a later cleanup capsule. |
