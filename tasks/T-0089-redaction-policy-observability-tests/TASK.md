# T-0089 Redaction Policy Observability Tests

## Goal

Prove public evidence artifact redaction policy decisions expose safe diagnostic metadata without leaking raw secret content or prematurely blocking future medium-severity findings.

## Scope

- Add a safe public artifact policy report helper for redaction decisions.
- Allow tests to inject a diagnostic redaction pattern so medium findings exercise the full evidence artifact policy path.
- Keep high/critical findings blocking public evidence artifacts.
- Keep user-facing evidence collect errors limited to code/message and free of raw redaction reports.
- Document that observability metadata is pattern id, severity, count, and byte counts only.

## Out of Scope

- No security CLI, MCP tool, dashboard panel, or broad evidence inspection surface.
- No change to default redaction pattern severities.
- No automatic artifact rewriting or sanitizing mode.
- No private evidence manifest or policy matrix refactor.

## Status

Done
