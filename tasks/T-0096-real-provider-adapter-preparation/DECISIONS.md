# Decisions

Record task-local design decisions here.

- Provider config records use environment variable names such as `HADARA_OPENAI_API_KEY` instead of storing provider secret values.
- Provider call reports summarize message count, approximate token counts, finish reason, and normalized issues; they do not include prompt or response content.
- Real provider adapters remain disabled/deferred until a later slice adds explicit provider construction and operator-controlled execution.
