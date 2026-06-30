# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-04A3 source specs, registered templates, and current generated init templates. | Done | `02_Agent_Entry_and_Workflow_Document.md`, `templates/0.4/*`, `src/cli/init.ts`, `src/services/docs-registry.ts` |
| 2 | Align generated AGENTS/HADARA_CONTEXT/HADARA_WORKFLOW content with non-overlapping 0.4 responsibilities. | Done | `src/cli/init.ts`, `src/services/docs-registry.ts` |
| 3 | Add focused init tests for template ownership, workflow sections, and duplicate avoidance. | Done | `tests/unit/init.test.ts` |
| 4 | Run Docker build/focused tests, refresh workspace `dist`, and smoke generated scaffold. | Done | `ev:T-0429:ab675a5933c84286b8d255fc` |
| 5 | Update capsule/shared state docs, finalize, and commit. | Done | Shared state docs updated; close evidence pending from finalize. |
