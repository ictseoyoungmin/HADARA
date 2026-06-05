# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a template registry under `src/task/task-templates.ts`. | Accepted | Keeps template ids/defaults centralized and testable. | Unit tests. |
| D-2 | Make task create JSON schema-backed. | Accepted | T-0259 requires schema-valid template output and external-agent compatibility. | `hadara.task.create.v1`. |
| D-3 | Fail unknown templates before creating capsules. | Accepted | Prevents typo-driven task drift. | Unit and built CLI smokes. |
