# Acceptance Criteria

- [x] `hadara.evidence.list.v1` reports valid task evidence records with stable `count`, `records`, and `issues` fields.
- [x] Missing tasks and malformed JSONL lines return report issues rather than uncaught exceptions.
- [x] Private evidence records are excluded by default and included as metadata when requested.
- [x] CLI JSON and MCP read-only surfaces use the shared report builder.
- [x] Focused tests and Docker validation are recorded in `EVIDENCE.md` and `evidence.jsonl`.
- [x] Project state, task board, development slices, and handoff docs are updated before Done.
