# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/evidence/evidence.ts` | Modified | Default evidence appends now persist v2 records with durable ids, fingerprints, artifacts, tags, and legacy v1 metadata. | Done |
| `src/evidence/normalizer.ts` | Modified | Normalizes persisted v1/v2 records into one semantic read model while preserving durable v2 identity. | Done |
| `src/services/evidence-list.ts` | Modified | Parses and sanitizes v1/v2 mixed evidence lists. | Done |
| `src/services/evidence-lint.ts` | Modified | Lints v1/v2 JSONL records and feeds valid mixed records into semantic analysis. | Done |
| `src/harness/validate.ts` | Modified | Done-level harness accepts v2 records and uses v2 legacy metadata for compatibility checks. | Done |
| `src/task/task-close.ts` | Modified | Close/audit checks recognize v2 close evidence through legacy compatibility fields. | Done |
| `src/services/task-read-model.ts` | Modified | Task read-model embedded evidence uses persisted v1/v2 record unions. | Done |
| `src/services/task-workbench.ts` | Modified | Workbench close/proof summaries read v1/v2 evidence through shared helpers. | Done |
| `src/services/dashboard-task-detail.ts` | Modified | Dashboard task detail proof/close summaries recognize v1/v2 evidence records. | Done |
| `src/services/dashboard-timeline.ts` | Modified | Timeline fallback evidence events use shared v1/v2 helper fields. | Done |
| `src/agent/evidence.ts` | Modified | Agent evidence attachment reads artifact paths from v1/v2 records safely. | Done |
| `src/cli/evidence.ts` | Modified | Human evidence list output displays v1/v2 kind/result through shared helpers. | Done |
| `src/cli/evidence-json.ts` | Modified | Evidence collect/add-command JSON output returns persisted v2 evidence records. | Done |
| `src/schemas/evidence-list.schema.json` | Modified | Evidence list schema accepts v1 or v2 persisted records. | Done |
| `tests/unit/evidence-json.test.ts` | Modified | Covers v2 default writer and collect payload shape. | Done |
| `tests/unit/evidence-list.test.ts` | Modified | Covers v2 public/private append and list behavior. | Done |
| `tests/unit/evidence-lint.test.ts` | Modified | Covers v2 lint summary and semantic compatibility. | Done |
| `tests/unit/evidence-normalizer.test.ts` | Modified | Adds durable v2 normalization regression coverage. | Done |
| `tests/contract/mcp-evidence-attach-guard.test.ts` | Modified | Aligns opt-in attach guard payload expectations with v2 writer output. | Done |
| `tests/contract/mcp-evidence-attach-safety.test.ts` | Modified | Aligns MCP attach safety payload expectations with v2 writer output and artifacts. | Done |
| `tests/harness/dogfooding-e2e-fixture.test.ts` | Modified | Keeps dogfooding evidence and generated capsule fixtures compatible with v2 default writes. | Done |
| `tests/harness/task-capsule.test.ts` | Modified | Updates capsule evidence append schema expectations for v2 records. | Done |
| `tasks/T-0233-evidence-v2-persisted-id-writer-mvp/*` | Added/Modified | Active capsule scope, evidence, validation, risks, decisions, and handoff. | Done |
| `docs/PROJECT_STATE.md` | Modified | Records Evidence v2 writer MVP completion and deferred migration boundaries. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Updates current handoff, validation baseline, and next recommended core-value work. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds T-0233 slice completion. | Done |
| `docs/TASK_BOARD.md` | Modified | Marks T-0233 Done through task finish. | Done |
