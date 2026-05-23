# T-0051 MCP Phase/Mode Config

## Goal

Make MCP initialize metadata and instructions accurately reflect the current server phase and write mode.

## Scope

- Report read-only metadata when evidence attach is disabled.
- Report write-capable evidence attach metadata when `--enable-evidence-attach` is enabled.
- Include explicit shell/provider disabled metadata in both modes.
- Keep tool advertisement aligned with initialize metadata.

## Out of Scope

- New MCP write tools.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
