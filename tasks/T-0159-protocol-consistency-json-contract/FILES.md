# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/schemas/protocol-consistency.schema.json` | Add | Register protocol doctor report fixture. | Done |
| `src/schemas/protocol-remediation.schema.json` | Add | Register protocol remediation report fixture. | Done |
| `src/schemas/schema-index.json` | Update | Add protocol schema registry entries. | Done |
| `src/core/schema.ts` | Update | Register schema fixtures with runtime loader. | Done |
| `tests/unit/schema-fixtures.test.ts` | Update | Include protocol schemas in registry alignment test. | Done |
| `tests/unit/protocol-consistency.test.ts` | Update | Validate representative consistency reports against schema. | Done |
| `tests/unit/protocol-remediation.test.ts` | Update | Validate remediation reports and T-0158 hash/existence fields. | Done |
| `tests/unit/protocol-cli.test.ts` | Update | Validate CLI JSON payloads against protocol schemas. | Done |
| `docs/SCHEMAS.md` | Update | Move protocol schemas from planned to registered. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Update | List protocol schemas as command-specific JSON surfaces. | Done |
| `docs/TEST_STRATEGY.md` | Update | Correct protocol JSON contract task number to T-0159. | Done |
| `tasks/T-0159-protocol-consistency-json-contract/*` | Update | Track capsule scope, evidence, and handoff. | Done |
