# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 extractor contract spec. | Done | Session reads completed before edits. |
| 2 | Add shared extractor contract and deterministic helpers. | Done | `src/context/extractor-contract.ts`. |
| 3 | Add focused unit coverage. | Done | `tests/unit/context-graph-extractor-contract.test.ts`. |
| 4 | Run validation and refresh dist if source changes pass. | Done | Docker focused tests, Docker full `npm run check`, dist refresh, built CLI smoke, and `git diff --check` passed. |
| 5 | Attach evidence, update handoff/state docs, and close. | Done | `ev:T-0344:567e18dd540c4ea085934770`. |
