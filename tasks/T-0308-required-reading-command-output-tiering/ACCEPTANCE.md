# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `docs required-reading --json` includes additive `tier` fields on effective `documents` entries and `excluded` entries. | Done | `src/services/docs-cleanup.ts`; `ev:T-0308:dc2e7cb2cc574dc8964e51be` |
| AC-2 | `.hadara/context/HADARA_CONTEXT.md` appears as `current-state` when registered. | Done | Unit and built CLI smoke evidence. |
| AC-3 | Task workflow docs appear as `task-work`. | Done | Unit and built CLI smoke evidence. |
| AC-4 | Conditional docs appear as `conditional-reference`. | Done | Unit and built CLI smoke evidence. |
| AC-5 | Historical docs appear as `historical`; superseded/archived docs appear as `excluded`. | Done | `tests/unit/docs-required-reading.test.ts` |
| AC-6 | Schema fixtures and docs are updated while preserving existing `documents` and `excluded` arrays. | Done | `src/schemas/docs-required-reading.schema.json`, `docs/SCHEMAS.md`, focused schema fixture test. |
| AC-7 | Focused validation, build, built CLI smoke, and whitespace check pass with evidence attached. | Done | `ev:T-0308:dc2e7cb2cc574dc8964e51be` |
