# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and active C2 spec. | Complete | Used T-0353 handoff, C2 spec, and worker plan. |
| 2 | Add import/export extraction helpers to the code index. | Complete | `extractCodeFileReferences()` extracts spec-listed imports and basic exported names. |
| 3 | Resolve relative imports and emit code index `IMPORTS` edges/warnings. | Complete | Resolved project imports create `IMPORTS` edges; unresolved relative imports add warning issues. |
| 4 | Add focused tests for extraction, resolution, and schema-valid reports. | Complete | `tests/unit/code-index.test.ts`. |
| 5 | Run Docker validation, attach evidence, update shared docs, and close. | Complete | `ev:T-0354:9093ae17f3c64a54b46b319c`; close pending after shared-doc update. |
