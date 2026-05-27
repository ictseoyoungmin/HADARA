# T-0116 TUI Markdown Viewer and Live Overview Parity

## Goal

Make the production TUI Detail Markdown viewer and Overview behavior match the `.mockup/tui-final` work console more closely while preserving the production read-model-first architecture.

## Scope

- Port mockup-style Markdown document rendering for headings, numbered lists, checklists, bullets, and aligned Markdown tables.
- Keep Detail document content sourced from TUI/read-model services, not direct renderer file reads.
- Make Overview Current Work and Previous Work follow the latest two task read-model rows after refresh, including document-derived summary lines.
- Port the mockup-style interactive loading pulse so production TUI can keep rendering loading frames while asynchronous read-model loads are pending.
- Record any read-model shape changes in task-local documentation.

## Out of Scope

- Task/evidence/handoff writes.
- Shell execution, provider calls, MCP calls, dashboard/server behavior, or release/package execution.
- Changing stable public CLI/MCP JSON contracts.
- Making TUI cache a source of truth.

## Status

Done
