# Acceptance Criteria

- [x] Repeated snapshots over the same TuiReadModel are byte-stable by default.
- [x] Snapshot output does not include volatile `generatedAt` unless explicitly requested.
- [x] Width policy is explicit: mockup mode clamps to 78x24, compact mode supports smaller widths.
- [x] Markdown renderer uses visible terminal width for wrapping/table layout.
- [x] Korean/wide-character snapshot regression is covered.
- [x] No write, shell, provider, MCP, evidence, handoff, task, release, or cache behavior is introduced.
- [x] Focused TUI snapshot/markdown tests pass.
- [x] Full Docker check and done-level harness validation pass.
