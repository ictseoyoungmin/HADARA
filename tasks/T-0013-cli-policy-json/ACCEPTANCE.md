# Acceptance Criteria

- [x] `hadara policy check-shell <command> --json` returns a stable JSON envelope.
- [x] JSON output includes mode, command text, parsed shell shape, and decision.
- [x] Denied commands exit with code `2`.
- [x] Existing non-JSON output remains usable.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached to `EVIDENCE.md` and `evidence.jsonl`.
- [x] Handoff is updated.
