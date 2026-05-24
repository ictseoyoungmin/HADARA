# Decisions

- Keep `src/harness/validate.ts` as the implementation of validation rules and add `src/services/harness-service.ts` as the transport-facing report builder boundary.
- Do not change validation semantics in this capsule; this is a service parity refactor only.
- Leave harness replay service extraction for a future capsule if needed.
- Use the conservative `task.read` evidence policy: exclude private evidence metadata by default and expose it only through explicit `includePrivate`.
- Keep `files["evidence.jsonl"]` as a sanitized view so the read model does not leak private evidence paths or raw summaries through the file payload.
