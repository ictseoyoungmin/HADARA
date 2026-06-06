# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `run scaffold` generated scripts no longer depend on raw stdout matching. | Done | Generated step 2 now matches `"status":"completed"`. |
| AC-2 | Multiline stdout generated scripts execute successfully through the deterministic agent loop. | Done | Evidence `ev:T-0272:ecb8762baf964375a4fba098`. |
| AC-3 | Built CLI smoke passes in a fresh temp project using generated script and fixtures unchanged. | Done | Evidence `ev:T-0272:38a6c12962a94d0e96f36f2d`. |
| AC-4 | Evidence is attached. | Done | T-0272 `EVIDENCE.md` and `evidence.jsonl`. |
| AC-5 | Handoff/state docs are updated for the next finding capsule. | Done | `docs/PROJECT_STATE.md` and `docs/AGENT_HANDOFF.md` updated. |
