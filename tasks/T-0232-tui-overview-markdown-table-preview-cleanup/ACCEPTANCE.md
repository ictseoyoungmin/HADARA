# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Overview Goal/Next/Proof previews do not render Markdown table headers or delimiter rows. | Done | Focused snapshot regression; built snapshot grep found no table preview headers. |
| AC-2 | Markdown preview helpers summarize table data rows. | Done | `tests/unit/tui-markdown.test.ts`. |
| AC-3 | Fast TUI `Next Recommended` uses table-aware handoff section parsing. | Done | Focused `tui-read-model`/`status-json` tests and built snapshot output. |
| AC-4 | Full Docker sync-build passes. | Done | 91 files / 597 tests; built CLI smoke ok. |
| AC-5 | Evidence is attached and handoff docs are updated. | Done | EVIDENCE.md/evidence.jsonl and docs updates. |
| AC-6 | Detail document tables keep inline-code pipes inside the same cell instead of rendering bogus extra columns. | Done | Focused `tui-markdown` regression and built Detail TESTS.md smoke. |
| AC-7 | Wide Detail table rendering can use available width for long cells without exceeding the panel width. | Done | Focused `tui-markdown` visible-width regression. |
