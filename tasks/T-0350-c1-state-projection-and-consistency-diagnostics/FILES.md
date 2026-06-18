# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/context/state-projection.ts | Add | Build compact C1 `ContextStateProjectionReport` from extractor outputs and graph nodes. | Done |
| src/context/document-extractors.ts | Update | Add Project State state-source extraction and handoff latest/active task state source. | Done |
| src/context/extractor-contract.ts | Update | Register `extractProjectState` as a context extractor name. | Done |
| tests/unit/context-state-projection.test.ts | Add | Cover compact state projection summary and consistency diagnostics. | Done |
| tests/unit/context-graph-document-extractors.test.ts | Update | Cover Project State and Agent Handoff state source extraction. | Done |
| tasks/T-0350-c1-state-projection-and-consistency-diagnostics/* | Update | Maintain capsule scope, validation, evidence, acceptance, and handoff docs. | Done |
| docs/TASK_BOARD.md | Update via HADARA lifecycle | Reflect T-0350 lifecycle status. | Pending lifecycle execute |
| docs/PROJECT_STATE.md | Update | Track latest completed task after validation. | Done |
| docs/AGENT_HANDOFF.md | Update | Route next C1 work after T-0350 closes. | Done |
| docs/DEVELOPMENT_SLICES.md | Update | Add T-0350 slice completion row. | Done |
