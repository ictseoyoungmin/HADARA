# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Compose existing lifecycle read models instead of duplicating validation logic. | Accepted | Keeps `task complete` aligned with finish/ready/close/audit semantics and minimizes new drift risk. | `src/task/task-complete-flow.ts` and unit tests. |
| D-2 | Return a command-specific blocked report for `--execute`. | Accepted | The spec says no execute mode; returning `hadara.task.complete_flow.v1` gives agents structured feedback without mutation. | Execute rejection unit test. |
| D-3 | Expose only the current primary next action in `nextActions`. | Accepted | T-0255 workflow compression should tell the operator what to do next, not replay every possible lifecycle command. | Finish-required and close-required tests assert one next action. |
