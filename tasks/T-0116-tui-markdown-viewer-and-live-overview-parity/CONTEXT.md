# Context

## Required Context Read

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`
- `.mockup/tui/app.js`
- `.mockup/tui-final/src/app.js`
- `.mockup/tui-final/README.md`

## Production Baseline

Production TUI is read-model-first. `src/tui/read-model.ts` composes shared services such as `createTaskListReport()`, `createTaskReadReport()`, `createEvidenceListReport()`, and `createOpsStatusReport()`. The Detail renderer consumes `model.selectedTask.detail.files[document.file]`; renderer code should not read Task Capsule files directly.

`src/services/task-read-model.ts` is allowed to read Task Capsule Markdown files because it is the shared read-model boundary. No public CLI/MCP read-model contract change was required for this task; the added Overview document detail fields are internal to `hadara.tui.read_model.internal.v1`.

## Mockup Findings

The mockup Markdown renderer recognizes tables only when a pipe row is followed by a Markdown separator row. It renders header/body rows with aligned columns, a divider line, and mockup-style document semantics for headings, numbered lists, checklists, and bullets.

The mockup Overview uses the latest task rows as Current Work and Previous Work, then derives concise Goal/Next/Proof lines from Task Capsule Markdown sections. Production previously anchored Overview around the selected task, which made it less live when a new capsule was opened.

The mockup interactive shell keeps a loading pulse running on a timer while asynchronous project reads are pending. Production previously rendered a few loading frames immediately, then performed synchronous read-model work on the terminal thread.

## Constraints

- Preserve read-only TUI behavior.
- Do not add task/evidence/handoff writes.
- Do not add shell execution, provider calls, MCP calls, dashboard/server behavior, or release/package execution.
- Keep cache local-only under `.hadara/local/tui/` when enabled.
- Keep no-color snapshot output deterministic and fixed-width.
