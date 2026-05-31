# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `docs/SCHEMAS.md` defines Stable, Additive, Compatibility alias, Deprecated, and Experimental field classes. | Done | `docs/SCHEMAS.md`; `tests/unit/schema-stability-docs.test.ts`. |
| AC-2 | `hadara.task.workbench.v1` marks `state.closed` as a compatibility alias for `state.closedValid`. | Done | `src/schemas/task-workbench.schema.json`; test. |
| AC-3 | Classification remains fixture/documentation-level and does not make schemas release-gate strict. | Done | `docs/SCHEMAS.md`. |
| AC-4 | Evidence is attached and handoff is updated. | Done | T-0182 evidence records and HANDOFF.md. |
