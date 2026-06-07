# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0281-1 | Keep `harness validate` out of the standard lifecycle loop but document it as a direct diagnostic. | Accepted | `task ready` and `task close` already include done-level validation; direct `harness validate` remains useful for debugging capsule-format failures. | Direct T-0280 harness validate smoke returned `ok:true`. |
| D-0281-2 | Add common Python/SQLite ignores to generated `.gitignore`. | Accepted | HADARA init is used for non-Node projects; venv/cache/SQLite artifacts are common local-state pollution in Python experiments. | Bookmark API experiment feedback. |
| D-0281-3 | Put evidence integrity rules in generated SOP and AGENTS. | Accepted | Anti-false-completion behavior depends on recording failed/blocked checks honestly and avoiding direct evidence index edits. | User review feedback. |
