# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/release-targets.ts` | Modified | Added `ReleaseProvider` contract, provider capability states, `NpmReleaseProvider`, and preview-only `PythonReleaseProvider`. | Done |
| `src/services/release-dry-run.ts` | Modified | Exposes provider capability report in release dry-run output. | Done |
| `src/schemas/release-dry-run.schema.json` | Modified | Validates additive `providerCapabilities` block. | Done |
| `tests/unit/release-dry-run.test.ts` | Modified | Covers npm and Python provider capabilities. | Done |
| `tests/unit/schema-runtime.test.ts` | Modified | Updates release dry-run schema runtime fixture. | Done |
| `dist/` | Refreshed | Synced built CLI output from Docker build for workspace smokes. | Done |
| `docs/PROJECT_STATE.md` | Modified | Records completed provider contract capability. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds T-0246 release provider contract slice. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Updates compact handoff after T-0246. | Done |
