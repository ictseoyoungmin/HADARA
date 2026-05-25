# Risks

| Risk | Mitigation |
|---|---|
| Provider preparation accidentally becomes real provider execution. | Keep this slice schema/helper/test-only, with no SDK dependency, no network calls, and no CLI/MCP provider call surface. |
| Secret values leak through provider config or call reports. | Store only env var names in config and redact report summaries/errors with existing redaction helpers. |
| Provider-originated actions bypass policy. | Keep provider action execution out of scope and document that future intents must pass through shared policy services. |
