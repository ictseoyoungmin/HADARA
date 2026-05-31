# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/task-workbench.ts` | Modify | True Task Board projection, close state semantics, and workbench issues. | Done |
| `src/services/workbench-next-actions.ts` | Modify | Normalize all nextAction objects before schema validation and avoid unrelated Task Board remediation suggestions. | Done |
| `src/schemas/task-workbench.schema.json` | Modify | Register additive workbench fields and close state enum. | Done |
| `tests/unit/task-workbench.test.ts` | Modify | Add Task Board drift/missing/capsule and close evidence state regressions. | Done |
| `tests/unit/workbench-next-actions.test.ts` | Modify | Add raw schema validation regressions for pathless/undefined action fields. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Modify | Clarify `task.status` ok/readiness semantics and additive fields. | Done |
| `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` | Modify | Document consumer semantics for Task Board and close state fields. | Done |
| `docs/PROJECT_STATE.md` | Modify | Track active/completed T-0177 hardening state. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modify | Add T-0177 hardening slice. | Done |
| `docs/AGENT_HANDOFF.md` | Modify | Refresh next-session handoff. | Done |
