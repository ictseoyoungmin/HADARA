# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read HADARA session docs and Phase 7.3 spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/LIFECYCLE_GUIDE.md`, `docs/specs/0.3.0/04_Phase_7_3_Document_Registry_and_Docs_Doctor.md` |
| 2 | Add document registry service, init seed, and docs projection. | Done | `src/services/docs-registry.ts`, `src/cli/init.ts` |
| 3 | Add `docs list`, `docs doctor`, and `docs explain` CLI surfaces. | Done | `src/cli/docs.ts`, `src/cli/main.ts` |
| 4 | Register schemas and focused tests. | Done | `src/schemas/docs-*.schema.json`, `tests/unit/docs-*.test.ts` |
| 5 | Run validation and attach evidence. | Done | `EVIDENCE.md`, `evidence.jsonl` |
| 6 | Finish/ready/close/audit and commit. | Pending | close evidence |
