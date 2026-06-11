# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read HADARA session docs, T-0291 handoff, and Phase 7.2 spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/COMMAND_SURFACE.md`, `docs/specs/0.3.0/03_Phase_7_2_Lifecycle_Guide_and_Command_Portfolio_Audit.md` |
| 2 | Add registry-backed lifecycle guide report and JSON help path. | Done | `src/services/lifecycle-guide.ts`, `src/cli/help.ts` |
| 3 | Add lifecycle guide and command portfolio audit docs. | Done | `docs/LIFECYCLE_GUIDE.md`, `docs/COMMAND_PORTFOLIO_AUDIT.md` |
| 4 | Register schemas and focused tests for lifecycle/portfolio behavior. | Done | `src/schemas/lifecycle-guide.schema.json`, `src/schemas/command-portfolio-audit.schema.json`, focused tests |
| 5 | Run build, focused tests, CLI smokes, and available broader validation. | Done | `EVIDENCE.md`; standard Docker wrapper timeout is recorded as blocked |
| 6 | Finish/ready/close/audit T-0292 and commit. | In Progress | Close-source docs are being finalized |
