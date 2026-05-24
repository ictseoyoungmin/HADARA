# T-0076 Evidence List Read Model

## Goal

Add a stable evidence list read model for Task Capsule evidence records so CLI, MCP, and future dashboard surfaces can consume the same degraded-read report.

## Scope

- Add a `hadara.evidence.list.v1` report builder for one Task Capsule.
- Parse `evidence.jsonl` as a degraded read: malformed lines become warning issues instead of crashes.
- Support `limit` and `includePrivate` options while exposing private evidence metadata only.
- Expose the read model through `hadara evidence list --json`.
- Advertise and handle read-only MCP tool `hadara.evidence.list`.
- Add focused unit/contract coverage for valid records, filtering, limits, malformed JSONL, CLI JSON, and MCP dispatch.

## Out of Scope

- Dashboard timeline/API integration.
- Private evidence artifact manifesting, hashing, retention, or encryption.
- Mutating evidence records.
- Broad service parity beyond the evidence list read model.
- Context export, tools list, active-run, or debt MCP tools.

## Status

Done
