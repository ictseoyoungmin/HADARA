# Acceptance Criteria

- [x] `hadara install plan --json` emits a `hadara.install.plan.v1` report.
- [x] Linux is explicit as `--platform linux`, with `posix` retained as a compatibility alias.
- [x] Dry-run plans describe planned writes without performing installation mutation.
- [x] Public source/target path fields use `pathRedacted: true` and do not echo private absolute paths.
- [x] `--mode execute` returns `INSTALL_EXECUTION_DISABLED` instead of executing installation.
- [x] Node 22 and WSL Windows-shim checks are represented in the report.
- [x] Capability discovery marks the command as read-only.
- [x] Focused tests cover schema validity, redaction, execute-disabled behavior, and CLI JSON output.
- [x] Docker full validation passes.
- [x] Evidence is attached and handoff is updated.
