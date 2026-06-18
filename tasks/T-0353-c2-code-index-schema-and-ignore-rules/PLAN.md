# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and active C2 spec. | Complete | Read AGENTS context, Project State/Handoff/Task Board context, `00_Context_Routing_Architecture_Overview.md`, `02_Code_Link_Layer_Spec.md`, and `06_Worker_Agent_Implementation_Plan.md`. |
| 2 | Add code index contract, JSON schema, and schema runtime/index registration. | Complete | `src/context/code-index.ts`, `src/schemas/code-index.schema.json`, `src/schemas/schema-index.json`, and `src/core/schema.ts`. |
| 3 | Add deterministic ignore rules plus file classification/discovery helper. | Complete | `CODE_INDEX_IGNORED_PATHS`, `discoverCodeIndexFiles()`, `classifyCodeFile()`, and `buildCodeIndexReport()`. |
| 4 | Add focused tests for schema validation and ignore/discovery boundaries. | Complete | `tests/unit/code-index.test.ts`; schema fixture test updated. |
| 5 | Run Docker validation, attach evidence, update shared docs, and close. | Complete | `ev:T-0353:b72d5284ef1d42afa39232a0`; close pending after shared-doc update. |
