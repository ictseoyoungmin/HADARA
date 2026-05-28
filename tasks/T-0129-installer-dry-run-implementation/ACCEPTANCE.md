# Acceptance Criteria

- [x] `hadara install plan --json` emits a `hadara.install.plan.v1` report.
- [x] Linux is explicit as `--platform linux`, with `posix` retained as a compatibility alias.
- [x] USB planning requires an explicit `--usb-root` or `--target` and does not assume a drive letter or mount path.
- [x] `wouldWrite: true` semantics are documented as future confirmed execute/apply writes, not dry-run writes.
- [x] Dry-run plans describe planned writes without performing installation mutation.
- [x] Public source/target path fields use `pathRedacted: true` and do not echo private absolute paths.
- [x] `--mode execute` returns `INSTALL_EXECUTION_DISABLED` instead of executing installation.
- [x] Node 22 and WSL Windows-shim checks are represented in the report.
- [x] Package metadata includes `"license": "MIT"` without changing `private: true` publish blocking.
- [x] Capability discovery marks the command as read-only.
- [x] Focused tests cover schema validity, redaction, execute-disabled behavior, and CLI JSON output.
- [x] Docker full validation passes.
- [x] Evidence is attached and handoff is updated.
