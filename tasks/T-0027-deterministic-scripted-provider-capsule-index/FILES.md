# Files

| Path | Action | Reason |
|---|---|---|
| src/providers/scripted-provider.ts | Update | Consume script steps in order and report current-step mismatches. |
| src/task/task-capsule.ts | Update | Create empty `evidence.jsonl` for every new Task Capsule. |
| tests/contract/provider-contract.test.ts | Update | Cover sequential ScriptedProvider consumption. |
| tests/harness/task-capsule.test.ts | Update | Cover empty evidence index creation. |
| tests/harness/harness-validate.test.ts | Update | Delete evidence index explicitly in missing-file regression. |
| tests/unit/agent-evidence.test.ts | Update | Expect empty evidence index for no-tool runs. |
| tasks/T-0027-deterministic-scripted-provider-capsule-index/* | Add/Update | Track task capsule, evidence, and handoff. |
| docs/TASK_BOARD.md | Update | Track T-0027 status. |
| docs/PROJECT_STATE.md | Update | Record deterministic provider and capsule index behavior when done. |
| docs/AGENT_HANDOFF.md | Update | Refresh next-session handoff. |
