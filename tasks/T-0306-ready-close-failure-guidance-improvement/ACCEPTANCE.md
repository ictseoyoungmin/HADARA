# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task ready` placeholder or missing heading issue includes path, heading, and fixHint. | Done | Focused ready regression and built CLI smoke passed. |
| AC-2 | `harness validate` exposes the same hint model for shared checks. | Done | Focused harness regressions passed. |
| AC-3 | `task close` close-source doc blockers include path-level fix hints where applicable. | Done | Focused close regression and built CLI smoke passed. |
| AC-4 | Schema fixtures are updated. | Done | `hadara.harness.validate.v1` schema fixture added; ready/close schemas updated; schema tests passed. |
| AC-5 | Existing consumers tolerate additive fields. | Done | Focused task-ready/task-close/harness/schema tests passed. |
| AC-6 | `proof explain` parity is not required and remains out of scope. | Done | No proof surface changed. |
| AC-7 | Evidence is attached and handoff/shared state docs are updated before close. | Done | Evidence `ev:T-0306:79d346d1f54c4d6d8f3667c3`; Project State, Agent Handoff, Development Slices, and task handoff updated. |
