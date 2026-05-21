# Acceptance Criteria

- [x] `hadara evidence collect --json` returns a stable JSON envelope.
- [x] JSON output includes the appended `hadara.evidence.v1` record.
- [x] Private evidence paths are not included in JSON output.
- [x] Missing target task returns exit code `6`.
- [x] Existing non-JSON evidence collect output remains usable.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached to `EVIDENCE.md` and `evidence.jsonl`.
- [x] Handoff is updated.
