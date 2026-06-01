# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | User can select a task from the dashboard task list. | Done | Task rows are selectable in the Capsule Index. |
| AC-2 | Selected task detail uses shared workbench/evidence read models. | Done | Dashboard reads `/api/task-workbench`, `/api/evidence-lint`, and `/api/evidence`. |
| AC-3 | Evidence proof status derives from semantic issue codes and semantic summary. | Done | `proofStatusFrom()` uses `TASK_DONE_*` codes and `summary.semantics.byStrength`. |
| AC-4 | `private-only` renders as auditability warning, not blocker. | Done | UI text says auditability warning, not a Done blocker. |
| AC-5 | Failed/blocked/weak evidence renders as blocker. | Done | Proof priority handles failed, blocked, and weak before private-only/sufficient. |
| AC-6 | Legacy evidence ID durability caveat is displayed. | Done | Evidence Lens identity row warns generated legacy ids are not durable persisted identity. |
| AC-7 | Dashboard does not parse raw `evidence.jsonl` or Markdown for proof strength. | Done | UI consumes evidence lint/workbench/list JSON routes only. |
| AC-8 | Dashboard does not expose private raw paths. | Done | Evidence list remains sanitized and UI renders summary/counts only. |
| AC-9 | Tests cover proof status priority and API routes. | Done | Focused dashboard test asserts route/schema and proof-priority strings. |
| AC-10 | Full Docker validation passes. | Done | Docker sync-build passed with 79 files / 551 tests. |
