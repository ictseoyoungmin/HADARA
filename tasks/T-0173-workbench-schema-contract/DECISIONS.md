# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0173-1 | Register `hadara.task.workbench.v1` as a fixture-level additive schema. | Accepted | Phase 3 JSON shape should be documented without over-constraining future UI/read consumers. | Schema fixture and docs. |
| D-0173-2 | Validate raw service reports, not only serialized CLI JSON. | Accepted | This catches undefined optional fields before downstream service consumers see them. | Focused task-workbench test. |
