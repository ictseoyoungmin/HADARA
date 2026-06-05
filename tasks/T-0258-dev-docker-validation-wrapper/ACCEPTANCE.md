# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Wrapper creates an isolated Docker temp workspace excluding `.git`, `.hadara`, `node_modules`, and `dist`. | Done | Unit tests and built wrapper smoke. |
| AC-2 | Wrapper supports focused tests and full check modes. | Done | Unit tests cover focused and full modes. |
| AC-3 | `--sync-dist` is explicit and reports dist sync metadata. | Done | Unit tests and built wrapper smoke. |
| AC-4 | Report includes compact evidence-ready summary and omits raw logs/private paths/secrets. | Done | Unit tests and schema fixture. |
| AC-5 | Evidence is attached. | Done | Two public command-log records appended in `EVIDENCE.md` and `evidence.jsonl`. |
| AC-6 | Handoff is updated. | Done | `docs/AGENT_HANDOFF.md` updated to T-0258/T-0259 state. |
