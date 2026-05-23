# T-0052 MCP Evidence Attach Approval Record

## Goal

Require an explicit per-call approval record for opt-in MCP evidence attach writes.

## Scope

- Add an `approval` input object to `hadara.evidence.attach`.
- Require an approval actor and reason before writing evidence.
- Record approval metadata in the private MCP audit event.
- Reject missing or invalid approval input before evidence collection.

## Out of Scope

- Cryptographic approval tokens.
- External operator identity provider integration.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
