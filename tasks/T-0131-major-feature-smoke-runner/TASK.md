# T-0131 Major Feature Smoke Runner

## Goal

Add a bounded read-only core feature smoke runner that future install, package, USB, and release smoke flows can reuse before they add installed-binary execution.

## Scope

- Add `hadara smoke run --profile core --json`.
- Cover the core feature surface: doctor, status, task list, tools list, TUI snapshot, and advisory release gate.
- Emit a reduced schema-backed report without raw logs, raw render output, package contents, private paths, or install/package mutation.
- Make clear in the report and docs that T-0131 uses service/read-model calls and does not execute an installed `hadara` binary, verify PATH/launcher wiring, or validate a package install.
- Validate registered sub-report schemas before marking a step passed.
- Keep `release-readiness` reserved and explicitly deferred until package smoke, install matrix evidence, and release artifacts exist.

## Out of Scope

- No package smoke execution.
- No installed binary, PATH, or launcher verification.
- No install matrix execution.
- No strict release-gate evidence cycle.
- No shell execution, provider calls, MCP write surface, artifact writes, evidence attachment, package install, or publish/deploy action.

## Status

Done
