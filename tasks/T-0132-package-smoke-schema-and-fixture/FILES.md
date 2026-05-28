# Files

| Path | Action | Reason |
|---|---|---|
| `src/schemas/package-smoke.schema.json` | Add | Register the reduced package-smoke report contract. |
| `src/schemas/schema-index.json` | Update | Add `hadara.packageSmoke.v1` registry entry. |
| `src/core/schema.ts` | Update | Load package-smoke schema for runtime fixture validation. |
| `tests/fixtures/package-smoke/*.json` | Add | Deterministic success/failure/redaction/privacy/evidence fixtures. |
| `tests/unit/package-smoke-schema.test.ts` | Add | Validate fixtures and public-output omission constraints. |
| `tests/unit/schema-runtime.test.ts` | Update | Cover runtime package-smoke schema validation and rejection cases. |
| `tests/unit/schema-fixtures.test.ts` | Update | Keep registry alignment expectations current. |
| `tests/unit/operational-debt.test.ts` | Update | Guard release-gate non-execution of package smoke reports. |
| `docs/SCHEMAS.md` | Update | Document the new fixture and runtime validation posture. |
