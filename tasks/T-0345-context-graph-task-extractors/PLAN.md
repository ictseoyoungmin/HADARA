# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 extractor spec. | Done | Session reads completed before edits. |
| 2 | Add Task Board and Task Capsule extractors. | Done | `src/context/task-extractors.ts`. |
| 3 | Add focused unit coverage. | Done | `tests/unit/context-graph-task-extractors.test.ts`. |
| 4 | Run validation and refresh dist if source changes pass. | Done | Docker focused tests, Docker full `npm run check`, dist refresh, built CLI smoke, and `git diff --check` passed. |
| 5 | Attach evidence, update handoff/state docs, and close. | Done | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
