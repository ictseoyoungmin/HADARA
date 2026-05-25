# T-0096 Real Provider Adapter Preparation

## Goal

Prepare the real provider adapter boundary with schema-backed contracts and safe report helpers, without implementing network provider calls or making real provider execution the default path.

## Scope

- Define `hadara.provider.config.v1` and `hadara.provider.call.v1` schema fixtures and register them in the schema index/runtime loader.
- Add small provider contract helpers for normalizing provider config records and provider call reports.
- Ensure provider config and call reports do not expose secret values; only environment variable names and redacted summaries may appear.
- Add focused tests for schema validation, provider call reporting, secret redaction, and the no-default-real-provider boundary.
- Document the provider adapter preparation constraints in task-local context.

## Out of Scope

- Real provider SDK adapters.
- Network provider calls.
- Provider settings CLI, MCP provider call tools, dashboard APIs, or new write-capable surfaces.
- Secret storage, encrypted credentials, or provider key loading.
- Provider-originated tool execution.

## Status

Done
