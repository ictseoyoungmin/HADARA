# T-0113 TUI Async Loading and Read-Model Performance Refactor

## Goal

Restore production TUI responsiveness closer to the mockup by avoiding full synchronous aggregate reads on startup, selected-detail refresh, and normal refresh.

## Scope

- Add a TUI fast read-model profile that loads status/task/active-run/selected detail surfaces while deferring expensive debt, release-gate, tools, and write-preflight advisory reads.
- Route the interactive terminal startup, selected-detail refresh, and refresh key through the fast profile.
- Make TUI cache indexing tolerate task directories whose `TASK.md` is missing, so stale/malformed capsules degrade instead of disabling cache writes.
- Record measured before/after timing evidence against the current `/workspace`.
- Preserve read-only TUI boundaries.

## Out of Scope

- TUI writes, shell execution, provider calls, MCP calls, dashboard/server behavior, release/package automation, and task/evidence/handoff mutation.
- Full worker-thread loader architecture for every TUI data source.
- Changing CLI snapshot mode to fast/deferred data; snapshot remains a full deterministic read unless explicitly changed later.

## Status

Done
