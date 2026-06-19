# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `context cache warm --execute` writes schema-valid shard records for task-board, docs-registry, and command-registry extractors. | Met | `tests/unit/context-cache-store.test.ts`; ev:T-0367:3ea9270b38914be8af628ee0 |
| AC-2 | `context graph --json` consumes fresh shard records read-only and reports cache metadata while producing schema-valid graph output. | Met | `tests/unit/context-graph-cli.test.ts`; ev:T-0367:3ea9270b38914be8af628ee0 |
| AC-3 | Source-code-only changes do not invalidate non-code task/docs/command shards, while relevant doc changes do invalidate the matching shard. | Met | `tests/unit/context-cache-store.test.ts`; ev:T-0367:3ea9270b38914be8af628ee0 |
| AC-4 | Missing, stale, corrupt, or schema-mismatched shard records fall back to live extraction without command failure. | Met | `src/context/context-graph-builder.ts`; ev:T-0367:3ea9270b38914be8af628ee0 |
| AC-5 | Focused and Docker validation results are recorded in `EVIDENCE.md` and `evidence.jsonl`. | Met | ev:T-0367:3ea9270b38914be8af628ee0; ev:T-0367:b39db4c678314b00bedc1075; ev:T-0367:5c992744d9874413b60f34ea |
| AC-6 | Project state and handoff docs are updated before close. | Met | docs/PROJECT_STATE.md; docs/AGENT_HANDOFF.md; docs/DEVELOPMENT_SLICES.md |
