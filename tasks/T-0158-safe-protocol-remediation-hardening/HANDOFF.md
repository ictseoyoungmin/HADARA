# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0158 |
| Status | Done |
| Last Updated | 2026-05-31T12:41:07+09:00 |

## Last Completed

| Item | Evidence |
|---|---|
| Implemented remediation hardening. | `src/services/protocol-remediation.ts`; focused tests passed. |
| Added regression coverage for reviewed gaps. | `tests/unit/protocol-remediation.test.ts`; 2 files / 18 tests passed with protocol CLI tests. |
| Completed validation. | Full Docker check passed with 61 files / 455 tests; built CLI smoke passed. |
| Completed final protocol checks. | Done-level harness, task protocol doctor, and docs protocol doctor returned `ok: true`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start Protocol Consistency JSON Contract as the next capsule. | Remediation action report shape now includes optional hash/existence fields and should be schema-reviewed before consumers rely on it. | `docs/IMPLEMENTATION_SOP.md`, `docs/CLI_JSON_CONTRACT.md`, Phase 2 protocol spec |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The planned Protocol Consistency JSON Contract task was previously referred to as T-0158. | Task numbering changed because this hardening capsule now uses T-0158. | Update state/slice docs to refer to JSON contract as the next task. |
| `expectedBeforeHash`/`expectedBeforeExists` are optional report fields before schema registration. | T-0159 schema work should decide whether to require or document them. | Keep contract work next. |
