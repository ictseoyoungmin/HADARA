# Acceptance Criteria

- [x] `hadara.provider.config.v1` and `hadara.provider.call.v1` schema fixtures are registered and runtime-loadable.
- [x] Provider config normalization rejects secret values while allowing secret environment variable names.
- [x] Provider call report helpers summarize requests/responses/errors without leaking message content or secret-like text.
- [x] Provider config/call helpers assert runtime schema validity before returning reports.
- [x] Provider config input denies unknown fields and rejects invalid provider id, kind, booleans, and cost profile values at runtime.
- [x] Event model exposes an optional schema assertion helper.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
