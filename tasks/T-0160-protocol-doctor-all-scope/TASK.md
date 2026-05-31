# T-0160 Protocol Doctor All Scope

## Metadata

| Field | Value |
|---|---|
| ID | T-0160 |
| Title | Protocol Doctor All Scope |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Implement `hadara protocol doctor --scope all --json`. | Align CLI/service behavior with the already documented `hadara.protocol.consistency.v1` `scope: all` contract. |

## Scope

| In Scope | Reason |
|---|---|
| All-scope protocol consistency report builder. | Schema and Phase 2 spec already include `all`; service should emit that scope. |
| CLI support for `--scope all` and default `protocol doctor --json`. | Phase 2 command shape recommends all-scope project protocol doctor as the broad read-only command. |
| Focused contract tests. | Prove all-scope output validates against the existing fixture-level schema and aggregates docs/profile/task diagnostics. |
| Capsule/project state documentation. | Keep HADARA handoff and task board coherent. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New issue codes beyond aggregation behavior. | This task should not expand the doctor check matrix. |
| New schema id or stricter release-gate schema behavior. | T-0159 intentionally kept fixture-level additive schemas. |
| MCP tool changes or write behavior. | Protocol doctor remains a read-only CLI/service surface. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T13:13:00+09:00 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-05-31T13:14:01+09:00 | Active | Begin all-scope protocol doctor implementation. | This capsule |
| 2026-05-31T13:21:18+09:00 | Done | All-scope protocol doctor support implemented, validated, and documented. | `EVIDENCE.md`, `evidence.jsonl` |
