# Acceptance Criteria

- [x] `hadara policy preflight-shell <command> --json` returns a stable JSON envelope.
- [x] Safe auto-mode commands are marked allowed.
- [x] Assisted-mode commands are marked requires_approval.
- [x] Dangerous commands are marked denied and exit code `2`.
- [x] No shell command is executed.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached to `EVIDENCE.md` and `evidence.jsonl`.
- [x] Handoff is updated.
