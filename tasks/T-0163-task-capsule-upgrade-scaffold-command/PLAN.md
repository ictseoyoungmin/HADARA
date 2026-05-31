# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0163 follow-up plan. | Done | Phase 2 hardening plan read. |
| 2 | Implement upgrade-scaffold report service. | Done | `src/task/task-upgrade-scaffold.ts` added. |
| 3 | Wire task CLI and JSON schema. | Done | `src/cli/task.ts`, schema fixture, schema index, and runtime schema registration updated. |
| 4 | Add focused tests. | Done | `tests/unit/task-upgrade-scaffold.test.ts` covers dry-run, execute, idempotence, missing files, ambiguous skip, and CLI JSON. |
| 5 | Run validation and update evidence/handoff. | Done | Focused/full Docker checks and built CLI smoke recorded. |
