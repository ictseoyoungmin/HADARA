# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/services/ci-gate.ts | Modify | Add empty-scope guard, `allowEmpty`, and `scope:tasks` check. | Done |
| src/cli/ci.ts | Modify | Thread `--allow-empty` into the gate report. | Done |
| src/cli/main.ts | Modify | Document `--allow-empty` in ci gate usage. | Done |
| src/evidence/evidence.ts | Modify | Lock metadata, clearer timeout diagnostics, export idempotency-key reader. | Done |
| src/task/task-close.ts | Modify | Export `closeRelevantSourceRelativePaths` for reuse. | Done |
| src/services/proof-status.ts | Modify | Freshness `checkedSources` reflects real close-source set. | Done |
| src/cli/evidence.ts | Modify | Non-JSON add-command/collect report idempotent no-ops. | Done |
| tests/fixtures/parallel-evidence-append.ts | Add | Worker entry for cross-process append regression. | Done |
| tests/unit/evidence-parallel-append.test.ts | Add | Real multi-process append regression (idempotent + keyless). | Done |
| docs/CLI_JSON_CONTRACT.md | Modify | Document ci gate `--allow-empty`/scope semantics. | Done |
