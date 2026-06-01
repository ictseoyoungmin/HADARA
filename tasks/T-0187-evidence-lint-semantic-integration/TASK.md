# T-0187 Evidence Lint Semantic Integration

## Metadata

| Field | Value |
|---|---|
| ID | T-0187 |
| Title | Evidence Lint Semantic Integration |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Evidence lint semantic integration | Extend read-only `hadara evidence lint --task <id> --json` with Phase 4 evidence semantic summaries and task-scoped semantic issues while keeping the existing lint schema version and persisted evidence format stable. |

## Scope

| In Scope | Reason |
|---|---|
| Add `summary.semantics` to evidence lint reports | Downstream consumers need proof meaning without reading raw evidence themselves. |
| Map semantic analyzer issues into lint issues | Existing lint surfaces can report Done evidence insufficiency before close. |
| Detect task Done state from task capsule/task board metadata | Semantic blockers should only apply when a task is effectively Done. |
| Add focused evidence-lint regression tests | The integration needs coverage for weak, failed, blocked, private-only, and passing Done evidence. |
| Keep compatibility with `hadara.evidence.lint.v1` | T-0187 is additive and should not break existing consumers. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence v2 writer or migration | Planned for T-0190. |
| Direct protocol doctor or harness semantic gates | Planned for T-0188, though protocol may inherit lint issues through the existing lint bridge. |
| Dashboard or TUI rendering | Planned for T-0189. |
| Release strict gate enforcement | Planned for T-0191. |
| Init scaffold changes | Deferred until writer/migration behavior is designed. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-01 | In Progress | Implementing evidence lint semantic integration after T-0186 foundation. | docs/DEVELOPMENT_SLICES.md |
| 2026-06-01 | Done | Evidence lint semantic integration implemented and Docker validation passed. | T-0187 evidence records. |
