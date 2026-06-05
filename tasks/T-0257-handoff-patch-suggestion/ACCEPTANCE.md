# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara handoff suggest --task <id> --json` emits `hadara.handoff.suggestion.v1` with target before-hash, shared-doc/coordinator metadata, task snapshot, section fragments, and issues. | Done | Docker validation and built CLI smoke. |
| AC-2 | The command is read-only and rejects `--execute` without writing shared docs. | Done | Unit tests and built `--execute` smoke. |
| AC-3 | Schema registry, runtime loader, and docs include the new report. | Done | Schema fixture tests and docs updates. |
| AC-4 | Evidence is attached. | Done | Two public command-log records appended in `EVIDENCE.md` and `evidence.jsonl`. |
| AC-5 | Handoff is updated. | Done | `docs/AGENT_HANDOFF.md` updated to T-0257/T-0258 state. |
