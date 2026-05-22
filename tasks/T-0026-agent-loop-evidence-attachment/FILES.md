# Files

| Path | Action | Reason |
|---|---|---|
| src/evidence/evidence.ts | Update | Add generated public text artifact support for evidence records. |
| src/agent/evidence.ts | Add | Convert fake-shell loop observations into Task Capsule evidence attachments. |
| src/agent/loop.ts | Update | Include attached evidence metadata in agent loop JSON results. |
| src/cli/main.ts | Update | Attach evidence after `hadara run --task ...` completes with fake-shell observations. |
| src/index.ts | Update | Export agent evidence helpers from the package surface. |
| tests/unit/agent-evidence.test.ts | Add | Cover fake-shell observation attachment behavior. |
| tests/unit/run-cli.test.ts | Update | Cover run result evidence metadata shape. |
| tasks/T-0026-agent-loop-evidence-attachment/* | Add/Update | Maintain Task Capsule state and evidence. |
| docs/TASK_BOARD.md | Update | Register and track T-0026. |
| docs/PROJECT_STATE.md | Update | Record completed capability when done. |
| docs/DEVELOPMENT_SLICES.md | Update | Mark slice done when validation passes. |
| docs/AGENT_HANDOFF.md | Update | Refresh handoff before stopping. |
