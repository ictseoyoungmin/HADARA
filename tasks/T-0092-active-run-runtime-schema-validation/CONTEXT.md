# Context

Relevant documents, files, assumptions, and constraints.

- `docs/IMPLEMENTATION_SOP.md`: use one Task Capsule, Docker validation, evidence before Done.
- `docs/DEVELOPMENT_SLICES.md`: slice 66b is Active Run Runtime Schema Validation.
- `docs/V1_0_CAPSULE_BACKLOG.md`: active-run projection/resume runtime validation is a P1 hardening candidate.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`: active-run projection/resume schemas are priority runtime-validation candidates because they read mutable local state.
- `docs/SCHEMAS.md`: runtime validation should keep CLI/MCP envelopes separate from shared read-model schemas and avoid broad release-gate enforcement for now.
- `src/services/active-run-state.ts`: shared active-run projection/resume report builders used by CLI, MCP, and operations status.
- `src/schemas/active-run-projection.schema.json` and `src/schemas/active-run-resume.schema.json`: fixture schemas to validate at runtime for this slice.
