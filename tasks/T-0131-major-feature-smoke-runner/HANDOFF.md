# Handoff

## Last Completed

T-0131 implemented a read-only major-feature smoke runner:

- `hadara smoke run --profile core --json` emits `hadara.featureSmoke.v1`.
- Core steps cover doctor, status, task list, tools list, TUI snapshot, and advisory release gate.
- Reports are reduced summaries only and record `executionMode: "service-read-model"`, `binaryExecuted: false`, `launcherChecked: false`, and `packageInstallChecked: false`.
- Registered sub-report schemas are validated before a step is marked passed; unregistered sub-report schemas are marked as not registered.
- Reports avoid raw logs, raw TUI render output, package contents, private paths, installed-binary execution, package/install execution, artifact writes, provider calls, shell execution, and MCP writes.
- `release-readiness` is reserved but returns `FEATURE_SMOKE_PROFILE_DEFERRED` until package smoke, install matrix evidence, and release artifact evidence exist.

## Next Recommended Step

T-0132 Package Smoke Schema and Fixture should register and fixture `hadara.packageSmoke.v1` before any package-smoke execution.
