# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current state docs and C3/C4/C6 specs. | Complete | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, C3/C4/C6 specs |
| 2 | Document remaining C4 scope and acceptance. | Complete | TASK/PLAN/ACCEPTANCE/FILES |
| 3 | Add symbol-neighborhood strategy using C2 code index. | Complete | `src/context/context-slice.ts`, `tests/unit/context-slice.test.ts`, built CLI symbol smoke. |
| 4 | Add context-pack candidate strategy using C3 `sliceCandidates[]`. | Complete | `src/context/context-slice.ts`, injected candidate tests, built CLI candidate smoke. |
| 5 | Update CLI, schema, registry metadata, and docs. | Complete | CLI option plumbing, schemas, command registry, COMMAND_SURFACE, SCHEMAS. |
| 6 | Add unit/CLI tests for symbol and candidate behavior. | Complete | Docker focused C4/schema/registry validation passed 5 files / 53 tests. |
| 7 | Run Docker validation, record evidence, update shared docs, and close. | Done | Validation evidence `ev:T-0370:31843ba400314e019d1eae82`, `ev:T-0370:70db496bc8f5489c8a6cb5b1`, `ev:T-0370:a247c6412f2b49c6ad49efbd`, `ev:T-0370:4afe08a8ea30466c8b43f34e`, `ev:T-0370:1e6a0f08e520489f9d6f3100`; lifecycle close/audit follows this done-ready state. |
