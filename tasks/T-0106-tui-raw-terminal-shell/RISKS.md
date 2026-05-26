# Risks

| Risk | Mitigation |
|---|---|
| Raw terminal work accidentally becomes a public CLI surface. | Keep this capsule to an internal module and tests only; defer command registration to a later capsule. |
| Terminal redraw writes project files or evidence. | Limit writes to injected terminal output and add a no-project-file-write regression test. |
| Raw mode is left enabled after quit or errors. | Track whether the shell enabled raw mode and restore it during `stop()`. |
| Refresh behavior bypasses the tested state layer. | Route refresh/detail-refresh through the existing read-model and state completion actions. |
| ANSI terminal control makes snapshots hard to test. | Keep rendering text from the existing snapshot module and allow terminal control to be disabled in tests. |
