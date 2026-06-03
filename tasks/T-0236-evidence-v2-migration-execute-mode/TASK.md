# T-0236 Evidence v2 Migration Execute Mode

## Metadata

| Field | Value |
|---|---|
| ID | T-0236 |
| Title | Evidence v2 Migration Execute Mode |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Add hash-guarded per-task Evidence v2 migration execute mode. | Build on T-0235 preview so one task's `evidence.jsonl` can be rewritten to v2 only when the operator supplies the matching preview `beforeHash`. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara evidence migrate --task <id> --to v2 --execute --before-hash <hash> --json`. | Adds the bounded write path promised by the migration plan. |
| Preserve dry-run preview behavior. | Existing preview consumers and tests must continue to receive the same no-write report shape. |
| Refuse execute on hash mismatch, skipped invalid records, unsupported targets, or missing evidence file. | Migration writes must be drift-safe and fail closed. |
| Rewrite only `tasks/<id>/evidence.jsonl`. | Execute mode must not rewrite `EVIDENCE.md`, other task capsules, project docs, or artifact files. |
| Record execution metadata in the migration report. | Operators need to know whether a write was planned, applied, skipped, and which hash resulted. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Repository-wide migration. | First execute implementation remains one task at a time. |
| `EVIDENCE.md` table/frame rewrite. | Markdown id display remains a separate future capsule. |
| Init scaffold changes. | Migration execute should not change new-project scaffolding. |
| MCP write expansion. | CLI-only execute is sufficient for this slice. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to hash-guarded Evidence v2 migration execute mode. | Task capsule update |
| 2026-06-03 | Done | Hash-guarded execute mode, focused/full validation, built CLI smokes, and evidence are complete. | T-0236 evidence |
