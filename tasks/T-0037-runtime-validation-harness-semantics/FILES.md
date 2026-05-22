# Files

| Path | Action | Reason |
|---|---|---|
| src/policy/policy.ts | Update | Add shared permission mode parser and guard policy classification. |
| src/cli/policy.ts | Update | Parse permission mode from CLI input. |
| src/cli/run.ts | Update | Parse permission mode from CLI input. |
| src/tools/fake-shell.ts | Update | Normalize fake-shell mode at the tool boundary. |
| src/agent/loop.ts | Update | Fail loop results when tool observations fail. |
| src/cli/evidence.ts | Update | Parse evidence result values at runtime. |
| src/harness/validate.ts | Update | Validate evidence JSONL enum values. |
| src/cli/run-scaffold.ts | Update | Reject stale scenario file reuse. |
| src/cli/task.ts | Update | Exclude global options from task create title. |
| tests/* | Update | Add focused regression coverage. |
| tasks/T-0037-runtime-validation-harness-semantics/* | Add/Update | Track task capsule, evidence, and handoff. |
| docs/TASK_BOARD.md | Update | Track T-0037 status. |
| docs/PROJECT_STATE.md | Update | Record hardening when done. |
| docs/DEVELOPMENT_SLICES.md | Update | Track hardening slice. |
| docs/AGENT_HANDOFF.md | Update | Refresh next-session handoff. |
