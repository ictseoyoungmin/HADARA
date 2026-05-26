# Acceptance Criteria

- [x] Internal TUI terminal shell supports decoded keyboard input, redraw, refresh/detail-refresh effects, and clean shutdown over injected streams.
- [x] The shell remains internal/read-only with no public CLI entry point, cache writes, shell execution, provider calls, MCP calls, evidence writes, handoff updates, or Task Capsule mutation.
- [x] Focused unit tests cover key decoding, redraw/refresh behavior, clean shutdown, and no project-file writes.
- [x] Validation evidence is recorded in `EVIDENCE.md` and `evidence.jsonl`.
- [x] Handoff and tracked project docs are updated.
