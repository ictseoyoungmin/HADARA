# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara init` generates lifecycle command guidance for evidence, ready, finish, close, and audit-close. | Done | Generated `docs/TASK_WORKFLOW_COMMANDS.md`; built init smoke confirmed the file and `audit-close` guidance. |
| AC-2 | Generated `AGENTS.md` and SOP register the lifecycle guidance as required reading. | Done | `tests/unit/init.test.ts` checks `docs/TASK_WORKFLOW_COMMANDS.md` in generated AGENTS/SOP. |
| AC-3 | No lifecycle command executes another lifecycle command implicitly. | Done | Generated docs state explicit non-overlap/write boundaries only; no command implementation was changed. |
| AC-4 | Focused init/workflow docs tests, full Docker check, and built init smoke are recorded. | Done | Docker focused test/build, Docker `npm run check`, and built CLI init smoke passed. |
| AC-5 | Evidence is attached and handoff is updated. | Done | `EVIDENCE.md`, `evidence.jsonl`, task-local `HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` updated. |
