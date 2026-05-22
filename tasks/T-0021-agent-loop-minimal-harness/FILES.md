# Files

| Path | Action | Reason |
|---|---|---|
| src/agent/loop.ts | Add | Deterministic agent loop harness core. |
| src/cli/main.ts | Update | Expose `hadara run` JSON/text execution. |
| src/index.ts | Update | Export agent loop API. |
| src/harness/validate.ts | Update | Require `evidence.jsonl` during Task Capsule validation. |
| tests/unit/agent-loop.test.ts | Add | Cover final responses and fake shell observations. |
| tests/harness/harness-validate.test.ts | Update | Cover missing evidence index validation. |
| docs/DEVELOPMENT_SLICES.md | Update | Mark agent loop minimal harness slice complete. |
| docs/TASK_BOARD.md | Update | Track T-0021 status. |
| docs/PROJECT_STATE.md | Update | Record new current capability. |
| docs/AGENT_HANDOFF.md | Update | Session handoff before stopping. |
| tasks/T-0021-agent-loop-minimal-harness/* | Add/Update | Task Capsule records and evidence. |
