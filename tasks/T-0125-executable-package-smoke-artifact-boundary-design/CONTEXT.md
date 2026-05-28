# Context

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/TEST_STRATEGY.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`
- T-0124 Task Capsule handoff and validation notes

## Constraints

- Host Node/npm remains unreliable; use the reusable Docker workflow for validation.
- This capsule defines future executable smoke boundaries only. It must not add release/package execution, shell execution surfaces, provider calls, MCP release/package tools, archive/checksum generation, publishing, deployment, or GitHub calls.
- The release gate remains a read-only planning/checklist report.
- Public evidence artifacts must remain UTF-8 text and pass redaction policy; private/raw artifacts must stay in ignored private/local storage.
