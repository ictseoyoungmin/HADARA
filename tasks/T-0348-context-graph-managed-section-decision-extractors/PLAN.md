# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 managed-section/decision/known-problem scope. | Done | Read shared state docs, managed-section service, and context-routing C1 spec. |
| 2 | Add managed-section, decision, and handoff known-problem extractors. | Done | `src/context/document-extractors.ts`. |
| 3 | Add focused unit coverage. | Done | `tests/unit/context-graph-document-extractors.test.ts`. |
| 4 | Run validation and refresh dist if source changes pass. | Done | Docker focused tests, Docker `npm run build`, Docker `npm run check`, dist refresh, built CLI version smoke, and `git diff --check` passed in `ev:T-0348:7bfdb4f1005e4c23b9d6ad03`. |
| 5 | Attach evidence, update handoff/state docs, and close. | Done | Evidence attached and close-source docs updated before lifecycle close. |
