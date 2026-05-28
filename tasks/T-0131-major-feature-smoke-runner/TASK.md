# T-0131 Major Feature Smoke Runner

## Goal

Add a bounded read-only major-feature smoke runner that can be reused by future install, package, USB, and release smoke flows.

## Scope

- Add `hadara smoke run --profile core --json`.
- Cover the core installed-CLI feature set: doctor, status, task list, tools list, TUI snapshot, and advisory release gate.
- Emit a reduced schema-backed report without raw logs, raw render output, package contents, private paths, or install/package mutation.
- Keep `release-readiness` reserved and explicitly deferred until package smoke, install matrix evidence, and release artifacts exist.

## Out of Scope

- No package smoke execution.
- No install matrix execution.
- No strict release-gate evidence cycle.
- No shell execution, provider calls, MCP write surface, artifact writes, evidence attachment, package install, or publish/deploy action.

## Status

Done
