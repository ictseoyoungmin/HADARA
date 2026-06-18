# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs and C3/C4/C6 context-routing specs. | Done | `.hadara/context/HADARA_CONTEXT.md`, Project State, Agent Handoff, Task Board, SOP, task workflow, C3, C4, C6 specs. |
| 2 | Add context pack schema/types and register runtime schema. | Done | `src/context/context-pack.ts`, `src/schemas/context-pack.schema.json`, `src/core/schema.ts`, `src/schemas/schema-index.json`. |
| 3 | Add deterministic ranking service over an existing graph report. | Done | `buildContextPackReport()` accepts injected `graphReport`/`cache` and ranks bounded `readFirst`/`readIfNeeded` output. |
| 4 | Add focused tests and docs updates. | Done | `tests/unit/context-pack.test.ts`, schema fixture coverage, schema/state docs. |
| 5 | Validate, attach evidence, finish/ready/close/audit, and commit. | Done | Docker sync-build evidence `ev:T-0361:dc44300239e5445fbc519132`; `task finish --execute` passed; ready/close/audit follows this final doc sync. |
