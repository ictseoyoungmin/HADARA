# Decisions

- The public command is `hadara install plan`; it emits `hadara.install.plan.v1`.
- `linux` is the user-facing Linux platform. `posix` remains accepted as a compatibility alias for Linux-style install planning.
- Dry-run planning is read-only: actions describe `wouldWrite: true` future steps but perform no filesystem, PATH, shell profile, package, registry, or release mutation.
- `--mode dry-run` is the only successful mode in T-0129.
- `--mode execute` is accepted only to return a schema-valid disabled report with `INSTALL_EXECUTION_DISABLED`; it does not execute or partially execute installer behavior.
- User-supplied absolute source, prefix, and launcher paths are not echoed in public output. Source and target fields use `pathRedacted: true` plus safe display/relative values.
- Node 22 and WSL Windows-shim checks are reported in the plan; WSL Windows `node.exe` shims are treated as errors.
- The command is registered as a low-risk read-only CLI capability and has no MCP surface in this capsule.
