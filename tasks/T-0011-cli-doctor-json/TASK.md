# T-0011 CLI Doctor JSON

## Goal

Start CLI JSON normalization by giving `hadara doctor --json` a stable machine-readable envelope and explicit environment check results.

## Scope

- Add a versioned doctor JSON report.
- Keep human-readable `hadara doctor` output working.
- Include portable/project path checks without leaking secrets or private logs.
- Add tests for doctor report generation.
- Add Docker CLI smoke for `doctor --json`.

## Out of Scope

- Normalizing every CLI command in one slice.
- Provider authentication checks.
- Test runner auto-detection beyond bootstrap filesystem checks.
- Dashboard, MCP body, real provider adapters, and full agent loop.

## Status

Done
