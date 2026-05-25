# Decisions

Record task-local design decisions here.

- Provider config records use environment variable names such as `HADARA_OPENAI_API_KEY` instead of storing provider secret values.
- Provider call reports summarize message count, approximate token counts, finish reason, and normalized issues; they do not include prompt or response content.
- Real provider adapters remain disabled/deferred until a later slice adds explicit provider construction and operator-controlled execution.
- Provider config input unknown fields are denied rather than warned. This is stricter than the output schema and is intended for future config loader safety.
- Provider config and call report helpers run runtime schema validation before returning. Schema assertion failures become provider-specific errors instead of leaking raw schema internals.
- Provider-originated `ActionIntent` and provider call audit integration are intentionally deferred P2 work; actual adapters remain explicit opt-in plus policy gate only.
