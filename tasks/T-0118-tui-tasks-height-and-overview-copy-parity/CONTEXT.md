# Context

## Report

Operator feedback after T-0117:

- Tasks tab height should stay consistent with Detail height.
- Overview Resume Signals should be simpler like the mockup.
- Current Work / Previous Work `Next` and `Proof` lines appear to differ between the mockup and production.
- While Tasks search is active, numeric `1`, `2`, `3`, and `4` should be usable as search text instead of always switching panels.

## Findings

`.mockup/tui-final/src/app.js` renders Overview Resume Signals with only health/tasks and validation. Production also renders active-run and debt/release/deferred lines, making the section busier than the mockup.

Mockup `summarizeWork()` chooses `Next` from active-run resume actions, task handoff `Next Recommended Step`/`Next`, incomplete plan/acceptance checklists, plan/acceptance previews, then a Done fallback. Production currently starts at plan/acceptance checklists and does not use active-run resume actions or task handoff previews for the work card.

Mockup `Proof` first uses the selected task evidence record when available, otherwise parses evidence Markdown table rows into concise `result: summary` text before falling back to generic Markdown preview and Done status. Production currently uses selected evidence for the selected task, then generic evidence/handoff previews.

Production Tasks row count is width-derived. Detail height is available-row-derived, so the Tasks panel can render shorter than Detail in compact mode or overrun/truncate in wide mode. The fix should derive Tasks visible rows from the same Detail panel height policy.

Production state handling processed global numeric panel shortcuts before active-search text input. That meant searching for task ids/titles containing `1`, `2`, `3`, or `4` switched panels instead of appending digits to the search query.

## Constraints

- Preserve read-model-first behavior: renderer uses `TuiReadModel` task detail files already loaded by the read model.
- Keep TUI read-only.
- Keep fixed visible terminal widths and deterministic no-color snapshots.
