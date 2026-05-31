# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara protocol doctor --scope all --json` returns `hadara.protocol.consistency.v1` with `scope: all`. | Met | Built CLI smoke returned `scope: all` and `ok: true`. |
| AC-2 | `hadara protocol doctor --json` defaults to all-scope protocol doctor. | Met | Built CLI default doctor smoke returned `scope: all` and `ok: true`. |
| AC-3 | Evidence is attached. | Met | `EVIDENCE.md`, `evidence.jsonl` |
| AC-4 | Handoff is updated. | Met | `HANDOFF.md`, `docs/AGENT_HANDOFF.md` |
