# Risks

| Risk | Mitigation |
|---|---|
| Subprocess reports leak raw npm logs or private paths. | Store only reduced summaries, exit codes, elapsed time, redacted commands, and sanitized issue codes in public output. |
| Package smoke deletes an unsafe workspace path. | Use generated temp workspaces by default and only clean up created disposable workspaces outside the project root. |
| Dry-run behavior regresses into execution. | Keep dry-run as the default path and require explicit `--execute` for local mode, with focused regression tests. |
| Package install mutates global npm state. | Use `npm install -g --prefix <temp-prefix>` in the disposable workspace/prefix only. |
| Evidence integration scope expands too early. | Keep actual evidence attachment deferred to T-0136 while preserving reduced report fields and public-safe output. |
