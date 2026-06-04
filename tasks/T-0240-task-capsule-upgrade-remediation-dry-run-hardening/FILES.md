# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-upgrade-scaffold.ts` | Modify | Add report-level before-hash plan guard and execute validation. | Done |
| `src/services/protocol-remediation.ts` | Modify | Add matching before-hash plan guard for safe protocol remediation writes. | Done |
| `src/cli/task.ts` | Modify | Pass `--before-hash` into task upgrade-scaffold reports. | Done |
| `src/cli/protocol.ts` | Modify | Pass `--before-hash` into protocol remediation reports. | Done |
| `src/cli/main.ts` | Modify | Align CLI usage text with hash-guarded execute. | Done |
| `src/services/workbench-next-actions.ts` | Modify | Make remediation execute guidance reference the reviewed dry-run hash. | Done |
| `src/schemas/task-upgrade-scaffold.schema.json` | Modify | Document additive `summary.beforeHash`. | Done |
| `src/schemas/protocol-remediation.schema.json` | Modify | Document additive `summary.beforeHash`. | Done |
| `src/schemas/schema-index.json` | Modify | Align schema notes. | Done |
| `tests/unit/task-upgrade-scaffold.test.ts` | Modify | Cover dry-run hash, missing/stale hash refusal, and guarded execute. | Done |
| `tests/unit/protocol-remediation.test.ts` | Modify | Cover dry-run hash, missing/stale hash refusal, guarded execute, and apply-time conflict. | Done |
| `tests/unit/workbench-next-actions.test.ts` | Modify | Align remediation execute guidance. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Modify | Document reviewed dry-run hash requirement. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Modify | Add dry-run remediation guard rule. | Done |
| `docs/SCHEMAS.md` | Modify | Align schema notes. | Done |
| `docs/TEST_STRATEGY.md` | Modify | Add validation expectations for hash-guarded remediation. | Done |
| `docs/PROJECT_STATE.md` | Modify | Record the new safety contract. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modify | Record T-0240 slice. | Done |
| `docs/AGENT_HANDOFF.md` | Modify | Record latest work and next direction. | Done |
| `tasks/T-0240-task-capsule-upgrade-remediation-dry-run-hardening/*` | Modify | Maintain task capsule state, evidence, and handoff. | Done |
