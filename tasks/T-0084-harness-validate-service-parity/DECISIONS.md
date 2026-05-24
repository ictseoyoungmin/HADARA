# Decisions

- Keep `src/harness/validate.ts` as the implementation of validation rules and add `src/services/harness-service.ts` as the transport-facing report builder boundary.
- Do not change validation semantics in this capsule; this is a service parity refactor only.
- Leave harness replay service extraction for a future capsule if needed.
