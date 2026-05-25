# T-0098 CLI Write Boundary Preflight

## Goal

Add a read-only CLI write-boundary preflight report so operators and future agents can inspect the project-relative files a CLI-owned write command is expected to touch before the write command runs.

## Scope

- Add a stable `hadara.write.preflight.v1` report shape.
- Add a CLI surface for `hadara write preflight <command...> --json`.
- Cover expected writes for current and planned CLI-owned write command families:
  - `task create`
  - `evidence collect`
  - `handoff update`
  - `run-state start/update/complete`
  - `debt add/update`
- Report project-relative paths only; do not execute the target command.
- Add focused unit tests for the report builder and CLI handler.

## Out of Scope

- Implementing new write commands for run-state or debt mutation.
- Changing existing task, evidence, handoff, dashboard, MCP, shell, provider, release, or audit execution behavior.
- Broad MCP writes, shell execution, provider calls, live dashboard streaming, or browser-state persistence.

## Status

Done
