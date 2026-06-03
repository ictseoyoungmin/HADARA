# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use per-command dynamic imports in `main.ts` instead of top-level handler imports. | Accepted | `main()` is already async, and TUI snapshot should not pay unrelated command module startup cost. | Built snapshot 1.37s |
| D-2 | Keep the public CLI command surface unchanged. | Accepted | This is a startup/import refactor, not a behavior change. | Focused and full tests passed |
