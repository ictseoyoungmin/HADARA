# Context

T-0048 introduced opt-in `hadara.evidence.attach`, and T-0049 added safety tests. The next required operational layer is private audit logging for write-capable MCP calls.

The existing `src/core/audit.ts` writer stores redacted JSONL audit events under the portable data root.
