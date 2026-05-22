# Context

- Task Capsule templates already exist in `src/task/task-capsule.ts`.
- Harness validation currently checks required files, `TASK.md` sections, evidence table shape, and `evidence.jsonl`.
- T-0019 exposed a gap: Markdown files could drift from the template format while harness validation still returned `ok: true`.
- This slice turns the template contract into executable validation for core capsule files.
