# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/evidence/evidence.ts` | Modified | Allows canonical text artifact writer to place release artifacts in semantic artifact directories while still writing v2 records. | Done |
| `src/services/smoke-evidence.ts` | Modified | Replaces direct v1 JSONL/Markdown writes with canonical `appendEvidenceTextArtifact()`. | Done |
| `src/services/release-artifact-evidence.ts` | Modified | Replaces direct v1 JSONL/Markdown writes with canonical `appendEvidenceTextArtifact()`. | Done |
| `src/services/release-evidence.ts` | Modified | Reads v1/v2 persisted release evidence and accepts v2 strict release proof through shared normalized semantics. | Done |
| `src/cli/release-artifact.ts` | Modified | Displays artifact paths from v1/v2 evidence records through shared helper. | Done |
| `tests/unit/release-dry-run.test.ts` | Modified | Adds v2 persisted release evidence strict proof fixture. | Done |
| `tests/unit/release-artifact.test.ts` | Modified | Expects release artifact attach output to be v2. | Done |
| `tests/unit/package-smoke-dry-run.test.ts` | Modified | Expects package-smoke attach output to be v2 while preserving artifact path. | Done |
| `tests/unit/clean-checkout-smoke.test.ts` | Modified | Expects clean-checkout attach output to be v2 while preserving artifact path. | Done |
| `tasks/T-0234-evidence-v2-release-read-model-compatibility/*` | Added/Modified | Active capsule docs and evidence. | Done |
| `docs/PROJECT_STATE.md` | Modified | Records T-0234 completion and revised deferred migration boundary. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Updates next-session handoff and validation baseline. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds T-0234 completion row. | Done |
| `docs/TASK_BOARD.md` | Modified | Marks T-0234 Done through task finish. | Done |
