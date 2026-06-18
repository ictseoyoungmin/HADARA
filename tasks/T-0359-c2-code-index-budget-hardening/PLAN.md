# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs and active C2/C6 context-routing specs. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, C2/C6 specs read. |
| 2 | Add explicit code-index budget defaults, override hooks for tests, and budget metadata. | Done | `src/context/code-index.ts`. |
| 3 | Add tests for max files, total bytes, and single-file read limits. | Done | `tests/unit/code-index.test.ts`. |
| 4 | Update schemas/docs/state handoff for the hardening boundary. | Done | Schema/docs/state files updated. |
| 5 | Run focused/full validation, attach evidence, and prepare lifecycle close. | Done | Validation evidence `ev:T-0359:5bd5521857864638b2abde7a`; finish/ready/close/audit run after close-source docs are finalized. |
