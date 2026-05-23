# T-0050 MCP Write Audit Log

## Goal

Record MCP evidence attach write attempts in the HADARA portable/private audit log.

## Scope

- Audit successful and failed `hadara.evidence.attach` calls when the tool is explicitly enabled.
- Keep audit records in the existing private portable audit store, not committed task evidence.
- Redact audit summaries and payloads through the existing audit writer.
- Preserve default MCP read-only startup behavior.

## Out of Scope

- New MCP write tools.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
