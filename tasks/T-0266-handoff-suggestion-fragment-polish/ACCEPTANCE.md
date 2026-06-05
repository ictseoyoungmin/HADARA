# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Suggestion sections include exact target before-hash, section title, and suggested replacement Markdown. | Done | Unit test assertions and built handoff suggest smoke verify `targetBeforeHash`, `sectionTitle`, and `suggestedReplacementMarkdown`. |
| AC-2 | Existing compatibility field and schema remain valid. | Done | `suggestedMarkdown` remains populated; schema fixture and validation tests passed. |
| AC-3 | Read-only shared-doc boundary and execute refusal remain explicit. | Done | Built `handoff suggest --execute --json` returned `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED` with no writes. |
| AC-4 | Evidence is attached. | Done | `ev:T-0266:e2e2a53b922b4768851d93b8`. |
| AC-5 | Handoff is updated. | Done | Shared handoff points to release candidate freeze/artifact refresh next. |
