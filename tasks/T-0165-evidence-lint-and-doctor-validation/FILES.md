# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/services/evidence-lint.ts | Add | Read-only evidence JSONL/Markdown lint report. | Done |
| src/cli/evidence.ts | Update | Add `evidence lint --task`. | Done |
| src/cli/main.ts | Update | Show evidence lint in help. | Done |
| src/services/protocol-consistency.ts | Update | Surface task evidence lint failures in protocol doctor. | Done |
| src/schemas/evidence-lint.schema.json | Add | Fixture-level JSON contract for lint reports. | Done |
| src/schemas/schema-index.json | Update | Register `hadara.evidence.lint.v1`. | Done |
| src/core/schema.ts | Update | Load lint schema fixture. | Done |
| tests/unit/evidence-lint.test.ts | Add | Cover valid records, bad kind, and protocol doctor integration. | Done |
| tests/unit/schema-fixtures.test.ts | Update | Include lint schema in registry expectations. | Done |
| docs/IMPLEMENTATION_SOP.md | Update | Prohibit hand-editing `evidence.jsonl` and define close evidence rule. | Done |
| docs/SCHEMAS.md | Update | Document lint schema. | Done |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Update | Record fixed-point redesign and follow-up capsules. | Done |
| docs/TASK_BOARD.md | Update | Record T-0165 done and planned follow-up capsules. | Done |
| docs/DEVELOPMENT_SLICES.md | Update | Add T-0165 through T-0169 slices. | Done |
