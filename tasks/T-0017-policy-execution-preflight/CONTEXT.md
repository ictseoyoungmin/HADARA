# Context

- `docs/AGENT_HANDOFF.md` recommends policy execution preflight before ShellTool execution.
- T-0013 normalized `policy check-shell --json`.
- This slice converts policy decisions into an execution-facing gate without executing commands.
- ShellTool remains intentionally unimplemented.

