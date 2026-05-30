# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 2 protocol consistency plan. | Done | `AGENTS.md`, project state, handoff, task board, SOP, development slices, T-0153 capsule, and Phase 2 spec reviewed. |
| 2 | Define T-0154 docs-scope doctor boundaries. | Done | Capsule scope narrowed to read-only docs consistency checks; remediation/profile/schema work deferred. |
| 3 | Implement docs-scope protocol consistency service and CLI command. | Done | `src/services/protocol-consistency.ts`, `src/cli/protocol.ts`, and `src/cli/main.ts`. |
| 4 | Add focused unit/CLI coverage for project-doc drift signals. | Done | `tests/unit/protocol-consistency.test.ts` and `tests/unit/protocol-cli.test.ts`. |
| 5 | Run validation. | Done | Focused tests, full Docker `npm run check`, built CLI smoke, and done-level harness passed. |
| 6 | Attach evidence and update handoff/state docs. | Done | `EVIDENCE.md`, `evidence.jsonl`, project docs, and task-local handoff updated. |
