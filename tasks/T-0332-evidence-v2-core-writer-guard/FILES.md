# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/evidence/evidence.ts` | Modify | Add exported result/outcome validator and core writer mismatch error before append writes. | Done |
| `src/cli/evidence.ts` | Modify | Reuse core validator for CLI add-command mismatch handling. | Done |
| `src/cli/evidence-json.ts` | Modify | Convert core writer mismatch errors into collect report issues. | Done |
| `tests/unit/evidence-json.test.ts` | Modify | Add direct writer and collect-report mismatch regression tests. | Done |
| `tasks/T-0332-evidence-v2-core-writer-guard/*` | Modify | Track T-0332 scope, evidence, and handoff. | In Progress |
| `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` | Modify | Record completion state before close if validation passes. | Pending |
