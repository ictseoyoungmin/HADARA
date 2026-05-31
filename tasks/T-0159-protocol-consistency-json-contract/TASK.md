# T-0159 Protocol Consistency JSON Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0159 |
| Title | Protocol Consistency JSON Contract |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Register protocol consistency and remediation JSON contracts. | Add schema fixtures and focused contract coverage for the reports introduced in T-0153 through T-0158. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.protocol.consistency.v1` schema fixture. | Protocol doctor reports are now consumed by task, docs, and profile scopes. |
| `hadara.protocol.remediation.v1` schema fixture. | Remediation dry-run/execute reports need a documented contract before broader consumers rely on them. |
| Schema registry/runtime registration. | Existing schema tooling must be able to load and validate the new fixtures. |
| Focused service and CLI contract tests. | Prove representative doctor/remediation reports validate, including T-0158 hash/existence action fields. |
| Schema docs and JSON contract docs. | Keep documented external-agent contract surfaces current. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New remediation fixes or broad Markdown rewriting. | This capsule only documents and tests the existing report contracts. |
| MCP tool changes. | Protocol doctor/remediation remain CLI/service surfaces in this slice. |
| Release-gate schema enforcement. | Fixture-level validation stays narrow and test-backed. |
| Changing issue semantics. | Stable codes and severities are preserved from existing reports. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T12:51:00+09:00 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-05-31T12:54:24+09:00 | Active | Begin protocol JSON contract implementation. | This capsule |
| 2026-05-31T13:01:17+09:00 | Done | Protocol schema fixtures, contract tests, docs, and validation completed. | `EVIDENCE.md`, `evidence.jsonl` |
